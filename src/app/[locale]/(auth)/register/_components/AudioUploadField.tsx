"use client";

import { FieldError } from "@/components/ui/field-error";
import { useFormikContext } from "formik";
import { FileAudio, Mic, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getAudioDuration } from "@/utils/audio";

interface RegisterValues {
  full_name: string;
  age: string;
  phone: string;
  password: string;
  password_confirmation: string;
  user_type: string;
  selected_track_id: string;
  quran_audio: File | null;
}


// ── Audio Upload Zone (WhatsApp-like recording UX) ─────────
export function AudioUploadField({ variant = "student" }: { variant?: "student" | "child" }) {
  const t = useTranslations("auth");
  const { setFieldValue, setFieldTouched, values, errors, touched } = useFormikContext<RegisterValues>();
  const [fileName, setFileName] = useState<string | null>(null);
  const [recordState, setRecordState] = useState<"idle" | "recording" | "recorded">("idle");
  const [timer, setTimer] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch((err) => console.error("Error closing AudioContext", err));
      }
    };
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "";
  };

  const setAudioFile = useCallback((file: File, duration: number, url: string) => {
    setFieldValue("quran_audio_duration", duration, false);
    setFieldValue("quran_audio", file, true);
    setFieldTouched("quran_audio", true, false);
    setFileName(file.name);
    setRecordState("recorded");
    setBlobUrl(url);
  }, [setFieldValue, setFieldTouched]);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Reset state for new upload
      setBlobUrl(null);
      setFileName(null);
      setFieldValue("quran_audio_duration", undefined, false);
      setFieldValue("quran_audio", null, true);

      const duration = await getAudioDuration(file);
      (file as any).duration = duration;

      if (duration > 0 && duration < 10) {
        toast.error(t("audioTooShort"));
      }

      const extension = getFileExtension(file.name);
      const isAudio = file.type.startsWith("audio/") || 
                      ["MP3", "WAV", "OGG", "AAC", "M4A", "WEBM"].includes(extension);

      if (isAudio) {
        // If the file is already an MP3 and under 1MB, accept it directly to avoid quality loss
        if ((extension === "MP3" || file.type === "audio/mpeg" || file.type === "audio/mp3") && file.size <= 1 * 1024 * 1024) {
          setAudioFile(file, duration, URL.createObjectURL(file));
          return;
        }

        try {
          const arrayBuffer = await file.arrayBuffer();
          let audioContext = audioContextRef.current;
          if (!audioContext) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              audioContext = new AudioCtx();
            }
          }
          if (audioContext && audioContext.state === "suspended") {
            await audioContext.resume().catch(() => {});
          }

          if (audioContext) {
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const { audioBufferToMp3, downsampleAudioBuffer } = await import("@/utils/audio");

            // Attempt to downsample and compress to 16kHz mono MP3 (32 kbps)
            let processedBuffer = await downsampleAudioBuffer(audioBuffer, 16000);
            let mp3Blob = audioBufferToMp3(processedBuffer, 32);
            let compressedFile = new File([mp3Blob], file.name.replace(/\.[^/.]+$/, "") + ".mp3", { type: "audio/mp3" });
            (compressedFile as any).duration = duration;

            // If still over 1MB, try lower sample rate and bitrate
            if (compressedFile.size > 1 * 1024 * 1024) {
              processedBuffer = await downsampleAudioBuffer(audioBuffer, 11025);
              mp3Blob = audioBufferToMp3(processedBuffer, 24);
              compressedFile = new File([mp3Blob], file.name.replace(/\.[^/.]+$/, "") + ".mp3", { type: "audio/mp3" });
              (compressedFile as any).duration = duration;
            }

            if (compressedFile.size <= 1 * 1024 * 1024) {
              setAudioFile(compressedFile, duration, URL.createObjectURL(compressedFile));
              return;
            }

            // Accept the compressed file if it is under 2MB
            if (compressedFile.size <= 2 * 1024 * 1024) {
              setAudioFile(compressedFile, duration, URL.createObjectURL(compressedFile));
              return;
            }
          }
        } catch (err) {
          console.error("Audio compression failed, falling back to size validation", err);
        }
      }

      // Fallback if compression was not possible or still exceeded 2MB
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t("audioFileTooLarge"));
        setAudioFile(file, duration, URL.createObjectURL(file));
        return;
      }

      setAudioFile(file, duration, URL.createObjectURL(file));
    },
    [t, setFieldValue, setAudioFile]
  );

  const stopRecording = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume().catch(() => {});
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    mediaRef.current?.stop();
    setRecordState("recorded");
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // Initialize and resume AudioContext on user interaction gesture
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume().catch(() => {});
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error(t("secureContextRequired"));
        return;
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
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const duration = (Date.now() - startTimeRef.current) / 1000;
        if (duration < 10) {
          toast.error(t("audioTooShort"));
        }

        const actualMimeType = mr.mimeType || mimeType || "audio/webm";
        const extension = actualMimeType.includes("mp4")
          ? "mp4"
          : actualMimeType.includes("ogg")
            ? "ogg"
            : actualMimeType.includes("aac")
              ? "aac"
              : "webm";

        const blob = new Blob(chunksRef.current, { type: actualMimeType });
        try {
          const arrayBuffer = await blob.arrayBuffer();
          let audioContext = audioContextRef.current;
          if (!audioContext) {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          if (audioContext.state === "suspended") {
            await audioContext.resume().catch(() => {});
          }
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const { audioBufferToMp3, downsampleAudioBuffer } = await import("@/utils/audio");
          
          let processedBuffer = await downsampleAudioBuffer(audioBuffer, 16000);
          let mp3Blob = audioBufferToMp3(processedBuffer, 32);
          let file = new File([mp3Blob], "recording.mp3", { type: "audio/mp3" });
          (file as any).duration = duration;

          if (file.size > 1 * 1024 * 1024) {
            processedBuffer = await downsampleAudioBuffer(audioBuffer, 11025);
            mp3Blob = audioBufferToMp3(processedBuffer, 24);
            file = new File([mp3Blob], "recording.mp3", { type: "audio/mp3" });
            (file as any).duration = duration;
          }

          const url = URL.createObjectURL(file);
          setAudioFile(file, duration, url);
        } catch (err) {
          console.error("Audio conversion failed", err);
          const url = URL.createObjectURL(blob);
          const file = new File([blob], `recording.${extension}`, { type: actualMimeType });
          (file as any).duration = duration;
          setAudioFile(file, duration, url);
        }
        stream.getTracks().forEach(tr => tr.stop());
      };
      mr.start();
      startTimeRef.current = Date.now();
      setRecordState("recording");
      setTimer(0);
      intervalRef.current = setInterval(() => {
        setTimer((p) => {
          if (p >= 300) {
            stopRecording();
            return p;
          }
          return p + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Recording failed", err);
      toast.error(t("micAccessError"));
    }
  }, [setFieldValue, setFieldTouched, t, stopRecording, setAudioFile]);

  const deleteRecording = useCallback(() => {
    setBlobUrl(null); setFileName(null);
    setFieldValue("quran_audio_duration", undefined, false);
    setFieldValue("quran_audio", null, true);
    setRecordState("idle"); setTimer(0);
    if (inputRef.current) inputRef.current.value = "";
  }, [setFieldValue]);

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div id="quran_audio" className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
      <label className="block text-sm font-bold text-foreground">
        {t("audioUploadLabel")} <span className="text-destructive">*</span>
      </label>
      <p className="text-xs text-muted-foreground">{t(variant === "child" ? "audioUploadDescChild" : "audioUploadDescStudent")}</p>

      <div className="rounded-2xl border border-border/50 bg-muted/20 overflow-hidden">
        {recordState === "idle" && (
          <div className="p-6 flex flex-col items-center gap-4">
            <button type="button" onClick={startRecording}
              className="relative w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 hover:bg-primary/20 hover:border-primary/60 flex items-center justify-center transition-all duration-300 hover:scale-105">
              <Mic className="w-9 h-9 text-primary" />
              <span className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            </button>
            <p className="text-sm font-bold text-foreground">{t("startRecording")}</p>
            <div className="w-full flex items-center gap-3">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-xs font-bold text-muted-foreground">{t("orUploadFile")}</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>
            <button type="button" onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/60 text-sm font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted/50 transition-all">
              <FileAudio className="w-4 h-4" /> {t("audioUploadBtn")}
            </button>
            <p className="text-xs text-muted-foreground">{t("audioFormats")}</p>
            <input ref={inputRef} type="file" accept="audio/*" onChange={handleFile} className="hidden" />
          </div>
        )}
        {recordState === "recording" && (
          <div className="p-6 flex flex-col items-center gap-4 bg-destructive/5">
            <div className="relative w-20 h-20 rounded-full bg-destructive/10 border-2 border-destructive/40 flex items-center justify-center">
              <Mic className="w-9 h-9 text-destructive" />
              <span className="absolute inset-0 rounded-full border-2 border-destructive/40 animate-ping" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm font-bold text-destructive">{t("recording")}</span>
              </div>
              <span className="text-3xl font-black text-foreground font-mono">{fmtTime(timer)}</span>
            </div>
            <div className="flex items-end gap-1 h-8">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1 bg-destructive/60 rounded-full animate-pulse"
                  style={{ height: `${12 + Math.sin(i * 0.7) * 8}px`, animationDelay: `${i * 0.07}s` }} />
              ))}
            </div>
            <button type="button" onClick={stopRecording}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-destructive hover:bg-destructive/90 text-white font-bold transition-all hover:scale-105">
              <span className="w-3 h-3 rounded-sm bg-white shrink-0" /> {t("stopRecording")}
            </button>
          </div>
        )}
        {recordState === "recorded" && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success-500/10 border border-success-500/20 flex items-center justify-center shrink-0">
                <FileAudio className="w-5 h-5 text-success-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-sm truncate">{fileName ?? t("recordingReady")}</p>
                {values.quran_audio && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase border border-border/50">
                      {t("fileExtension", { ext: getFileExtension(values.quran_audio.name) })}
                    </span>
                    <span className="text-xs text-muted-foreground font-bold">
                      {t("fileSize", { size: formatFileSize(values.quran_audio.size) })}
                    </span>
                    <span className="text-xs text-success-600 font-bold flex items-center gap-0.5">
                      ✓ {t("recordingReady")}
                    </span>
                  </div>
                )}
              </div>
              <button type="button" onClick={deleteRecording}
                className="w-8 h-8 rounded-full hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            {blobUrl && <audio controls src={blobUrl} className="w-full" style={{ height: "36px" }} />}
          </div>
        )}
      </div>
      {touched.quran_audio && errors.quran_audio && (
        <FieldError error={errors.quran_audio as string} className="mt-2" />
      )}
    </div>
  );
}
