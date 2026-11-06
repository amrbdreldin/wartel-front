"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAudioDuration } from "@/utils/audio";

// ============================================================
// useVoiceRecorder – record (or pick) a voice clip and convert it
// to a small MP3, same pipeline as the register form's audio field.
// ============================================================

export type VoiceRecorderStatus = "idle" | "recording" | "processing" | "recorded";
export type VoiceRecorderError = "secureContext" | "micAccess" | "fileTooLarge";

export interface VoiceRecording {
  file: File;
  url: string;
  /** Seconds */
  duration: number;
}

const MAX_RECORDING_SECONDS = 300;
const MAX_FILE_BYTES = 2 * 1024 * 1024;

type WindowWithWebkitAudio = Window & { webkitAudioContext?: typeof AudioContext };

function getAudioContextConstructor(): typeof AudioContext | undefined {
  return window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;
}

function pickMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/ogg;codecs=opus", "audio/webm", "audio/aac", "audio/mp4"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function extensionFor(mimeType: string): string {
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("aac")) return "aac";
  return "webm";
}

// Downsample to 16kHz mono MP3 (32 kbps), and lower again if still over 1MB.
// Returns null when the browser cannot decode the clip.
async function toCompressedMp3(blob: Blob, baseName: string, context: AudioContext | null): Promise<File | null> {
  try {
    const AudioCtx = getAudioContextConstructor();
    const audioContext = context ?? (AudioCtx ? new AudioCtx() : null);
    if (!audioContext) return null;
    if (audioContext.state === "suspended") await audioContext.resume().catch(() => {});

    const audioBuffer = await audioContext.decodeAudioData(await blob.arrayBuffer());
    const { audioBufferToMp3, downsampleAudioBuffer } = await import("@/utils/audio");

    let mp3 = audioBufferToMp3(await downsampleAudioBuffer(audioBuffer, 16000), 32);
    if (mp3.size > 1024 * 1024) {
      mp3 = audioBufferToMp3(await downsampleAudioBuffer(audioBuffer, 11025), 24);
    }
    return new File([mp3], `${baseName}.mp3`, { type: "audio/mp3" });
  } catch (err) {
    console.error("Audio conversion failed", err);
    return null;
  }
}

export function useVoiceRecorder() {
  const [status, setStatus] = useState<VoiceRecorderStatus>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [recording, setRecording] = useState<VoiceRecording | null>(null);
  const [error, setError] = useState<VoiceRecorderError | null>(null);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const urlRef = useRef<string | null>(null);

  const clearTick = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  };

  const publish = useCallback((file: File, duration: number) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    setRecording({ file, url, duration });
    setStatus("recorded");
  }, []);

  useEffect(() => {
    return () => {
      clearTick();
      if (mediaRef.current && mediaRef.current.state !== "inactive") {
        mediaRef.current.onstop = null;
        try {
          mediaRef.current.stop();
        } catch {}
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioContextRef.current?.close().catch(() => {});
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const stop = useCallback(() => {
    clearTick();
    if (mediaRef.current && mediaRef.current.state !== "inactive") {
      setStatus("processing");
      mediaRef.current.stop();
    }
  }, []);

  const start = useCallback(async () => {
    setError(null);
    // Create/resume the AudioContext inside the user gesture (Safari)
    if (!audioContextRef.current) {
      const AudioCtx = getAudioContextConstructor();
      if (AudioCtx) audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume().catch(() => {});
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("secureContext");
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      console.error("Recording failed", err);
      setError("micAccess");
      return;
    }
    streamRef.current = stream;

    const mimeType = pickMimeType();
    const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    mediaRef.current = mr;
    chunksRef.current = [];
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.onstop = async () => {
      const duration = (Date.now() - startTimeRef.current) / 1000;
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      const actualMime = mr.mimeType || mimeType || "audio/webm";
      const blob = new Blob(chunksRef.current, { type: actualMime });
      const mp3 = await toCompressedMp3(blob, "recording", audioContextRef.current);
      publish(mp3 ?? new File([blob], `recording.${extensionFor(actualMime)}`, { type: actualMime }), duration);
    };

    mr.start();
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    setStatus("recording");
    tickRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setElapsedMs(elapsed);
      if (elapsed >= MAX_RECORDING_SECONDS * 1000) stop();
    }, 100);
  }, [publish, stop]);

  const pickFile = useCallback(
    async (file: File) => {
      setError(null);
      setStatus("processing");
      const duration = await getAudioDuration(file);
      const isSmallMp3 = (file.type === "audio/mpeg" || file.type === "audio/mp3") && file.size <= 1024 * 1024;
      const mp3 = isSmallMp3
        ? null
        : await toCompressedMp3(file, file.name.replace(/\.[^/.]+$/, ""), audioContextRef.current);
      const result = mp3 && mp3.size <= MAX_FILE_BYTES ? mp3 : file;
      if (result.size > MAX_FILE_BYTES) {
        setError("fileTooLarge");
        setStatus(recording ? "recorded" : "idle");
        return;
      }
      publish(result, duration);
    },
    [publish, recording]
  );

  const reset = useCallback(() => {
    clearTick();
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setRecording(null);
    setElapsedMs(0);
    setError(null);
    setStatus("idle");
  }, []);

  return { status, elapsedMs, recording, error, start, stop, pickFile, reset };
}
