import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { app } from "@/lib/firebase";
import { toast } from "sonner";

/**
 * Registers the Firebase Service Worker dynamically with config query params
 * and retrieves the FCM registration token if notifications are allowed.
 * Handles permission throttling (does not annoy the user if denied/dismissed).
 */
export async function requestNotificationToken(
  blockedGuideMessage: string,
  force?: boolean
): Promise<string | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("Notification" in window)) {
    console.log("[FCM] Notifications or service workers are not supported by this browser.");
    return null;
  }

  try {
    const messagingSupported = await isSupported();
    if (!messagingSupported) {
      console.log("[FCM] Firebase messaging is not supported in this browser.");
      return null;
    }

    const ONE_DAY = 24 * 60 * 60 * 1000;
    const lastPromptTime = localStorage.getItem("fcm_last_prompt_time");

    // 1. If permission is already granted, get the token directly
    if (Notification.permission === "granted") {
      return await fetchFCMToken();
    }

    // 2. If permission is blocked (denied)
    if (Notification.permission === "denied") {
      if (!force && lastPromptTime && Date.now() - Number(lastPromptTime) < ONE_DAY) {
        console.log("[FCM] Permission is denied. Throttled notification warning prompt.");
        return null;
      }
      // Show guide on how to enable them (bypass throttle if force is true)
      localStorage.setItem("fcm_last_prompt_time", Date.now().toString());
      toast.warning(blockedGuideMessage, { id: "notifications-blocked-guide" });
      return null;
    }

    // 3. If permission is default (never asked or dismissed)
    if (Notification.permission === "default") {
      if (!force && lastPromptTime && Date.now() - Number(lastPromptTime) < ONE_DAY) {
        console.log("[FCM] Native permission prompt is throttled for 24 hours.");
        return null;
      }

      // Record the prompt attempt time
      localStorage.setItem("fcm_last_prompt_time", Date.now().toString());

      // Show native browser alert/dialog to request permission
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        return await fetchFCMToken();
      } else if (permission === "denied") {
        toast.warning(blockedGuideMessage, { id: "notifications-blocked-guide" });
      }
    }

    return null;
  } catch (error) {
    console.error("[FCM] Error requesting notification token:", error);
    return null;
  }
}

/**
 * Registers the Service Worker dynamically and obtains the FCM Token
 */
async function fetchFCMToken(): Promise<string | null> {
  try {
    const messaging = getMessaging(app);

    // Extract firebase credentials to pass to the service worker dynamically via query parameters
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
    const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "";
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
    const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "";
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "";

    const queryParams = new URLSearchParams({
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    }).toString();

    // Register service worker with the query parameters
    const registration = await navigator.serviceWorker.register(
      `/firebase-messaging-sw.js?${queryParams}`,
      { scope: "/" }
    );

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.warn("[FCM] NEXT_PUBLIC_FIREBASE_VAPID_KEY is not defined in environment variables.");
    }

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    console.log("[FCM] Successfully obtained token:", token);
    return token;
  } catch (error) {
    console.error("[FCM] Failed to fetch token or register service worker:", error);
    return null;
  }
}
