"use client";

import { cn } from "@/lib/utils";
import type { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { AlertCircle, CheckCircle2, FileAudio, Loader2, Mic, RotateCcw, Square } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

// ============================================================
// Voice recitation step shown inside an available-group card when
// the group requires_audio. The parent owns the recorder state so it
// can gate the submit button and send the file.
// ============================================================

export const MIN_VOICE_SECONDS = 10;

const RING_RADIUS = 46;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type Recorder = ReturnType<typeof useVoiceRecorder>;

const fmtTime = (seconds: number) => {
  const s = Math.floor(seconds);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

export function isVoiceValid(recorder: Recorder) {
  return recorder.status === "recorded" && (recorder.recording?.duration ?? 0) >= MIN_VOICE_SECONDS;
}

function Step({ index, label, done, active }: { index: number; label: string; done: boolean; active: boolean }) {
  return (
    <li
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-colors",
        done
          ? "bg-success-500/10 text-success-600"
          : active
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
      )}
    >
      {done ? (
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-current/15 text-[10px]">{index}</span>
      )}
      {label}
    </li>
  );
}

export function GroupVoiceRecorder({ recorder, disabled }: { recorder: Recorder; disabled?: boolean }) {
  const t = useTranslations("availableGroups");
  const inputRef = useRef<HTMLInputElement>(null);
  const { status, elapsedMs, recording, error } = recorder;

  const elapsedSeconds = elapsedMs / 1000;
  const valid = isVoiceValid(recorder);
  const tooShort = status === "recorded" && !valid;
  const reachedMin = elapsedSeconds >= MIN_VOICE_SECONDS;
  const progress =
    status === "recording"
      ? Math.min(elapsedSeconds / MIN_VOICE_SECONDS, 1)
      : status === "recorded"
        ? Math.min((recording?.duration ?? 0) / MIN_VOICE_SECONDS, 1)
        : 0;
  const ringDone = status === "recording" ? reachedMin : valid;
  const secondsLeft = Math.max(MIN_VOICE_SECONDS - Math.floor(elapsedSeconds), 1);

  const errorMessage =
    error === "secureContext"
      ? t("voice.secureContext")
      : error === "micAccess"
        ? t("voice.micAccess")
        : error === "fileTooLarge"
          ? t("voice.fileTooLarge")
          : null;

  return (
    <section
      aria-label={t("voice.title")}
      className={cn(
        "space-y-4 rounded-xl border p-4 transition-colors",
        valid
          ? "border-success-500/30 bg-success-500/5"
          : status === "recording"
            ? "border-destructive/30 bg-destructive/5"
            : "border-primary/25 bg-primary/5"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Mic className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-bold text-foreground">{t("voice.title")}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("voice.desc", { seconds: MIN_VOICE_SECONDS })}
          </p>
        </div>
      </div>

      <ol className="flex flex-wrap items-center gap-2" aria-label={t("voice.stepsLabel")}>
        <Step index={1} label={t("voice.stepRecord")} done={valid} active={!valid} />
        <Step index={2} label={t("voice.stepSubmit")} done={false} active={valid} />
      </ol>

      {status !== "recorded" && (
        <div className="flex flex-col items-center gap-3 py-1">
          <div className="relative h-28 w-28">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 112 112" aria-hidden="true">
              <circle cx="56" cy="56" r={RING_RADIUS} className="fill-none stroke-border" strokeWidth="6" />
              <circle
                cx="56"
                cy="56"
                r={RING_RADIUS}
                className={cn(
                  "fill-none transition-[stroke-dashoffset] duration-100 ease-linear",
                  ringDone ? "stroke-success-500" : "stroke-primary"
                )}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
              />
            </svg>
            <button
              type="button"
              disabled={disabled || status === "processing"}
              onClick={status === "recording" ? recorder.stop : recorder.start}
              aria-label={status === "recording" ? t("voice.stop") : t("voice.start")}
              className={cn(
                "absolute inset-3 flex items-center justify-center rounded-full transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
                status === "recording"
                  ? "bg-destructive text-white hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:scale-105 shadow-lg shadow-primary/25"
              )}
            >
              {status === "processing" ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : status === "recording" ? (
                <Square className="h-6 w-6 fill-current" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </button>
            {status === "idle" && (
              <span className="pointer-events-none absolute inset-3 rounded-full border-2 border-primary/30 animate-ping" />
            )}
          </div>

          {status === "idle" && <p className="text-sm font-bold text-foreground">{t("voice.tapToRecord")}</p>}

          {status === "processing" && (
            <p className="text-sm font-bold text-muted-foreground">{t("voice.processing")}</p>
          )}

          {status === "recording" && (
            <div className="flex flex-col items-center gap-1" aria-live="polite">
              <span className="flex items-center gap-2 text-xs font-bold text-destructive">
                <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                {t("voice.recording")}
              </span>
              <span className="font-mono text-2xl font-black text-foreground" dir="ltr">
                {fmtTime(elapsedSeconds)}
              </span>
              <span className={cn("text-xs font-bold", reachedMin ? "text-success-600" : "text-muted-foreground")}>
                {reachedMin ? t("voice.minReached") : t("voice.keepGoing", { seconds: secondsLeft })}
              </span>
            </div>
          )}

          {status === "idle" && (
            <>
              <button
                type="button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground underline-offset-4 hover:text-primary hover:underline cursor-pointer disabled:cursor-not-allowed"
              >
                <FileAudio className="h-3.5 w-3.5" aria-hidden="true" />
                {t("voice.uploadInstead")}
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) recorder.pickFile(file);
                  e.target.value = "";
                }}
              />
            </>
          )}
        </div>
      )}

      {status === "recorded" && recording && (
        <div className="space-y-3">
          <div
            role={tooShort ? "alert" : "status"}
            className={cn(
              "flex items-start gap-2 rounded-lg p-2.5 text-xs font-bold",
              valid ? "bg-success-500/10 text-success-600" : "bg-destructive/10 text-destructive"
            )}
          >
            {valid ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>
              {valid
                ? t("voice.ready", { time: fmtTime(recording.duration) })
                : t("voice.tooShort", { time: fmtTime(recording.duration), seconds: MIN_VOICE_SECONDS })}
            </span>
          </div>
          <audio controls src={recording.url} className="h-9 w-full" />
          <button
            type="button"
            disabled={disabled}
            onClick={recorder.reset}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary cursor-pointer disabled:cursor-not-allowed"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {t("voice.reRecord")}
          </button>
        </div>
      )}

      {errorMessage && (
        <p role="alert" className="flex items-start gap-1.5 text-xs font-bold text-destructive">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {errorMessage}
        </p>
      )}
    </section>
  );
}
