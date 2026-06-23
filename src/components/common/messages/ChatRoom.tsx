"use client";

import { cn } from "@/lib/utils";
import {
  MessageSquareQuote,
  Send,
  X,
  Loader2,
  Users,
  Search,
  Star,
  Smile,
  Paperclip,
  FileAudio,
  FileVideo,
  FileText,
  Download,
  Play,
  Pause,
  Mic,
  MoreVertical,
  Trash2
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect, useRef, useCallback } from "react";
import { uploadChatMedia, getMediaType, type MediaType, getAbsoluteMediaUrl, getMediaTypeFromUrl, sliceFileName } from "@/utils/chat";
import { toast } from "sonner";
import { getAudioDuration } from "@/utils/audio";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  deleteField,
  limitToLast
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  mediaName?: string;
  createdAt: Timestamp | { seconds: number; nanoseconds: number } | null;
  starredBy?: string[];
  reactions?: Record<string, { emoji: string; userName: string }>;
  isDeleted?: boolean;
  replyToId?: string;
  replyToName?: string;
  replyToContent?: string;
  replyToMediaType?: string;
}

export interface RosterStudent {
  student_id: number;
  full_name: string;
}

interface ChatRoomProps {
  groupId: number | string;
  groupName: string;
  courseName?: string;
  currentUser: {
    id: number | string;
    full_name: string;
    role: "teacher" | "student";
    role_id?: string | number;
  };
  onSendMessage: (
    content: string,
    mediaUrl?: string,
    mediaType?: MediaType,
    mediaName?: string,
    replyToId?: string,
    replyToName?: string,
    replyToContent?: string,
    replyToMediaType?: string
  ) => Promise<void>;
  rosterStudents?: RosterStudent[];
  headerExtra?: React.ReactNode;
}

const POPULAR_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🎉", "🌟", "📚", "🌸", "✨", "👏", "🎓", "💡", "✍️", "🕌"];

export function AudioMessagePlayer({
  src,
  isCurrentUser,
  isMediaOnly = false,
  createdAt = null,
  isStarred = false,
  formatMessageTime,
  isTeacher = false
}: {
  src: string;
  isCurrentUser: boolean;
  isMediaOnly?: boolean;
  createdAt?: any;
  isStarred?: boolean;
  formatMessageTime?: (time: any) => string;
  isTeacher?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const locale = useLocale();
  const isRtl = locale === "ar";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const value = parseFloat(e.target.value);
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn(
      isMediaOnly
        ? cn(
            "flex flex-col p-3 rounded-2xl max-w-xs md:max-w-sm shadow-sm border relative justify-center min-w-[200px] md:min-w-[280px]",
            isCurrentUser
              ? "bg-primary text-primary-foreground border-primary rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none"
              : isTeacher
              ? "bg-amber-500/5 dark:bg-amber-500/10 text-foreground border-amber-500/20 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none"
              : "bg-muted/40 text-foreground border-border/60 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none"
          )
        : cn(
            "mt-2 flex items-center gap-3 p-3 rounded-2xl border max-w-xs md:max-w-sm shadow-sm shrink-0",
            isCurrentUser 
              ? "bg-black/15 border-white/10 text-primary-foreground" 
              : "bg-muted/50 border-border/40 text-foreground"
          )
    )}>
      <div className="flex items-center gap-3 w-full">
        <audio ref={audioRef} src={src} preload="metadata" />
        
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 active:scale-90 cursor-pointer shadow-md",
            isCurrentUser
              ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current translate-x-[1px]" />
          )}
        </button>

        {/* Progress & Time */}
        <div className="flex-1 min-w-0">
          <div className="relative flex items-center w-full h-4 group">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className={cn(
                "w-full h-1 rounded-lg appearance-none cursor-pointer outline-none transition-all focus:outline-none focus:ring-0",
                "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:active:scale-120",
                "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:active:scale-120",
                isCurrentUser
                  ? "bg-white/20 [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:bg-white"
                  : "bg-muted [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:bg-primary"
              )}
              style={{
                background: `linear-gradient(${isRtl ? "to left" : "to right"}, ${isCurrentUser ? '#FFFFFF' : '#008F8F'} ${progressPercentage}%, ${isCurrentUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} ${progressPercentage}%)`
              }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] md:text-xs opacity-75 font-semibold font-mono mt-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      {isMediaOnly && formatMessageTime && (
        <div className={cn("flex items-center justify-between gap-1.5 mt-2 w-full pt-1.5 opacity-80 shrink-0 border-t", isCurrentUser ? "border-white/10" : "border-border/20")}>
          {isStarred && !isCurrentUser && <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />}
          <span className={cn("text-[10px] md:text-xs font-bold ms-auto", isCurrentUser ? "text-primary-foreground/90" : "text-muted-foreground")}>{formatMessageTime(createdAt)}</span>
        </div>
      )}
    </div>
  );
}




async function compressAudio(
  fileOrBlob: File | Blob,
  fileName: string,
  audioContext: AudioContext | null,
  initAudioContext: () => AudioContext
): Promise<File> {
  try {
    const arrayBuffer = await fileOrBlob.arrayBuffer();
    let actx = audioContext || initAudioContext();
    if (actx.state === "suspended") {
      await actx.resume().catch(() => {});
    }

    const audioBuffer = await actx.decodeAudioData(arrayBuffer);
    const { audioBufferToMp3, downsampleAudioBuffer } = await import("@/utils/audio");

    // Attempt to downsample and compress to 16kHz mono MP3 (32 kbps)
    let processedBuffer = await downsampleAudioBuffer(audioBuffer, 16000);
    let mp3Blob = audioBufferToMp3(processedBuffer, 32);
    let compressedFile = new File([mp3Blob], fileName.replace(/\.[^/.]+$/, "") + ".mp3", { type: "audio/mp3" });

    // If still over 1MB, try lower sample rate and bitrate
    if (compressedFile.size > 1 * 1024 * 1024) {
      processedBuffer = await downsampleAudioBuffer(audioBuffer, 11025);
      mp3Blob = audioBufferToMp3(processedBuffer, 24);
      compressedFile = new File([mp3Blob], fileName.replace(/\.[^/.]+$/, "") + ".mp3", { type: "audio/mp3" });
    }

    return compressedFile;
  } catch (err) {
    console.error("Audio compression failed, returning original:", err);
    const ext = fileOrBlob.type.includes("mp4") ? "mp4" : fileOrBlob.type.includes("ogg") ? "ogg" : "webm";
    const name = fileOrBlob instanceof File ? fileOrBlob.name : `voice-message-${Date.now()}.${ext}`;
    return new File([fileOrBlob], name, { type: fileOrBlob.type });
  }
}

export function ChatRoom({
  groupId,
  groupName,
  courseName,
  currentUser,
  onSendMessage,
  rosterStudents,
  headerExtra
}: ChatRoomProps) {
  const t = useTranslations("student");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showRoster, setShowRoster] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeReactionMenuId, setActiveReactionMenuId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [limitCount, setLimitCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | null>(null);

  // Replying and highlighting states
  const [replyingTo, setReplyingTo] = useState<MessageItem | null>(null);
  const [highlightedMsgId, setHighlightedMsgId] = useState<string | null>(null);

  const handleScrollToMessage = (replyToId: string) => {
    const element = document.getElementById(`msg-bubble-${replyToId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedMsgId(replyToId);
      setTimeout(() => {
        setHighlightedMsgId(null);
      }, 2000);
    } else {
      toast.error(tCommon("errorOccurred") || "Message not found");
    }
  };

  // Media attachment state
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevGroupIdRef = useRef<number | string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const renderMessageDropdownMenu = (msg: MessageItem, isStarred: boolean, align: "start" | "end") => {
    return (
      <DropdownMenu
        open={activeMenuId === msg.id}
        onOpenChange={(open) => setActiveMenuId(open ? msg.id : null)}
      >
        <DropdownMenuTrigger
          type="button"
          className={cn(
            "p-1 rounded-xl hover:bg-muted text-muted-foreground transition-all cursor-pointer opacity-60 md:opacity-0 group-hover/msg:opacity-100 focus:opacity-100 more-menu-container",
            activeMenuId === msg.id && "opacity-100 bg-muted"
          )}
          title="More options"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent dir={isRtl ? "rtl" : "ltr"} align={align} className="w-[140px]">
          <DropdownMenuItem
            onClick={() => {
              setReplyingTo(msg);
              setTimeout(() => {
                chatInputRef.current?.focus();
              }, 50);
            }}
            className="cursor-pointer font-bold text-xs"
          >
            <MessageSquareQuote className="w-3.5 h-3.5 text-primary" />
            <span>{t("reply") || "Reply"}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              handleToggleStar(msg.id, isStarred);
            }}
            className="cursor-pointer font-bold text-xs"
          >
            <Star className={cn("w-3.5 h-3.5", isStarred ? "fill-amber-500 text-amber-500" : "text-muted-foreground")} />
            <span>{isStarred ? t("unstarMessage") : t("starMessage")}</span>
          </DropdownMenuItem>

          {(currentUser.role === "teacher" || String(currentUser.role_id) === "2") && (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                console.log("[ChatRoom] Delete option clicked for msgId:", msg.id);
                setActiveMenuId(null);
                setTimeout(() => {
                  setDeleteTargetId(msg.id);
                }, 100);
              }}
              className="cursor-pointer font-bold text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t("deleteMessage") || "Delete Message"}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Close emoji picker and reaction menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      const target = event.target as HTMLElement;
      if (!target.closest(".reaction-container")) {
        setActiveReactionMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recording timer and AudioContext cleanup
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch((err) => console.error("Error closing AudioContext", err));
      }
    };
  }, []);

  const stopRecording = useCallback(() => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const cancelRecording = useCallback(() => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    }
    setIsRecording(false);
    setRecordingDuration(0);
    audioChunksRef.current = [];
  }, []);

  const startRecording = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error(t("micAccessError") || "Microphone access is required to record voice messages");
        return;
      }

      // Initialize/resume AudioContext on user interaction gesture
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume().catch(() => {});
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      let mimeType = "";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
        mimeType = "audio/ogg;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/aac")) {
        mimeType = "audio/aac";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      }

      const options: MediaRecorderOptions = {};
      if (mimeType) {
        options.mimeType = mimeType;
      }

      const mr = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        const actualMimeType = mr.mimeType || mimeType || "audio/webm";
        const extension = actualMimeType.includes("mp4") ? "mp4" : actualMimeType.includes("ogg") ? "ogg" : "webm";
        const tempName = `voice-message-${Date.now()}.${extension}`;
        const blob = new Blob(audioChunksRef.current, { type: actualMimeType });

        const initAudioCtx = () => {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const actx = new AudioCtx();
          audioContextRef.current = actx;
          return actx;
        };

        const compressedFile = await compressAudio(blob, tempName, audioContextRef.current, initAudioCtx);
        (compressedFile as any).duration = recordingDuration;

        const MAX_SIZE = 10 * 1024 * 1024;
        if (compressedFile.size > MAX_SIZE) {
          toast.error(t("fileExceedsLimit") || "File size exceeds the 10MB limit");
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        setPendingFile(compressedFile);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        stream.getTracks().forEach((track) => track.stop());
      };

      mr.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 300) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error("Failed to start recording:", err);
      toast.error(t("micAccessError") || "Microphone access is required to record voice messages");
    }
  }, [t, stopRecording, previewUrl]);

  // Reset search and filters when active group changes
  useEffect(() => {
    setSearchQuery("");
    setShowStarredOnly(false);
    setShowSearch(false);
    setLimitCount(20);
    setHasMore(true);
    setMessages([]);
  }, [groupId]);

  // Set active group ID in sessionStorage to prevent notifications for the current chat room
  useEffect(() => {
    if (typeof window !== "undefined" && groupId) {
      sessionStorage.setItem("active_chat_group_id", String(groupId));
    }
    return () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("active_chat_group_id");
      }
    };
  }, [groupId]);


  // Listen to Real-time Messages for active Group with dynamic limit
  useEffect(() => {
    if (!groupId) return;

    const messagesQuery = query(
      collection(db, "groups_chats", String(groupId), "messages"),
      orderBy("createdAt", "asc"),
      limitToLast(limitCount)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const list: MessageItem[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          senderId: data.senderId,
          senderName: data.senderName,
          senderRole: data.senderRole,
          content: data.content,
          mediaUrl: data.mediaUrl || undefined,
          mediaType: data.mediaType || undefined,
          mediaName: data.mediaName || undefined,
          createdAt: data.createdAt,
          starredBy: data.starredBy || [],
          reactions: data.reactions || {},
          isDeleted: data.isDeleted || false,
          replyToId: data.replyToId || undefined,
          replyToName: data.replyToName || undefined,
          replyToContent: data.replyToContent || undefined,
          replyToMediaType: data.replyToMediaType || undefined,
        };
      });
      setMessages(list);

      // If the number of messages returned is less than the requested limitCount, 
      // it means there are no older messages left in Firestore.
      if (list.length < limitCount) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setIsLoadingMore(false);
    });

    return () => unsubscribe();
  }, [groupId, limitCount]);

  // Scroll and pagination anchoring behavior when messages update
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;

    // 1. If we switched groups, scroll to bottom instantly
    if (prevGroupIdRef.current !== groupId) {
      prevGroupIdRef.current = groupId;
      container.scrollTop = container.scrollHeight;
      return;
    }

    // 2. If we loaded more historical messages, do not scroll to bottom
    if (prevScrollHeight !== null) {
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = container.scrollTop + (newScrollHeight - prevScrollHeight);
      setPrevScrollHeight(null);
      return;
    }

    // 3. Otherwise (initial load or new message received), scroll to bottom if user is near bottom
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
    const lastMessage = messages[messages.length - 1];
    const sentByMe = lastMessage && String(lastMessage.senderId) === String(currentUser.id);

    if (isNearBottom || sentByMe || messages.length <= 20) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, groupId, prevScrollHeight, currentUser.id]);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    if (scrollContainerRef.current) {
      setPrevScrollHeight(scrollContainerRef.current.scrollHeight);
    }
    setLimitCount((prev) => prev + 20);
  };

  const clearPendingFile = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [previewUrl]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error(t("fileExceedsLimit") || "File size exceeds the 10MB limit");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate file type: images, pdfs, Word, Excel, voices/audio only
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isAudio = file.type.startsWith("audio/") || 
                    ["mp3", "wav", "ogg", "aac", "m4a", "webm"].some(ext => file.name.toLowerCase().endsWith("." + ext));
    const isWord = file.type === "application/msword" || 
                   file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
                   [".doc", ".docx"].some(ext => file.name.toLowerCase().endsWith(ext));
    const isExcel = file.type === "application/vnd.ms-excel" || 
                    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
                    [".xls", ".xlsx"].some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isImage && !isPdf && !isAudio && !isWord && !isExcel) {
      toast.error(t("invalidFileType") || "Only images, PDFs, Word, Excel, and audio files are allowed");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Revoke any previous object URL
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (isAudio) {
      // Compress selected audio files as in register form
      const processAudio = async () => {
        const initAudioCtx = () => {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const actx = new AudioCtx();
          audioContextRef.current = actx;
          return actx;
        };

        const duration = await getAudioDuration(file);
        const compressedFile = await compressAudio(file, file.name, audioContextRef.current, initAudioCtx);
        (compressedFile as any).duration = duration;
        setPendingFile(compressedFile);
        setPreviewUrl(null);
      };
      processAudio();
    } else {
      setPendingFile(file);
      if (isImage) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  }, [previewUrl, t]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasText = inputMessage.trim().length > 0;
    const hasFile = pendingFile !== null;
    if ((!hasText && !hasFile) || isSending || isUploading) return;

    // Reject audio messages shorter than 10 seconds
    const isAudioTooShort = pendingFile && pendingFile.type.startsWith("audio/") && 
                            (pendingFile as any).duration !== undefined && 
                            (pendingFile as any).duration > 0 && 
                            (pendingFile as any).duration < 10;
    if (isAudioTooShort) {
      toast.error(tValidation("audioTooShort") || "Audio duration must be at least 10 seconds");
      return;
    }

    const content = inputMessage.trim();
    setInputMessage("");

    const replyToId = replyingTo?.id;
    const replyToName = replyingTo?.senderId === currentUser.id ? (tCommon("me") || "أنا") : replyingTo?.senderName;
    const replyToContent = replyingTo?.content || "";
    const replyToMediaType = replyingTo?.mediaType || undefined;

    setReplyingTo(null);

    if (hasFile && pendingFile) {
      setIsUploading(true);
      try {
        const mediaUrl = await uploadChatMedia(pendingFile);
        const mediaType = getMediaType(pendingFile);
        const mediaName = pendingFile.name;
        clearPendingFile();
        setIsSending(true);
        await onSendMessage(content, mediaUrl, mediaType, mediaName, replyToId, replyToName, replyToContent, replyToMediaType);
      } catch (error) {
        console.error("Error uploading/sending media:", error);
        const errMsg = error instanceof Error ? error.message : String(error);
        toast.error(errMsg);
        setInputMessage(content);
      } finally {
        setIsUploading(false);
        setIsSending(false);
      }
    } else {
      setIsSending(true);
      try {
        await onSendMessage(content, undefined, undefined, undefined, replyToId, replyToName, replyToContent, replyToMediaType);
      } catch (error) {
        console.error("Error sending message inside ChatRoom:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const formatMessageTime = (msgCreatedAt: Timestamp | { seconds: number; nanoseconds: number } | null) => {
    if (!msgCreatedAt) return "...";
    const date = (msgCreatedAt as Timestamp).toDate ? (msgCreatedAt as Timestamp).toDate() : new Date((msgCreatedAt as { seconds: number }).seconds * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const isPm = hours >= 12;
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = hours.toString().padStart(2, "0");
    const ampm = isPm ? tCommon("pm") : tCommon("am");
    return `${hoursStr}:${minutes} ${ampm}`;
  };

  const handleToggleStar = async (messageId: string, isCurrentlyStarred: boolean) => {
    if (!groupId) return;
    const msgRef = doc(db, "groups_chats", String(groupId), "messages", messageId);
    try {
      await updateDoc(msgRef, {
        starredBy: isCurrentlyStarred
          ? arrayRemove(String(currentUser.id))
          : arrayUnion(String(currentUser.id)),
      });
    } catch (error) {
      console.error("Error toggling star:", error);
    }
  };

  const handleDeleteMessage = async () => {
    const isTeacher = currentUser.role === "teacher" || String(currentUser.role_id) === "2";
    console.log("[ChatRoom] handleDeleteMessage triggered:", { groupId, deleteTargetId, isTeacher, currentUser });
    if (!groupId || !deleteTargetId || !isTeacher) {
      console.warn("[ChatRoom] handleDeleteMessage early return conditions not met:", { groupId, deleteTargetId, isTeacher });
      return;
    }
    try {
      console.log("[ChatRoom] Attempting Firestore updateDoc for message deletion...");
      const msgRef = doc(db, "groups_chats", String(groupId), "messages", deleteTargetId);
      await updateDoc(msgRef, {
        isDeleted: true,
        content: "",
        mediaUrl: deleteField(),
        mediaType: deleteField(),
        mediaName: deleteField(),
        reactions: deleteField(),
        starredBy: deleteField()
      });
      toast.success(tCommon("success") || "Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error(tCommon("errorOccurred") || "Failed to delete message");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleReact = async (
    messageId: string,
    emoji: string,
    currentReactions: Record<string, { emoji: string; userName: string }> | undefined
  ) => {
    if (!groupId) return;
    const msgRef = doc(db, "groups_chats", String(groupId), "messages", messageId);
    try {
      const myCurrentReaction = currentReactions?.[currentUser.id];
      if (myCurrentReaction && myCurrentReaction.emoji === emoji) {
        // Remove reaction if same emoji tapped
        await updateDoc(msgRef, {
          [`reactions.${currentUser.id}`]: deleteField(),
        });
      } else {
        // Set new reaction
        await updateDoc(msgRef, {
          [`reactions.${currentUser.id}`]: {
            emoji,
            userName: currentUser.full_name,
          },
        });
      }
    } catch (error) {
      console.error("Error setting message reaction:", error);
    }
  };

  const getGroupedReactions = (reactions: Record<string, { emoji: string; userName: string }> | undefined) => {
    if (!reactions) return [];
    const groups: Record<string, { emoji: string; count: number; users: string[] }> = {};
    Object.entries(reactions).forEach(([, data]) => {
      if (!data || !data.emoji) return;
      if (!groups[data.emoji]) {
        groups[data.emoji] = { emoji: data.emoji, count: 0, users: [] };
      }
      groups[data.emoji].count += 1;
      groups[data.emoji].users.push(data.userName);
    });
    return Object.values(groups);
  };

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${escapeRegExp(search)})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 rounded px-0.5 py-0.2 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const renderMessageContent = (content: string, isCurrentUser: boolean) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return parts.map((part, i) => {
      if (part.startsWith("http://") || part.startsWith("https://")) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "underline font-bold break-all transition-colors",
              isCurrentUser
                ? "text-white hover:text-white/80"
                : "text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80"
            )}
          >
            {part}
          </a>
        );
      }
      return highlightText(part, searchQuery);
    });
  };

  const renderMediaContent = (msg: MessageItem, isCurrentUser: boolean, isMediaOnly = !msg.content) => {
    if (!msg.mediaUrl) return null;

    const absoluteUrl = getAbsoluteMediaUrl(msg.mediaUrl);
    // Resolve mediaType: stored type → URL extension → filename extension → "document"
    const mediaType = msg.mediaType || getMediaTypeFromUrl(absoluteUrl, msg.mediaName ? getMediaTypeFromUrl(msg.mediaName) : undefined);
    const isTeacher = msg.senderRole === "teacher";
    const baseClass = "mt-2 rounded-xl overflow-hidden max-w-full";

    if (mediaType === "image") {
      if (isMediaOnly) {
        return (
          <div className="relative group/img max-w-[200px] md:max-w-[240px] shadow-sm rounded-2xl overflow-hidden border border-border/40 bg-muted/10">
            <a href={absoluteUrl} target="_blank" rel="noopener noreferrer" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={absoluteUrl}
                alt={msg.mediaName || "image"}
                className="w-full max-h-[240px] object-cover hover:opacity-95 transition-opacity cursor-pointer"
                loading="lazy"
              />
            </a>
            {/* Gradient Overlay with Star + Timestamp */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2 pt-6 flex items-center justify-between text-white select-none pointer-events-none">
              {msg.starredBy?.includes(String(currentUser.id)) && (
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              )}
              <span className="text-[10px] md:text-xs font-bold opacity-90 ms-auto">
                {formatMessageTime(msg.createdAt)}
              </span>
            </div>
          </div>
        );
      } else {
        return (
          <a href={absoluteUrl} target="_blank" rel="noopener noreferrer" className={cn(baseClass, "block shadow-sm border border-black/10 hover:opacity-95 transition-opacity cursor-pointer")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={absoluteUrl}
              alt={msg.mediaName || "image"}
              className="max-w-[200px] max-h-[200px] rounded-xl object-cover"
              loading="lazy"
            />
          </a>
        );
      }
    }

    if (mediaType === "audio") {
      return (
        <AudioMessagePlayer
          src={absoluteUrl}
          isCurrentUser={isCurrentUser}
          isMediaOnly={isMediaOnly}
          createdAt={msg.createdAt}
          isStarred={msg.starredBy?.includes(String(currentUser.id))}
          formatMessageTime={formatMessageTime}
          isTeacher={isTeacher}
        />
      );
    }

    if (mediaType === "video") {
      if (isMediaOnly) {
        return (
          <div className="relative group/video max-w-[220px] md:max-w-[260px] shadow-sm rounded-2xl overflow-hidden border border-border/40 bg-black">
            <video
              controls
              src={absoluteUrl}
              className="w-full max-h-[180px]"
            >
              <source src={absoluteUrl} />
            </video>
            {/* Gradient Overlay with Star + Timestamp */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2 pt-6 flex items-center justify-between text-white select-none pointer-events-none">
              {msg.starredBy?.includes(String(currentUser.id)) && (
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              )}
              <span className="text-[10px] md:text-xs font-bold opacity-90 ms-auto">
                {formatMessageTime(msg.createdAt)}
              </span>
            </div>
          </div>
        );
      } else {
        return (
          <div className={cn(baseClass, "border border-black/10")}>
            <video
              controls
              src={absoluteUrl}
              className="max-w-[220px] max-h-[180px] rounded-xl"
            >
              <source src={absoluteUrl} />
            </video>
          </div>
        );
      }
    }

    // PDF, Word, Excel, and Generic Document Cards UI
    if (mediaType === "document") {
      const nameOrUrl = (msg.mediaName || absoluteUrl).toLowerCase();
      let docType: "pdf" | "word" | "excel" | "generic" = "generic";
      
      if (nameOrUrl.endsWith(".pdf")) docType = "pdf";
      else if (nameOrUrl.endsWith(".doc") || nameOrUrl.endsWith(".docx")) docType = "word";
      else if (nameOrUrl.endsWith(".xls") || nameOrUrl.endsWith(".xlsx")) docType = "excel";

      let badgeBg = "bg-red-500/10 dark:bg-red-500/20";
      let badgeText = "text-red-600 dark:text-red-400";
      let label = "PDF";
      
      if (docType === "word") {
        badgeBg = "bg-blue-500/10 dark:bg-blue-500/20";
        badgeText = "text-blue-600 dark:text-blue-400";
        label = "WORD";
      } else if (docType === "excel") {
        badgeBg = "bg-green-500/10 dark:bg-green-500/20";
        badgeText = "text-green-600 dark:text-green-400";
        label = "EXCEL";
      } else if (docType === "generic") {
        badgeBg = "bg-slate-500/10 dark:bg-slate-500/20";
        badgeText = "text-slate-600 dark:text-slate-400";
        label = "FILE";
      }

      if (isCurrentUser) {
        if (docType === "pdf") {
          badgeBg = "bg-red-500/25";
          badgeText = "text-red-100";
        } else if (docType === "word") {
          badgeBg = "bg-blue-500/25";
          badgeText = "text-blue-100";
        } else if (docType === "excel") {
          badgeBg = "bg-green-500/25";
          badgeText = "text-green-100";
        } else {
          badgeBg = "bg-white/20";
          badgeText = "text-white";
        }
      }

      const isStarred = msg.starredBy?.includes(String(currentUser.id)) || false;

      return (
        <a
          href={absoluteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            isMediaOnly
              ? cn(
                  "flex flex-col p-3 border rounded-2xl shadow-sm max-w-xs md:max-w-sm hover:scale-[1.01] transition-all cursor-pointer relative min-w-[200px] md:min-w-[280px]",
                  isCurrentUser
                    ? "border-primary bg-primary text-primary-foreground rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none"
                    : isTeacher
                    ? "border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 text-foreground rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none"
                    : "border-border/60 bg-muted/40 text-foreground rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none"
                )
              : cn(
                  "mt-2 flex items-center gap-3 p-3 border rounded-2xl transition-all shadow-sm max-w-xs md:max-w-sm hover:scale-[1.01] cursor-pointer",
                  isCurrentUser
                    ? "border-white/10 bg-black/15 hover:bg-black/25 text-white"
                    : "border-border/40 bg-muted/40 hover:bg-muted/50 text-foreground"
                )
          )}
        >
          <div className="flex items-center gap-3 w-full">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", badgeBg)}>
              <span className={cn("text-[10px] font-black uppercase tracking-wider", badgeText)}>{label}</span>
            </div>
            <div className="flex-1 min-w-0 text-start">
              <p className="text-xs font-bold truncate">{sliceFileName(msg.mediaName || t("downloadFile"), 22)}</p>
              <p className="text-[10px] opacity-75 font-semibold mt-0.5">{t("downloadFile") || "Download File"}</p>
            </div>
            <Download className="w-4 h-4 shrink-0 opacity-70" />
          </div>

          {isMediaOnly && (
            <div className={cn(
              "flex items-center justify-between gap-1.5 mt-2 w-full pt-1.5 opacity-80 shrink-0 text-[10px] md:text-xs border-t",
              isCurrentUser ? "border-white/10" : "border-border/20"
            )}>
              {isStarred && !isCurrentUser && (
                <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
              )}
              <span className={cn("font-bold ms-auto", isCurrentUser ? "text-primary-foreground/90" : "text-muted-foreground")}>
                {formatMessageTime(msg.createdAt)}
              </span>
            </div>
          )}
        </a>
      );
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      msg.content.toLowerCase().includes(searchLower) ||
      (msg.mediaName && msg.mediaName.toLowerCase().includes(searchLower));
    const matchesStarred = !showStarredOnly || (msg.starredBy && msg.starredBy.includes(String(currentUser.id)));
    return matchesSearch && matchesStarred;
  });

  return (
    <div className="flex-grow bg-card border border-border/40 rounded-2xl lg:rounded-3xl flex flex-col h-full overflow-hidden shadow-sm">
      {/* Chat Header */}
      <div className="p-3 md:p-4 border-b border-border/40 flex justify-between items-center shrink-0 gap-2 md:gap-3">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 shrink-0">
            <MessageSquareQuote className="h-4.5 w-4.5 md:h-5.5 md:w-5.5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm md:text-lg font-black text-foreground m-0 leading-tight truncate">
              {groupName}
            </h1>
            <p className="text-[9px] md:text-xs text-muted-foreground font-semibold m-0 truncate">
              {courseName || "حلقة القرآن الكريم"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          {headerExtra}

          {/* Search messages toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={cn(
              "flex items-center gap-1 px-2 py-1.5 md:gap-1.5 md:px-3 rounded-xl border font-bold text-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary",
              showSearch
                ? "bg-primary/10 border-primary/20 text-primary shadow-sm"
                : "border-border/60 bg-card hover:bg-muted/40 text-muted-foreground"
            )}
            aria-label="Toggle search and filters"
            aria-pressed={showSearch}
          >
            <Search className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <span className="hidden sm:inline">{t("searchMessages") || "البحث..."}</span>
          </button>

          {rosterStudents && rosterStudents.length > 0 && (
            <button
              onClick={() => setShowRoster(!showRoster)}
              className="flex items-center gap-1 px-2 py-1.5 md:gap-1.5 md:px-3 rounded-xl border border-border/60 bg-card hover:bg-muted/40 font-bold text-xs text-muted-foreground transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Toggle student roster"
            >
              <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              <span className="hidden sm:inline">{t("students")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Search and Filters Bar */}
      {showSearch && (
        <div className="px-3 py-2 md:px-4 md:py-3 bg-muted/20 border-b border-border/40 flex flex-col sm:flex-row gap-2 md:gap-3 items-center animate-in slide-in-from-top duration-300">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchMessages") || "البحث في الرسائل..."}
              className="w-full bg-card border border-border/60 rounded-xl md:rounded-2xl py-1.5 md:py-2 ps-9 pe-8 text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
            <button
              onClick={() => setShowStarredOnly(!showStarredOnly)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1.5 md:gap-1.5 md:px-3 md:py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer",
                showStarredOnly
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-500 shadow-sm"
                  : "border-border/60 bg-card hover:bg-muted/40 text-muted-foreground"
              )}
            >
              <Star className={cn("w-3.5 h-3.5 md:w-4 md:h-4", showStarredOnly ? "fill-amber-500 text-amber-500" : "text-muted-foreground/60")} />
              {t("starredOnly")}
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Chat Area + Student Roster Panel */}
      <div className="flex-grow flex min-h-0 relative">
        {/* Messages Feed */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-2.5 md:p-4 space-y-2 min-h-0 bg-muted/5 dark:bg-card"
          role="log"
          aria-label="Chat messages feed"
        >
          {hasMore && !searchQuery && (
            <div className="flex justify-center py-2 shrink-0">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/50 text-xs font-black text-muted-foreground transition-all cursor-pointer shadow-sm hover:scale-102 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    <span>{t("loadingMore") || "جاري التحميل..."}</span>
                  </>
                ) : (
                  <span>{t("loadMore") || "تحميل الرسائل السابقة"}</span>
                )}
              </button>
            </div>
          )}

          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => {
              const isCurrentUser = String(msg.senderId) === String(currentUser.id);
              const isTeacher = msg.senderRole === "teacher";
              const isStudent = msg.senderRole === "student";
              const isStarred = msg.starredBy?.includes(String(currentUser.id)) || false;
              const groupedReactions = getGroupedReactions(msg.reactions);
              const isReactionMenuOpen = activeReactionMenuId === msg.id;

              return (
                <div
                  key={msg.id}
                  id={`msg-${msg.id}`}
                  className={cn(
                    "flex flex-col max-w-[90%] md:max-w-[75%] animate-in fade-in duration-200 group/msg relative",
                    isCurrentUser ? "ms-auto items-end" : "me-auto items-start",
                    groupedReactions.length > 0 && "mb-2"
                  )}
                >
                  {/* Sender Name */}
                  <span className="text-[10px] md:text-xs font-bold text-muted-foreground mb-0.5 px-1 flex items-center gap-1 md:gap-1.5">
                    {isCurrentUser ? tCommon("me") || t("myBoard") || "أنا" : msg.senderName}
                    {isTeacher && !isCurrentUser && (
                      <span className="bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[8px] md:text-[10px] px-1.5 py-0.2 rounded-full font-bold border border-amber-500/20">
                        {t("teacher")}
                      </span>
                    )}
                    {isStudent && !isCurrentUser && (currentUser.role === "teacher" || String(currentUser.role_id) === "2") && (
                      <span className="bg-primary/10 text-primary text-[8px] md:text-[9px] px-1.5 py-0.2 rounded-full font-bold border border-primary/20">
                        {t("studentName")}
                      </span>
                    )}
                  </span>

                  {/* Message Bubble + Actions Container */}
                  <div className={cn("flex items-center gap-1 md:gap-2 w-full group/actions", isCurrentUser ? "justify-end" : "justify-start")}>
                    {/* Reactions & Star Actions for Current User (on the left of bubble) */}
                    {isCurrentUser && !msg.isDeleted && (
                      <div className="flex items-center gap-0.5 reaction-container relative shrink-0">
                        {/* Reaction Popover */}
                        {isReactionMenuOpen && (
                          <div className={cn("absolute bottom-full mb-1 bg-card border border-border/40 rounded-full p-1 shadow-lg z-20 flex gap-1 animate-in zoom-in-95 duration-100", isRtl ? "start-0" : "end-0")}>
                            {["👍", "❤️", "😂", "😮", "😢", "🙏"].map((emoji) => {
                              const hasReacted = msg.reactions?.[currentUser.id]?.emoji === emoji;
                              return (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    handleReact(msg.id, emoji, msg.reactions);
                                    setActiveReactionMenuId(null);
                                  }}
                                  className={cn(
                                    "text-base p-1 hover:bg-muted rounded-full transition-all cursor-pointer hover:scale-120 active:scale-95 flex items-center justify-center h-7 w-7",
                                    hasReacted && "bg-primary/10 scale-110"
                                  )}
                                >
                                  {emoji}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setActiveReactionMenuId(isReactionMenuOpen ? null : msg.id)}
                          className="p-1 rounded-xl hover:bg-muted text-muted-foreground transition-all cursor-pointer opacity-60 md:opacity-0 group-hover/msg:opacity-100 focus:opacity-100"
                          title="React"
                        >
                          <Smile className="w-3.5 h-3.5" />
                        </button>

                        {/* More options menu (3 vertical dots) */}
                        {renderMessageDropdownMenu(msg, isStarred, isRtl ? "start" : "end")}
                      </div>
                    )}

                    {msg.isDeleted ? (
                      <div
                        id={`msg-bubble-${msg.id}`}
                        className={cn(
                          "p-2.5 md:p-3.5 rounded-xl md:rounded-2xl relative shadow-sm border text-xs md:text-sm italic opacity-85 w-fit max-w-full select-none transition-all duration-500",
                          isCurrentUser
                            ? "bg-primary/5 dark:bg-primary/10 text-primary border-primary/20 rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none"
                            : isTeacher
                            ? "bg-amber-500/5 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 border-amber-500/20 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none"
                            : "bg-muted/20 dark:bg-muted/40 text-muted-foreground border-border/40 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none"
                        )}
                      >
                        <p className="m-0 font-medium">{t("messageDeleted") || "This message was deleted"}</p>
                        <span className="text-[9px] md:text-[10px] font-bold block opacity-70 mt-1.5 ms-auto text-end">
                          {formatMessageTime(msg.createdAt)}
                        </span>
                      </div>
                    ) : msg.content ? (
                      <div
                        id={`msg-bubble-${msg.id}`}
                        className={cn(
                          "p-2.5 md:p-3.5 rounded-xl md:rounded-2xl relative shadow-sm border text-sm md:text-base leading-relaxed w-fit max-w-full transition-all duration-500",
                          highlightedMsgId === msg.id
                            ? "bg-amber-100 dark:bg-amber-900/60 border-amber-400 dark:border-amber-700 ring-2 ring-amber-400/50 scale-[1.02]"
                            : isCurrentUser
                            ? "bg-primary text-primary-foreground border-primary rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none"
                            : isTeacher
                            ? "bg-amber-500/5 dark:bg-amber-500/10 text-foreground border-amber-500/20 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none"
                            : "bg-muted/40 text-foreground border-border/60 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none"
                        )}
                        style={{
                          transition: "background-color 0.5s ease, border-color 0.5s ease, ring-color 0.5s ease"
                        }}
                      >
                        {/* Replied-To Quote Block */}
                        {msg.replyToId && (
                          <div
                            onClick={() => msg.replyToId && handleScrollToMessage(msg.replyToId)}
                            className={cn(
                              "mb-2 p-2 rounded-lg border-s-4 bg-black/5 dark:bg-white/5 text-start cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors select-none",
                              isCurrentUser
                                ? "border-white/40 text-primary-foreground"
                                : "border-primary text-foreground"
                            )}
                          >
                            <p className={cn("text-[10px] font-bold", isCurrentUser ? "text-white/95" : "text-primary")}>
                              {msg.replyToName}
                            </p>
                            <p className="text-xs opacity-85 truncate mt-0.5 max-w-[200px] md:max-w-[300px]">
                              {msg.replyToContent || (msg.replyToMediaType ? `[${tCommon(msg.replyToMediaType) || msg.replyToMediaType}]` : "")}
                            </p>
                          </div>
                        )}

                        <p className="m-0 break-words whitespace-pre-wrap">{renderMessageContent(msg.content, isCurrentUser)}</p>
                        {renderMediaContent(msg, isCurrentUser, false)}

                        {/* Bottom row: Star indicator & timestamp */}
                        <div className="flex items-center justify-between gap-1.5 mt-1 shrink-0">
                          {isStarred && !isCurrentUser && (
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500 animate-in zoom-in duration-200 shrink-0" />
                          )}
                          <span
                            className={cn(
                              "text-[10px] md:text-xs font-bold block opacity-70 ms-auto",
                              isCurrentUser ? "text-primary-foreground/90" : "text-muted-foreground"
                            )}
                          >
                            {formatMessageTime(msg.createdAt)}
                          </span>
                        </div>

                        {/* Render Grouped Reactions overlay */}
                        {groupedReactions.length > 0 && (
                          <div
                            className={cn(
                              "absolute -bottom-2.5 flex gap-0.5 bg-card dark:bg-muted border border-border/40 rounded-full px-1.5 py-0.5 shadow-sm text-[10px] items-center z-10 select-none cursor-pointer hover:bg-muted dark:hover:bg-muted/80 transition-colors",
                              isCurrentUser ? "start-3" : "end-3"
                            )}
                            onClick={() => {
                              const myReaction = msg.reactions?.[currentUser.id];
                              if (myReaction) {
                                handleReact(msg.id, myReaction.emoji, msg.reactions);
                              }
                            }}
                            title={groupedReactions.map((g) => `${g.emoji} ${g.users.join(", ")}`).join(" | ")}
                          >
                            <div className="flex gap-0.5">
                              {groupedReactions.map((g) => (
                                <span key={g.emoji}>{g.emoji}</span>
                              ))}
                            </div>
                            {groupedReactions.reduce((sum, g) => sum + g.count, 0) > 1 && (
                              <span className="font-bold text-[8px] text-muted-foreground ms-0.5">
                                {groupedReactions.reduce((sum, g) => sum + g.count, 0)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Media-only message (no caption text)
                      <div
                        id={`msg-bubble-${msg.id}`}
                        className={cn(
                          "relative w-fit transition-all duration-500 rounded-2xl",
                          highlightedMsgId === msg.id
                            ? "bg-amber-100/50 dark:bg-amber-900/40 p-1 border border-amber-400 dark:border-amber-700 scale-[1.02]"
                            : ""
                        )}
                        style={{
                          transition: "background-color 0.5s ease, border-color 0.5s ease"
                        }}
                      >
                        {/* Replied-To Quote Block */}
                        {msg.replyToId && (
                          <div
                            onClick={() => msg.replyToId && handleScrollToMessage(msg.replyToId)}
                            className={cn(
                              "mb-2 p-2 rounded-lg border-s-4 bg-black/5 dark:bg-white/5 text-start cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors select-none",
                              isCurrentUser
                                ? "border-white/40 text-primary-foreground"
                                : "border-primary text-foreground"
                            )}
                          >
                            <p className={cn("text-[10px] font-bold", isCurrentUser ? "text-white/95" : "text-primary")}>
                              {msg.replyToName}
                            </p>
                            <p className="text-xs opacity-85 truncate mt-0.5 max-w-[200px] md:max-w-[300px]">
                              {msg.replyToContent || (msg.replyToMediaType ? `[${tCommon(msg.replyToMediaType) || msg.replyToMediaType}]` : "")}
                            </p>
                          </div>
                        )}

                        {renderMediaContent(msg, isCurrentUser, true)}

                        {/* Render Grouped Reactions overlay */}
                        {groupedReactions.length > 0 && (
                          <div
                            className={cn(
                              "absolute -bottom-2.5 flex gap-0.5 bg-card dark:bg-muted border border-border/40 rounded-full px-1.5 py-0.5 shadow-sm text-[10px] items-center z-10 select-none cursor-pointer hover:bg-muted dark:hover:bg-muted/80 transition-colors",
                              isCurrentUser ? "start-3" : "end-3"
                            )}
                            onClick={() => {
                              const myReaction = msg.reactions?.[currentUser.id];
                              if (myReaction) {
                                  handleReact(msg.id, myReaction.emoji, msg.reactions);
                              }
                            }}
                            title={groupedReactions.map((g) => `${g.emoji} ${g.users.join(", ")}`).join(" | ")}
                          >
                            <div className="flex gap-0.5">
                              {groupedReactions.map((g) => (
                                <span key={g.emoji}>{g.emoji}</span>
                              ))}
                            </div>
                            {groupedReactions.reduce((sum, g) => sum + g.count, 0) > 1 && (
                              <span className="font-bold text-[8px] text-muted-foreground ms-0.5">
                                {groupedReactions.reduce((sum, g) => sum + g.count, 0)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reactions & Star Actions for Other Users (on the right of bubble) */}
                    {!isCurrentUser && !msg.isDeleted && (
                      <div className="flex items-center gap-0.5 reaction-container relative shrink-0">
                        {/* More options menu (3 vertical dots) */}
                        {renderMessageDropdownMenu(msg, isStarred, isRtl ? "end" : "start")}

                        <button
                          type="button"
                          onClick={() => setActiveReactionMenuId(isReactionMenuOpen ? null : msg.id)}
                          className="p-1 rounded-xl hover:bg-muted text-muted-foreground transition-all cursor-pointer opacity-60 md:opacity-0 group-hover/msg:opacity-100 focus:opacity-100"
                          title="React"
                        >
                          <Smile className="w-3.5 h-3.5" />
                        </button>

                        {/* Reaction Popover */}
                        {isReactionMenuOpen && (
                          <div className={cn("absolute bottom-full mb-1 bg-card border border-border/40 rounded-full p-1 shadow-lg z-20 flex gap-1 animate-in zoom-in-95 duration-100", isRtl ? "end-0" : "start-0")}>
                            {["👍", "❤️", "😂", "😮", "😢", "🙏"].map((emoji) => {
                              const hasReacted = msg.reactions?.[currentUser.id]?.emoji === emoji;
                              return (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    handleReact(msg.id, emoji, msg.reactions);
                                    setActiveReactionMenuId(null);
                                  }}
                                  className={cn(
                                    "text-base p-1 hover:bg-muted rounded-full transition-all cursor-pointer hover:scale-120 active:scale-95 flex items-center justify-center h-7 w-7",
                                    hasReacted && "bg-primary/10 scale-110"
                                  )}
                                >
                                  {emoji}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 px-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center text-muted-foreground/80 shadow-inner">
                {showStarredOnly ? (
                  <Star className="h-8 w-8 text-amber-500 fill-amber-500 animate-pulse" />
                ) : (
                  <MessageSquareQuote className="h-8 w-8 text-muted-foreground animate-bounce" />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-foreground text-base md:text-lg">
                  {showStarredOnly && !searchQuery
                    ? t("noStarredMessages") || "لا توجد رسائل مميزة بنجمة"
                    : t("noMessagesFound") || "لم يتم العثور على أي رسائل"}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {showStarredOnly && !searchQuery
                    ? t("noStarredMessagesDesc") || "الرسائل المميزة بنجمة تظهر هنا."
                    : t("searchAnother") || "جرّبي البحث بكلمات أخرى أو عرض كل الرسائل."}
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Student Roster Drawer (Collapsible) */}
        {showRoster && rosterStudents && (
          <aside
            className="absolute lg:static top-0 bottom-0 end-0 w-64 bg-card border-s border-border/40 p-4 shadow-xl lg:shadow-none flex flex-col min-h-0 z-10 animate-in slide-in-from-right duration-300"
            role="complementary"
            aria-label="Student roster panel"
          >
            <div className="flex justify-between items-center shrink-0 border-b border-border/40 pb-2 mb-3">
              <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                {t("students")} ({rosterStudents.length})
              </span>
              <button
                onClick={() => setShowRoster(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Close roster"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-2 pr-1 min-h-0">
              {rosterStudents.map((student) => (
                <div
                  key={student.student_id}
                  className="p-3 rounded-xl bg-muted/20 border border-border/40 flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {student.full_name[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-foreground line-clamp-1">
                    {student.full_name}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* Messaging Input */}
      <form
        onSubmit={handleSend}
        className="border-t border-border/40 bg-card/80 backdrop-blur shrink-0 relative"
        role="search"
        aria-label="Send a message"
      >
        {/* Replying To Preview Bar */}
        {replyingTo && (
          <div className="px-3 py-2 bg-muted/40 border-b border-border/40 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
            <div className="flex-1 min-w-0 border-s-4 border-primary ps-3 py-0.5 text-start">
              <p className="text-xs font-bold text-primary">
                {replyingTo.senderId === currentUser.id ? (tCommon("me") || "أنا") : replyingTo.senderName}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {replyingTo.content || (replyingTo.mediaType ? `[${tCommon(replyingTo.mediaType) || replyingTo.mediaType}]` : "")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf,audio/*,.doc,.docx,.xls,.xlsx"
          className="hidden"
          aria-hidden="true"
          onChange={handleFileSelect}
        />

        {/* File preview bar */}
        {pendingFile && (
          <div className="px-3 pt-2.5 md:px-4 md:pt-3 flex flex-col gap-1.5 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center gap-2 flex-1 min-w-0 bg-muted/30 border border-border/50 rounded-xl p-2">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="preview" className="w-10 h-10 object-cover rounded-lg shrink-0" />
                ) : pendingFile.type.startsWith("audio/") ? (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileAudio className="w-5 h-5 text-primary" />
                  </div>
                ) : pendingFile.type.startsWith("video/") ? (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileVideo className="w-5 h-5 text-primary" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="min-w-0 text-start">
                  <p className="text-xs font-bold text-foreground truncate">{sliceFileName(pendingFile.name, 22)}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {(pendingFile.size / 1024).toFixed(0)} KB
                    {pendingFile.type.startsWith("audio/") && (pendingFile as any).duration !== undefined && (pendingFile as any).duration > 0 && (
                      <span className="mx-1.5 opacity-60">
                        • {Math.floor((pendingFile as any).duration)}s
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearPendingFile}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={t("removeAttachment")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Audio Duration Warning Msg */}
            {pendingFile.type.startsWith("audio/") && 
             (pendingFile as any).duration !== undefined && 
             (pendingFile as any).duration > 0 && 
             (pendingFile as any).duration < 10 && (
              <p className="text-xs font-bold text-red-600 dark:text-red-400 px-1 text-start animate-in fade-in duration-200">
                {tValidation("audioTooShort") || "Audio duration must be at least 10 seconds"}
              </p>
            )}
          </div>
        )}

        {/* Emoji Picker Popover */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full end-4 mb-2 bg-card border border-border/40 rounded-2xl shadow-xl p-3 z-30 w-64 animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="grid grid-cols-6 gap-2 text-center">
              {POPULAR_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setInputMessage((prev) => prev + emoji);
                  }}
                  className="text-xl p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer hover:scale-115 active:scale-95 duration-100 flex items-center justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {isRecording ? (
          <div className="p-2.5 md:p-4 flex items-center justify-between gap-3 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-xl md:rounded-2xl animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-xs md:text-sm font-bold text-red-600 dark:text-red-400">
                {t("recording") || "Recording..."}
              </span>
              <span className="text-sm md:text-base font-black text-foreground font-mono leading-none ms-2">
                {Math.floor(recordingDuration / 60).toString().padStart(2, "0")}:
                {(recordingDuration % 60).toString().padStart(2, "0")}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={cancelRecording}
                className="px-3 py-1.5 rounded-xl border border-border/60 bg-card text-xs md:text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
              >
                {tCommon("cancel") || "Cancel"}
              </button>
              
              {/* Stop & Save Button */}
              <button
                type="button"
                onClick={stopRecording}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-600/90 text-xs md:text-sm font-bold text-white transition-all hover:scale-105 cursor-pointer"
              >
                {t("stopRecording") || "Stop"}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2.5 md:p-4 flex items-center gap-2 md:gap-3">
            {/* Paperclip attach button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending || isUploading}
              className="p-1.5 md:p-2 rounded-xl border border-border/60 bg-card hover:bg-muted/50 text-muted-foreground hover:text-primary transition-all cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={t("attachFile")}
              title={t("attachFile")}
            >
              <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Mic Button */}
            <button
              type="button"
              onClick={startRecording}
              disabled={isSending || isUploading || pendingFile !== null}
              className="p-1.5 md:p-2 rounded-xl border border-border/60 bg-card hover:bg-muted/50 text-muted-foreground hover:text-primary transition-all cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Record voice message"
              title="Record voice message"
            >
              <Mic className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </button>

            <div className="relative flex-1 flex items-center">
              <input
                ref={chatInputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={pendingFile ? (t("mediaCaption") || "أضيفي تعليقاً...") : t("typeMessage")}
                disabled={isSending || isUploading}
                className="w-full bg-muted/20 border border-border/60 rounded-xl md:rounded-2xl py-2 ps-3.5 pe-10 md:py-3 md:ps-4 md:pe-12 text-xs md:text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300 font-medium text-foreground disabled:opacity-60"
                aria-label="Type message text"
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute end-2 md:end-3 p-1 text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-lg flex items-center justify-center"
                title="Add emoji"
              >
                <Smile className="w-4 h-4 md:w-5 md:h-5 text-primary/70 hover:text-primary" />
              </button>
            </div>

            <button
              type="submit"
              disabled={
                (!inputMessage.trim() && !pendingFile) || 
                isSending || 
                isUploading || 
                (pendingFile !== null && pendingFile.type.startsWith("audio/") && 
                 (pendingFile as any).duration !== undefined && 
                 (pendingFile as any).duration > 0 && 
                 (pendingFile as any).duration < 10)
              }
              className="bg-primary hover:bg-primary/95 hover:scale-105 active:scale-95 text-primary-foreground h-9 w-9 md:h-11 md:w-11 rounded-xl md:rounded-2xl flex items-center justify-center transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Submit message"
            >
              {isUploading || isSending ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 md:w-5 md:h-5 rtl:-rotate-90" />
              )}
            </button>
          </div>
        )}
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteTargetId !== null} onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center text-xl">
              {t("deleteMessage") || "Delete Message"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t("deleteMessageConfirm") || "Are you sure you want to delete this message? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 sm:justify-center mt-4">
            <button
              type="button"
              onClick={() => setDeleteTargetId(null)}
              className="flex-1 px-4 py-2 rounded-xl border border-border/60 bg-card hover:bg-muted/50 text-xs font-bold text-muted-foreground transition-all cursor-pointer shadow-sm hover:scale-102 active:scale-98"
            >
              {tCommon("cancel") || "Cancel"}
            </button>
            <button
              type="button"
              onClick={handleDeleteMessage}
              className="flex-1 px-4 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-xs font-bold text-white transition-all cursor-pointer shadow-sm hover:scale-102 active:scale-98"
            >
              {tCommon("delete") || "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
