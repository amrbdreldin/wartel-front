import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/lib/constants";

/** Maps a File MIME type to a simple media category */
export type MediaType = "image" | "audio" | "video" | "document";

export function getMediaType(file: File): MediaType {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  return "document";
}

/**
 * Normalizes a media URL, ensuring it is absolute and points to the backend server
 * if it was returned as a relative path.
 */
export function getAbsoluteMediaUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const backendBase = "https://admin.wartel-academy.com";
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${backendBase}${cleanUrl}`;
}

/**
 * Derives the MediaType category from a URL string or filename.
 */
export function getMediaTypeFromUrl(url: string, fallbackType?: string): MediaType {
  // Strip query params and hash so that URLs like /file.png?v=123 still resolve correctly
  let pathname = url;
  try {
    // Works for absolute URLs; for relative paths we just strip manually
    if (url.startsWith("http://") || url.startsWith("https://")) {
      pathname = new URL(url).pathname;
    } else {
      pathname = url.split("?")[0].split("#")[0];
    }
  } catch {
    pathname = url.split("?")[0].split("#")[0];
  }

  const p = pathname.toLowerCase();

  if (p.endsWith(".png") || p.endsWith(".jpg") || p.endsWith(".jpeg") || p.endsWith(".gif") || p.endsWith(".webp") || p.endsWith(".svg") || p.endsWith(".bmp")) {
    return "image";
  }
  if (p.endsWith(".mp3") || p.endsWith(".wav") || p.endsWith(".ogg") || p.endsWith(".m4a") || p.endsWith(".aac") || p.endsWith(".flac")) {
    return "audio";
  }
  // .webm could be audio or video — if there's no better hint treat as audio
  if (p.endsWith(".webm")) {
    return fallbackType === "video" ? "video" : "audio";
  }
  if (p.endsWith(".mp4") || p.endsWith(".mov") || p.endsWith(".avi") || p.endsWith(".mkv")) {
    return "video";
  }
  if (p.endsWith(".pdf")) return "document";
  if (p.endsWith(".doc") || p.endsWith(".docx")) return "document";
  if (p.endsWith(".xls") || p.endsWith(".xlsx")) return "document";

  if (fallbackType === "image" || fallbackType === "audio" || fallbackType === "video" || fallbackType === "document") {
    return fallbackType;
  }
  return "document";
}

/**
 * Uploads a file to the backend media endpoint.
 * Returns the public URL of the uploaded file.
 *
 * POST /media/upload   (form-data, field: "file")
 * Response: { success: true, data: { url: string } }
 */
export async function uploadChatMedia(file: File): Promise<string> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/proxy";
  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${apiBase}/media/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  let json: any;
  try {
    json = await res.json();
  } catch (err) {
    // Response might not be JSON, ignore parsing error
  }

  if (!res.ok) {
    const errMsg = json?.message || `Media upload failed: ${res.status} ${res.statusText}`;
    throw new Error(errMsg);
  }

  if (!json?.success || !json?.data?.url) {
    const errMsg = json?.message || "Media upload response is missing URL";
    throw new Error(errMsg);
  }

  return getAbsoluteMediaUrl(json.data.url as string);
}

interface SenderUser {
  id: string | number;
  full_name: string;
}

interface SendMeetingLinkParams {
  groupId: string | number;
  groupName: string;
  meetingUrl: string;
  user: SenderUser;
  messageText: string;
  notificationTitle: string;
}

export async function sendMeetingLinkToChat({
  groupId,
  groupName,
  meetingUrl,
  user,
  messageText,
  notificationTitle,
}: SendMeetingLinkParams): Promise<void> {
  const groupIdStr = String(groupId);
  const content = messageText.replace("{link}", meetingUrl);

  try {
    // 1. Write Message document in subcollection
    await addDoc(collection(db, "groups_chats", groupIdStr, "messages"), {
      senderId: String(user.id),
      senderName: user.full_name,
      senderRole: "teacher",
      content,
      createdAt: serverTimestamp(),
    });

    // 2. Self-healing setup / update metadata in group chat document
    const groupRef = doc(db, "groups_chats", groupIdStr);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      await setDoc(groupRef, {
        groupId: Number(groupId),
        groupName: groupName,
        teacherId: String(user.id),
        teacherName: user.full_name,
        students: [], // will self-heal when student/teacher loads messages
        lastMessage: content,
        lastMessageAt: serverTimestamp(),
        lastSenderName: user.full_name,
        lastSenderId: String(user.id),
      });
    } else {
      await updateDoc(groupRef, {
        lastMessage: content,
        lastMessageAt: serverTimestamp(),
        lastSenderName: user.full_name,
        lastSenderId: String(user.id),
      });
    }

    // 3. Broadcast notifications to students
    if (groupSnap.exists()) {
      const data = groupSnap.data();
      const students = data.students || [];

      if (students.length > 0) {
        const batch = writeBatch(db);

        students.forEach((student: { id: string | number; name: string }) => {
          const newNotifRef = doc(collection(db, "notifications"));
          batch.set(newNotifRef, {
            userId: String(student.id),
            title: notificationTitle,
            message: `${user.full_name}: ${content.substring(0, 50)}${content.length > 50 ? "..." : ""}`,
            type: "chat",
            isRead: false,
            createdAt: serverTimestamp(),
            metadata: {
              groupId: Number(groupId),
            },
          });
        });

        await batch.commit();
      }
    }
  } catch (error) {
    console.error("Failed to share meeting link in group chat:", error);
    throw error;
  }
}

/**
 * Safely slices/truncates a filename while preserving the extension at the end.
 * Useful to prevent layout overflow in chat bubbles on small screens.
 */
export function sliceFileName(fileName: string | undefined, maxLen = 25): string {
  if (!fileName) return "";
  if (fileName.length <= maxLen) return fileName;

  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return fileName.slice(0, maxLen - 3) + "...";
  }

  const ext = fileName.slice(lastDotIndex);
  const base = fileName.slice(0, lastDotIndex);

  const availableLen = maxLen - ext.length - 3; // 3 for the "..." separator
  if (availableLen <= 0) {
    return fileName.slice(0, maxLen - 3) + "...";
  }

  return base.slice(0, availableLen) + "..." + ext;
}

