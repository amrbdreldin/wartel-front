"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";
import { db, app } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { setNotifications, type Notification } from "@/store/slices/notificationSlice";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { getMessaging, onMessage, isSupported } from "firebase/messaging";

export function FirebaseNotificationListener() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const { role } = useRole();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("notifications");

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    let isFirstSnapshot = true;
    const userIdStr = String(user.id);
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userIdStr)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Notification[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          let createdAtStr = new Date().toISOString();
          
          if (data.createdAt) {
            if (typeof data.createdAt.toDate === "function") {
              createdAtStr = data.createdAt.toDate().toISOString();
            } else if (data.createdAt.seconds) {
              createdAtStr = new Date(data.createdAt.seconds * 1000).toISOString();
            } else {
              createdAtStr = String(data.createdAt);
            }
          }

          return {
            id: doc.id,
            type: data.type || "info",
            title: data.title || "",
            message: data.message || "",
            is_read: data.isRead ?? false,
            created_at: createdAtStr,
            metadata: data.metadata || null,
          };
        });

        items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        dispatch(setNotifications(items));

        if (isFirstSnapshot) {
          isFirstSnapshot = false;
        } else {
          const addedChanges = snapshot.docChanges()
            .filter((change) => change.type === "added")
            .map((change) => {
              const data = change.doc.data();
              let createdAtTime = Date.now();
              if (data.createdAt) {
                if (typeof data.createdAt.toDate === "function") {
                  createdAtTime = data.createdAt.toDate().getTime();
                } else if (data.createdAt.seconds) {
                  createdAtTime = data.createdAt.seconds * 1000;
                } else {
                  createdAtTime = new Date(String(data.createdAt)).getTime();
                }
              }
              return { change, data, createdAtTime };
            });

          if (addedChanges.length > 0) {
            // Sort by createdAtTime descending, so the newest is first
            addedChanges.sort((a, b) => b.createdAtTime - a.createdAtTime);

            const newest = addedChanges[0];
            const { data } = newest;
            const fallbackTitle = t("newNotification");
            const titleText = data.title || fallbackTitle;
            const messageText = data.message || "";
            
            const activeGroupId = typeof window !== "undefined" ? sessionStorage.getItem("active_chat_group_id") : null;
            const isCurrentChat = data.type === "chat" && data.metadata?.groupId && String(data.metadata.groupId) === String(activeGroupId);

            if (!isCurrentChat) {
              toast.info(titleText, {
                description: messageText,
                className: "bg-background border border-border/80 text-foreground",
              });

              if (
                typeof window !== "undefined" &&
                "Notification" in window &&
                Notification.permission === "granted"
              ) {
                try {
                  const notification = new Notification(titleText, {
                    body: messageText,
                    icon: "/logo.png",
                    tag: data.metadata?.groupId ? `chat-${data.metadata.groupId}` : undefined,
                    requireInteraction: false,
                  });

                  notification.onclick = (e) => {
                    e.preventDefault();
                    window.focus();

                    if (data.type === "chat" && data.metadata?.groupId) {
                      if (role === "teacher") {
                        router.push(`/${locale}/teacher/messages`);
                      } else {
                        router.push(`/${locale}/student/messages`);
                      }
                    } else {
                      if (role === "teacher") {
                        router.push(`/${locale}/teacher`);
                      } else if (role === "parent") {
                        router.push(`/${locale}/parent`);
                      } else {
                        router.push(`/${locale}/student`);
                      }
                    }
                    notification.close();
                  };
                } catch (error) {
                  console.error("[Notifications] Failed to trigger native desktop notification:", error);
                }
              }
            }
          }
        }
      },
      (error) => {
        console.error("Firestore Notification Listener Error:", error);
      }
    );

    let unsubscribeFCM: (() => void) | null = null;
    let isSubscribed = true;

    const setupFCM = async () => {
      try {
        const supported = await isSupported();
        if (!supported || !isSubscribed) return;

        const messaging = getMessaging(app);
        unsubscribeFCM = onMessage(messaging, (payload) => {
          console.log("[FCM Client] Foreground message payload: ", payload);
          const titleText = payload.notification?.title || t("newNotification");
          const messageText = payload.notification?.body || "";
          const payloadGroupId = payload.data?.groupId;

          const activeGroupId = typeof window !== "undefined" ? sessionStorage.getItem("active_chat_group_id") : null;
          const isCurrentChat = payloadGroupId && String(payloadGroupId) === String(activeGroupId);

          if (!isCurrentChat) {
            toast.info(titleText, {
              description: messageText,
              className: "bg-background border border-border/80 text-foreground",
            });

            if (
              typeof window !== "undefined" &&
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              try {
                const notification = new Notification(titleText, {
                  body: messageText,
                  icon: "/logo.png",
                  tag: payloadGroupId ? `chat-${payloadGroupId}` : undefined,
                  requireInteraction: false,
                });

                notification.onclick = (e) => {
                  e.preventDefault();
                  window.focus();
                  
                  if (payloadGroupId) {
                    if (role === "teacher") {
                      router.push(`/${locale}/teacher/messages`);
                    } else {
                      router.push(`/${locale}/student/messages`);
                    }
                  }
                  notification.close();
                };
              } catch (error) {
                console.error("[FCM Client] Failed to trigger native notification:", error);
              }
            }
          }
        });
      } catch (err) {
        console.error("[FCM Client] Error initializing foreground messaging:", err);
      }
    };

    setupFCM();

    return () => {
      isSubscribed = false;
      unsubscribe();
      if (unsubscribeFCM) {
        unsubscribeFCM();
      }
    };
  }, [isAuthenticated, user?.id, dispatch, role, locale, router, t]);

  return null;
}
