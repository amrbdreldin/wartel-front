"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Users, X, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { teacherService } from "@/services/teacher.service";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  writeBatch,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { ChatRoom } from "@/components/common/messages/ChatRoom";
import { ChatSkeleton } from "@/components/common/messages/ChatSkeleton";
import { useSelector } from "react-redux";
import { selectNotifications } from "@/store/slices/notificationSlice";
import type { RootState } from "@/store";

interface TeacherGroupStudent {
  student_id: number;
  full_name: string;
}

interface TeacherGroupWithStudents {
  group_id: number;
  name: string;
  students: TeacherGroupStudent[];
  track?: { name: string };
  course?: { name: string };
}

export default function TeacherMessagesPage() {
  const t = useTranslations("student"); // Reuse student translations for basic items
  const locale = useLocale();
  const { user } = useAuth();
  const [groups, setGroups] = useState<TeacherGroupWithStudents[]>([]);
  const [activeGroup, setActiveGroup] = useState<TeacherGroupWithStudents | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Read notifications and compute unread counts per group
  const notifications = useSelector((state: RootState) => selectNotifications(state));
  const unreadChatNotifs = notifications.filter((n) => (n.type as string) === "chat" && !n.is_read);

  const getGroupUnreadCount = (groupId: number) => {
    return unreadChatNotifs.filter((n) => {
      const notifGroupId = n.metadata?.groupId;
      return String(notifGroupId) === String(groupId);
    }).length;
  };

  // 1. Fetch Teacher Groups with Student Lists
  useEffect(() => {
    async function loadTeacherGroups() {
      if (!user?.id) return;
      try {
        const response = await teacherService.getGroupsWithStudents();
        const list = response || [];
        setGroups(list);
        if (list.length > 0) {
          setActiveGroup(list[0]);
        }
      } catch (error) {
        console.error("Error loading teacher groups:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTeacherGroups();
  }, [user?.id]);

  // 2. Self-Healing Group & Teacher Registry in Firestore
  useEffect(() => {
    if (!groups.length || !user) return;

    async function registerGroupsInFirestore() {
      if (!user?.id) return;
      try {
        for (const group of groups) {
          const groupRef = doc(db, "groups_chats", String(group.group_id));
          const studentsMapped = group.students.map((s) => ({
            id: String(s.student_id),
            name: s.full_name,
          }));

          const groupSnap = await getDoc(groupRef);

          if (!groupSnap.exists()) {
            await setDoc(groupRef, {
              groupId: group.group_id,
              groupName: group.name,
              teacherId: String(user.id),
              teacherName: user.full_name,
              students: studentsMapped,
              lastMessage: "",
              lastMessageAt: serverTimestamp(),
            });
          } else {
            // Update/upsert the teacher and latest roster information
            await updateDoc(groupRef, {
              teacherId: String(user.id),
              teacherName: user.full_name,
              students: studentsMapped,
              groupName: group.name,
            });
          }
        }
      } catch (error) {
        console.error("Firestore Teacher Registry Error:", error);
      }
    }
    registerGroupsInFirestore();
  }, [groups, user]);

  // 3. Auto-Mark notifications for this group as read
  useEffect(() => {
    if (!activeGroup || !user?.id) return;

    async function markGroupNotificationsAsRead() {
      try {
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", String(user!.id)),
          where("type", "==", "chat"),
          where("isRead", "==", false)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const batch = writeBatch(db);
          let hasUpdates = false;
          snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const notifGroupId = data.metadata?.groupId;
            if (String(notifGroupId) === String(activeGroup!.group_id)) {
              batch.update(docSnap.ref, { isRead: true });
              hasUpdates = true;
            }
          });
          if (hasUpdates) {
            await batch.commit();
          }
        }
      } catch (error) {
        console.error("Error marking group notifications as read:", error);
      }
    }

    markGroupNotificationsAsRead();
  }, [activeGroup, user]);

  // 3. Send Message & Notify Class Students
  const handleSendMessage = async (
    content: string,
    mediaUrl?: string,
    mediaType?: string,
    mediaName?: string,
    replyToId?: string,
    replyToName?: string,
    replyToContent?: string,
    replyToMediaType?: string
  ) => {
    if (!activeGroup || !user) return;
    const groupIdStr = String(activeGroup.group_id);

    try {
      // A. Write Message document
      await addDoc(collection(db, "groups_chats", groupIdStr, "messages"), {
        senderId: String(user.id),
        senderName: user.full_name,
        senderRole: "teacher",
        content,
        ...(mediaUrl && { mediaUrl, mediaType, mediaName }),
        ...(replyToId && { 
          replyToId, 
          replyToName, 
          replyToContent,
          ...(replyToMediaType && { replyToMediaType })
        }),
        createdAt: serverTimestamp(),
      });

      // B. Update Last Message Preview in active metadata doc
      const groupRef = doc(db, "groups_chats", groupIdStr);
      await updateDoc(groupRef, {
        lastMessage: content,
        lastMessageAt: serverTimestamp(),
        lastSenderName: user.full_name,
        lastSenderId: String(user.id),
      });

      // C. Broadcast notification items in Firestore for each student in the group
      if (activeGroup.students && activeGroup.students.length > 0) {
        const batch = writeBatch(db);

        activeGroup.students.forEach((student) => {
          const newNotifRef = doc(collection(db, "notifications"));
          batch.set(newNotifRef, {
            userId: String(student.student_id),
            title: locale === "ar" ? `تنبيه من الأستاذ/ة في حلقة ${activeGroup.name}` : `Alert from your teacher in circle ${activeGroup.name}`,
            message: `${user.full_name}: ${content.substring(0, 50)}${content.length > 50 ? "..." : ""}`,
            type: "chat",
            isRead: false,
            createdAt: serverTimestamp(),
            metadata: {
              groupId: activeGroup.group_id,
            },
          });
        });

        await batch.commit();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  if (isLoading) {
    return <ChatSkeleton showSidebar={true} />;
  }

  if (groups.length === 0) {
    return (
      <div className="flex h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto shadow-inner">
            <X className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-foreground mb-2">{t("noGroupsFound")}</h4>
            <p className="text-muted-foreground">{t("searchAnother")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-3 lg:gap-6 px-0 lg:px-4">
      {/* 1. Mobile Dropdown Selector (only visible below lg, and only when groups > 1) */}
      {groups.length > 1 && (
        <div className="lg:hidden w-full relative shrink-0">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-card border border-border/40 rounded-2xl p-3 flex items-center justify-between shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-start transition-all"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <BookOpen className="w-4 h-4 text-primary shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-xs text-foreground block truncate">
                  {activeGroup?.name || t("chatTitle")}
                </span>
                <span className="text-[9px] text-muted-foreground block truncate">
                  {activeGroup?.course?.name || "حلقة القرآن الكريم"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {groups.some(
                (g) =>
                  g.group_id !== activeGroup?.group_id &&
                  getGroupUnreadCount(g.group_id) > 0
              ) && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
              )}
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  isDropdownOpen && "rotate-180"
                )}
              />
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full start-0 end-0 mt-1 bg-card border border-border/40 rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto p-1 animate-in fade-in slide-in-from-top-1 duration-200">
              {groups.map((group) => {
                const isSelected = activeGroup?.group_id === group.group_id;
                const count = getGroupUnreadCount(group.group_id);
                return (
                  <button
                    key={group.group_id}
                    onClick={() => {
                      setActiveGroup(group);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-start p-2 rounded-lg transition-all flex items-center justify-between gap-3 cursor-pointer",
                      isSelected
                        ? "bg-primary/5 text-primary font-bold"
                        : "hover:bg-muted/30 text-foreground"
                    )}
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-xs block truncate text-foreground">
                        {group.name}
                      </span>
                      <span className="text-[9px] text-muted-foreground block truncate">
                        {group.course?.name || "حلقة القرآن الكريم"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {count > 0 && (
                        <span className="bg-destructive text-destructive-foreground text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                          {count}
                        </span>
                      )}
                      <span className="bg-muted text-muted-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-border/50 flex items-center gap-0.5">
                        <Users className="w-2.5 h-2.5" />
                        {group.students.length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. Desktop Sidebar - Groups List (only visible on lg and above) */}
      <aside
        className="hidden lg:flex w-full lg:w-72 shrink-0 bg-card border border-border/40 rounded-2xl lg:rounded-3xl p-3 lg:p-4 flex-col h-auto lg:h-full overflow-hidden shadow-sm"
        role="navigation"
        aria-label="Active groups list"
      >
        <h2 className="font-bold text-foreground mb-2 lg:mb-4 flex items-center gap-2 text-xs lg:text-sm shrink-0">
          <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-primary" aria-hidden="true" />
          {t("activeGroup")} ({groups.length})
        </h2>

        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto gap-2 lg:space-y-2 px-1 py-1 min-h-0 w-full scrollbar-none">
          {groups.map((group) => {
            const isSelected = activeGroup?.group_id === group.group_id;
            const count = getGroupUnreadCount(group.group_id);
            return (
              <button
                key={group.group_id}
                onClick={() => {
                  setActiveGroup(group);
                }}
                aria-current={isSelected ? "true" : undefined}
                className={cn(
                  "w-52 lg:w-full shrink-0 text-start p-2.5 lg:p-4 rounded-xl lg:rounded-2xl border transition-all duration-300 flex flex-col gap-0.5 lg:gap-1 cursor-pointer hover:-translate-y-0.5 lg:hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary",
                  isSelected
                    ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10 shadow-sm"
                    : "bg-card border-border/40 hover:bg-muted/30"
                )}
              >
                <div className="flex justify-between items-start gap-2 w-full">
                  <span className={cn("font-bold text-xs lg:text-sm flex items-center gap-1.5 truncate max-w-[110px] lg:max-w-none", isSelected ? "text-primary" : "text-foreground")}>
                    {group.name}
                    {count > 0 && (
                      <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-destructive animate-pulse" />
                    )}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {count > 0 && (
                      <span className="bg-destructive text-destructive-foreground text-[8px] lg:text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-in zoom-in duration-300">
                        {count}
                      </span>
                    )}
                    <span className="bg-muted text-muted-foreground text-[9px] lg:text-[10px] font-bold px-1.5 py-0.5 lg:px-2 rounded-full border border-border/50 flex items-center gap-0.5 lg:gap-1">
                      <Users className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                      {group.students.length}
                    </span>
                  </div>
                </div>
                {group.course?.name && (
                  <span className="text-[9px] lg:text-[10px] font-medium text-muted-foreground truncate w-full block">
                    {group.course.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* 3. Main Chat Room */}
      <ChatRoom
        groupId={activeGroup?.group_id || ""}
        groupName={activeGroup?.name || ""}
        courseName={activeGroup?.course?.name || "حلقة القرآن الكريم"}
        currentUser={{
          id: user?.id || "",
          full_name: user?.full_name || "",
          role: "teacher",
          role_id: user?.role_id || "",
        }}
        onSendMessage={handleSendMessage}
        rosterStudents={activeGroup?.students.map((s) => ({
          student_id: s.student_id,
          full_name: s.full_name,
        }))}
      />
    </div>
  );
}
