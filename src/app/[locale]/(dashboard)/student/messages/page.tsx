"use client";

import { X, BookOpen, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { studentService } from "@/services/student.service";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  arrayUnion,
  query,
  where,
  getDocs,
  writeBatch,
  FieldValue
} from "firebase/firestore";
import { ChatRoom } from "@/components/common/messages/ChatRoom";
import { ChatSkeleton } from "@/components/common/messages/ChatSkeleton";
import { useSelector } from "react-redux";
import { selectNotifications } from "@/store/slices/notificationSlice";
import type { RootState } from "@/store";

interface GroupChatMetadata {
  group_id: number;
  group_name: string;
  is_active: string;
  teacher_id?: string | number | null;
}

export default function MessagesPage() {
  const t = useTranslations("student");
  const { user } = useAuth();
  const [groups, setGroups] = useState<GroupChatMetadata[]>([]);
  const [activeGroup, setActiveGroup] = useState<GroupChatMetadata | null>(null);
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

  // 1. Fetch Student Joined Groups
  useEffect(() => {
    async function loadGroups() {
      if (!user?.id) return;
      try {
        const response = await studentService.getDetailedProfile(user.id);
        const joinedGroups = response?.joined_groups || [];

        const mappedGroups = joinedGroups.map((g: {
          group_id: number;
          group_name: string;
          is_active: string;
          teacher_id?: string | number | null;
          teacher?: { id: number | string };
          teacher_details?: { id: number | string };
          group?: { teacher_id: number | string };
        }) => ({
          group_id: g.group_id,
          group_name: g.group_name,
          is_active: g.is_active,
          teacher_id: g.teacher_id || g.teacher?.id || g.teacher_details?.id || g.group?.teacher_id || null,
        }));

        setGroups(mappedGroups);
        if (mappedGroups.length > 0) {
          setActiveGroup(mappedGroups[0]);
        }
      } catch (error) {
        console.error("Error loading student groups:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadGroups();
  }, [user?.id]);

  // 2. Self-Healing Group & Student Registry in Firestore
  useEffect(() => {
    if (!activeGroup || !user) return;

    async function registerStudentInFirestore() {
      if (!user?.id || !activeGroup) return;
      const { group_id, group_name, teacher_id } = activeGroup;
      const groupRef = doc(db, "groups_chats", String(group_id));
      try {
        const groupSnap = await getDoc(groupRef);
        const studentInfo = { id: String(user.id), name: user.full_name };

        const baseGroupData: {
          groupId: number;
          groupName: string;
          lastMessage: string;
          lastMessageAt: FieldValue;
          teacherId?: string;
        } = {
          groupId: group_id,
          groupName: group_name,
          lastMessage: "",
          lastMessageAt: serverTimestamp(),
        };

        if (teacher_id) {
          baseGroupData.teacherId = String(teacher_id);
        }

        if (!groupSnap.exists()) {
          // Initialize group chat metadata if it doesn't exist
          await setDoc(groupRef, {
            ...baseGroupData,
            students: [studentInfo],
          });
        } else {
          // Check if student is already in the registry
          const data = groupSnap.data();
          const students = data.students || [];
          const exists = students.some((s: { id: string; name: string }) => String(s.id) === String(user.id));

          const updates: Record<string, string | FieldValue> = {};
          if (!exists) {
            updates.students = arrayUnion(studentInfo);
          }
          if (teacher_id && !data.teacherId) {
            updates.teacherId = String(teacher_id);
          }

          if (Object.keys(updates).length > 0) {
            await updateDoc(groupRef, updates);
          }
        }
      } catch (err) {
        console.error("Firestore Registry Error:", err);
      }
    }
    registerStudentInFirestore();
  }, [activeGroup, user]);

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

  // 3. Send Message & Notify Teacher & other Students
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
      // A. Write message to active group channel
      await addDoc(collection(db, "groups_chats", groupIdStr, "messages"), {
        senderId: String(user.id),
        senderName: user.full_name,
        senderRole: "student",
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

      // B. Update group chat metadata with last message preview
      const groupRef = doc(db, "groups_chats", groupIdStr);
      await updateDoc(groupRef, {
        lastMessage: content,
        lastMessageAt: serverTimestamp(),
        lastSenderName: user.full_name,
        lastSenderId: String(user.id),
      });

      // C. Trigger real-time Notification in Firestore for Teacher & other Students
      const groupSnap = await getDoc(groupRef);
      if (groupSnap.exists()) {
        const data = groupSnap.data();
        const targetTeacherId = data.teacherId || activeGroup.teacher_id;
        const students = data.students || [];

        const batch = writeBatch(db);

        // 1. Notify the teacher
        if (targetTeacherId) {
          const teacherNotifRef = doc(collection(db, "notifications"));
          batch.set(teacherNotifRef, {
            userId: String(targetTeacherId),
            title: `رسالة جديدة في حلقة ${activeGroup.group_name}`,
            message: `${user.full_name}: ${content.substring(0, 50)}${content.length > 50 ? "..." : ""}`,
            type: "chat",
            isRead: false,
            createdAt: serverTimestamp(),
            metadata: {
              groupId: activeGroup.group_id,
            },
          });
        }

        // 2. Notify other students in the group
        students.forEach((student: { id: string | number; name: string }) => {
          if (String(student.id) !== String(user.id)) {
            const studentNotifRef = doc(collection(db, "notifications"));
            batch.set(studentNotifRef, {
              userId: String(student.id),
              title: `رسالة جديدة في حلقة ${activeGroup.group_name}`,
              message: `${user.full_name}: ${content.substring(0, 50)}${content.length > 50 ? "..." : ""}`,
              type: "chat",
              isRead: false,
              createdAt: serverTimestamp(),
              metadata: {
                groupId: activeGroup.group_id,
              },
            });
          }
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
                  {activeGroup?.group_name || t("chatTitle")}
                </span>
                <span className="text-[9px] text-muted-foreground block truncate">
                  {t("chatSubtitle")}
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
                      <span className="font-bold text-xs block truncate">
                        {group.group_name}
                      </span>
                      <span className="text-[9px] text-muted-foreground block truncate">
                        {t("chatSubtitle")}
                      </span>
                    </div>
                    {count > 0 && (
                      <span className="bg-destructive text-destructive-foreground text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                        {count}
                      </span>
                    )}
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
                  <span className={cn("font-bold text-xs lg:text-sm flex items-center gap-1.5 truncate max-w-[120px] lg:max-w-none", isSelected ? "text-primary" : "text-foreground")}>
                    {group.group_name}
                    {count > 0 && (
                      <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-destructive animate-pulse" />
                    )}
                  </span>
                  {count > 0 && (
                    <span className="bg-destructive text-destructive-foreground text-[8px] lg:text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-in zoom-in duration-300 shrink-0">
                      {count}
                    </span>
                  )}
                </div>
                <span className="text-[9px] lg:text-[10px] font-medium text-muted-foreground truncate w-full block">
                  {t("chatSubtitle")}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* 3. Main Chat Room */}
      <ChatRoom
        groupId={activeGroup?.group_id || ""}
        groupName={activeGroup?.group_name || t("chatTitle")}
        courseName={t("chatSubtitle")}
        currentUser={{
          id: user?.id || "",
          full_name: user?.full_name || "",
          role: "student",
          role_id: user?.role_id || "",
        }}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
