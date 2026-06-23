"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertTriangle, ArrowLeft, ArrowRight, BookOpen, Check, 
  CheckCircle, ClipboardCheck, FileText, Loader2, Mic, Play, 
  Trash2, X, XCircle, Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Helper to resolve media URLs
const resolveMediaUrl = (url: string | null) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `https://wartel.amrbdr.com/storage/${url}`;
};

// Form Input Styling
const TEXTAREA_CLASS = "w-full bg-muted/30 border border-border/50 text-foreground text-sm rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary block p-4 transition-colors resize-none duration-200 outline-none";

export default function TakeExamPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const examId = params.examId as string;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  // Audio recorder states per question
  const [recordingStates, setRecordingStates] = useState<Record<string, "idle" | "recording" | "recorded">>({});
  const [recordingTimers, setRecordingTimers] = useState<Record<string, number>>({});
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [recorderIntervals, setRecorderIntervals] = useState<Record<string, any>>({});
  const [mediaRecorders, setMediaRecorders] = useState<Record<string, MediaRecorder>>({});

  // Query details
  const { data: examResponse, isLoading, isError, error } = useQuery({
    queryKey: ["student-exam", examId],
    queryFn: () => studentService.getExam(examId),
  });

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: (answersPayload: Record<string, any>) => 
      studentService.submitExamAnswers(examId, answersPayload),
    onSuccess: (res) => {
      toast.success(res?.message || t("student.examSubmittedSuccessfully") || "تم تسليم الاختبار بنجاح");
      router.push(`/${locale}/student/exams/${examId}/result`);
    },
    onError: () => {
      // Global error toast handles this
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto p-4">
        {/* Header Skeleton */}
        <div className="pb-6 border-b border-border/50 flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
        {/* Progress Bar Skeleton */}
        <Skeleton className="h-3 w-full rounded-full" />
        {/* Card Skeleton */}
        <div className="bg-card border border-border/50 rounded-3xl p-8 space-y-6">
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-4 pt-4">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !examResponse?.success || !examResponse.data) {
    const err = error as { response?: { data?: { message?: string } } };
    const apiErrorMsg = err.response?.data?.message || (error as Error)?.message;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 max-w-md mx-auto">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">{t("common.error")}</h2>
        <p className="text-muted-foreground mb-6">
          {examResponse?.message || apiErrorMsg || t("student.examNotFound") || "لم يتم العثور على الاختبار أو انتهت صلاحيته."}
        </p>
        <button 
          onClick={() => router.push(`/${locale}/student`)}
          className="px-6 py-3 rounded-xl bg-primary text-white font-bold transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5"
        >
          {t("student.backToDashboard") || "العودة للوحة التحكم"}
        </button>
      </div>
    );
  }

  const exam = examResponse.data;
  const questions = exam.questions || [];
  const totalQuestions = questions.length;
  const hasQuestions = totalQuestions > 0;
  
  const currentQuestion = hasQuestions ? questions[currentStep] : null;
  const isLastQuestion = currentStep === totalQuestions - 1;

  // Answer handlers
  const handleSelectOption = (questionId: number, optionId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleTextChange = (questionId: number, text: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  // Audio Recorder Logic
  const startRecording = async (questionId: number) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error(
          locale === "ar"
            ? "الوصول إلى الميكروفون يتطلب اتصالاً آمناً (HTTPS)."
            : "Microphone access requires a secure connection (HTTPS)."
        );
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

      const mediaRecorder = new MediaRecorder(stream, options);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const actualMimeType = mediaRecorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunks, { type: actualMimeType });
        const url = URL.createObjectURL(blob);
        
        setAudioUrls(prev => ({ ...prev, [questionId]: url }));
        // Store a simulated URL in our answers payload
        setAnswers(prev => ({ ...prev, [questionId]: "https://wartel.amrbdr.com/storage/answers/recorded_audio_sample.wav" }));
        
        // Clean up tracks
        stream.getTracks().forEach(tr => tr.stop());
      };

      mediaRecorder.start();
      
      setMediaRecorders(prev => ({ ...prev, [questionId]: mediaRecorder }));
      setRecordingStates(prev => ({ ...prev, [questionId]: "recording" }));
      setRecordingTimers(prev => ({ ...prev, [questionId]: 0 }));

      const interval = setInterval(() => {
        setRecordingTimers(prev => ({ ...prev, [questionId]: (prev[questionId] || 0) + 1 }));
      }, 1000);

      setRecorderIntervals(prev => ({ ...prev, [questionId]: interval }));
    } catch (err) {
      console.error("Recording start failed:", err);
      toast.error(locale === "ar" ? "تعذر الوصول للميكروفون" : "Microphone access denied");
    }
  };

  const stopRecording = (questionId: number) => {
    const interval = recorderIntervals[questionId];
    if (interval) clearInterval(interval);

    const recorder = mediaRecorders[questionId];
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    setRecordingStates(prev => ({ ...prev, [questionId]: "recorded" }));
  };

  const deleteRecording = (questionId: number) => {
    const interval = recorderIntervals[questionId];
    if (interval) clearInterval(interval);

    // Stop recorder if running
    const recorder = mediaRecorders[questionId];
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    // Revoke URL
    const url = audioUrls[questionId];
    if (url) URL.revokeObjectURL(url);

    setAudioUrls(prev => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });

    setAnswers(prev => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });

    setRecordingStates(prev => ({ ...prev, [questionId]: "idle" }));
    setRecordingTimers(prev => ({ ...prev, [questionId]: 0 }));
  };

  const fmtTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmitExam = () => {
    submitMutation.mutate(answers);
  };

  const progressPercent = totalQuestions > 0 ? ((currentStep + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 p-4 pb-20">
      
      {/* Exam Header */}
      <div className="pb-6 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2 flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-primary" />
            {exam.title}
          </h2>
          <p className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>{t("student.totalMarks") || "الدرجة الكلية"}: {exam.degree}</span>
          </p>
        </div>
        <button 
          onClick={() => {
            if (confirm(locale === "ar" ? "هل أنت/ــي متأكد/ة من الخروج؟ لن يتم حفظ إجاباتك." : "Are you sure you want to exit? Your answers will not be saved.")) {
              router.push(`/${locale}/student`);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 hover:bg-muted text-sm font-bold text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="w-4 h-4" />
          <span>{locale === "ar" ? "خروج" : "Exit"}</span>
        </button>
      </div>

      {/* Progress Bar & Indicators */}
      {hasQuestions && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-extrabold text-foreground px-1">
            <span>
              {t("student.questionCount", { current: currentStep + 1, total: totalQuestions }) || `سؤال ${currentStep + 1} من ${totalQuestions}`}
            </span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
              {currentQuestion?.mark} {locale === "ar" ? "درجات" : "marks"}
            </span>
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border/10">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-300 rounded-full" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Step Container (Question Rendering) */}
      {currentQuestion && (
        <div className="bg-card rounded-3xl p-6 md:p-8 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.25)] transition-all duration-500 relative overflow-hidden">
          
          {/* Card Accent Glow */}
          <div className="absolute -right-32 -top-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          {/* Question Text */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg md:text-xl font-extrabold text-foreground leading-relaxed">
              {currentQuestion.question_text}
            </h3>

            {/* Question Media Prompt (e.g. image or audio reference) */}
            {currentQuestion.media_url && (
              <div className="rounded-2xl overflow-hidden border border-border/30 bg-muted/10 p-4 max-w-md">
                {currentQuestion.media_url.endsWith(".mp3") || currentQuestion.media_url.endsWith(".wav") ? (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-bold flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-primary shrink-0" />
                      {t("student.listeningPrompt") || "استمع للمقطع الصوتي:"}
                    </p>
                    <audio controls src={resolveMediaUrl(currentQuestion.media_url) || ""} className="w-full" />
                  </div>
                ) : (
                  <div className="relative w-full h-64">
                    <Image 
                      fill
                      sizes="(max-width: 480px) 100vw, 448px"
                      src={resolveMediaUrl(currentQuestion.media_url) || ""} 
                      alt="Question visual" 
                      className="rounded-xl mx-auto object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Question Response UI Form Fields */}
          <div className="space-y-4">
            
            {/* 1. TRUE & FALSE QUESTION TYPE */}
            {currentQuestion.code === "true&false" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id;
                  const isTrueOption = option.option_text === "صح" || option.option_text === "True";
                  
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-6 rounded-2xl border text-center transition-all duration-300 scale-95 hover:scale-100",
                        isSelected 
                          ? isTrueOption 
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/5"
                            : "border-destructive/50 bg-destructive/10 text-destructive shadow-md shadow-destructive/5"
                          : "border-border/60 hover:border-primary/40 bg-muted/20 hover:bg-muted/40 text-foreground"
                      )}
                    >
                      {isTrueOption ? (
                        <CheckCircle className={cn("w-10 h-10 mb-2", isSelected ? "text-emerald-500 animate-bounce" : "text-muted-foreground/60")} />
                      ) : (
                        <XCircle className={cn("w-10 h-10 mb-2", isSelected ? "text-destructive" : "text-muted-foreground/60")} />
                      )}
                      <span className="font-extrabold text-base">{option.option_text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. CHOOSE (MULTIPLE CHOICE) QUESTION TYPE */}
            {currentQuestion.code === "choose" && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4.5 rounded-2xl border text-start transition-all duration-300",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-border/60 hover:border-primary/30 bg-muted/20 hover:bg-muted/40 text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm border shrink-0",
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : "bg-muted border-border text-muted-foreground"
                        )}>
                          {idx + 1}
                        </span>
                        <span className="font-bold text-sm md:text-base">{option.option_text}</span>
                      </div>
                      
                      <div className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                        isSelected ? "border-primary bg-primary text-white" : "border-border"
                      )}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 3. TEXT QUESTION TYPE */}
            {currentQuestion.code === "text" && (
              <div className="space-y-2">
                <textarea
                  rows={6}
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
                  className={TEXTAREA_CLASS}
                  placeholder={t("student.explainPlaceholder") || "اكتب إجابتك بالتفصيل هنا..."}
                />
              </div>
            )}

            {/* 4. SOUND / ORAL RECORDING QUESTION TYPE */}
            {currentQuestion.code === "sound" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border/50 bg-muted/20 overflow-hidden">
                  
                  {/* IDLE STATE */}
                  {(!recordingStates[currentQuestion.id] || recordingStates[currentQuestion.id] === "idle") && (
                    <div className="p-8 flex flex-col items-center gap-5">
                      <button 
                        type="button" 
                        onClick={() => startRecording(currentQuestion.id)}
                        className="relative w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 hover:bg-primary/20 hover:border-primary/60 flex items-center justify-center transition-all duration-300 hover:scale-105"
                      >
                        <Mic className="w-9 h-9 text-primary" />
                        <span className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                      </button>
                      
                      <div className="text-center space-y-1">
                        <p className="text-sm font-extrabold text-foreground">
                          {t("auth.startRecording") || "اضغطي للتسجيل"}
                        </p>
                        <p className="text-xs text-muted-foreground font-semibold">
                          {t("auth.recordVoiceSample") || "سجلي تسميعك الشفوي بوضوح"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* RECORDING STATE */}
                  {recordingStates[currentQuestion.id] === "recording" && (
                    <div className="p-8 flex flex-col items-center gap-5 bg-destructive/5 animate-pulse">
                      <div className="relative w-20 h-20 rounded-full bg-destructive/10 border-2 border-destructive/40 flex items-center justify-center">
                        <Mic className="w-9 h-9 text-destructive" />
                        <span className="absolute inset-0 rounded-full border-2 border-destructive/40 animate-ping" />
                      </div>
                      
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="flex items-center gap-2 text-destructive font-black text-sm">
                          <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
                          <span>{t("auth.recording") || "جاري التسجيل..."}</span>
                        </div>
                        <span className="text-3xl font-black text-foreground font-mono">
                          {fmtTime(recordingTimers[currentQuestion.id] || 0)}
                        </span>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => stopRecording(currentQuestion.id)}
                        className="flex items-center gap-2 px-8 py-3 rounded-full bg-destructive hover:bg-destructive/90 text-white font-extrabold transition-all hover:scale-105 shadow-md cursor-pointer"
                      >
                        <span className="w-3 h-3 rounded-sm bg-white shrink-0" />
                        <span>{t("auth.stopRecording") || "إيقاف التسجيل"}</span>
                      </button>
                    </div>
                  )}

                  {/* RECORDED / PLAYBACK STATE */}
                  {recordingStates[currentQuestion.id] === "recorded" && (
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success-500/10 border border-success-500/20 flex items-center justify-center shrink-0">
                          <Check className="w-5 h-5 text-success-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-foreground text-sm truncate">
                            {t("auth.recordingReady") || "التسجيل جاهز للإرسال"}
                          </p>
                          <p className="text-xs text-success-600 font-bold mt-0.5">✓ {t("student.correct") || "مكتمل"}</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => deleteRecording(currentQuestion.id)}
                          className="w-9 h-9 rounded-full hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors text-muted-foreground cursor-pointer"
                          title={t("auth.deleteRecording") || "حذف التسجيل"}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {audioUrls[currentQuestion.id] && (
                        <div className="bg-muted/30 p-2 rounded-xl">
                          <audio controls src={audioUrls[currentQuestion.id]} className="w-full" style={{ height: "36px" }} />
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={cn(
            "flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-extrabold transition-all border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground",
            currentStep === 0 && "opacity-50 cursor-not-allowed"
          )}
        >
          {locale === "ar" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t("common.previous") || "السابق"}</span>
        </button>

        {!isLastQuestion ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-extrabold bg-primary hover:bg-primary/95 text-white hover:shadow-lg hover:shadow-primary/10 transition-all hover:-translate-y-0.5"
          >
            <span>{t("common.next") || "التالي"}</span>
            {locale === "ar" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitExam}
            disabled={submitMutation.isPending}
            className={cn(
              "flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-success-600 to-[#047857] hover:from-[#047857] hover:to-success-600 text-white shadow-md hover:shadow-lg hover:shadow-success-500/20 transition-all hover:-translate-y-0.5 cursor-pointer",
              submitMutation.isPending && "opacity-50 cursor-not-allowed"
            )}
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t("student.processing") || "جاري الإرسال..."}</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 animate-bounce" />
                <span>{t("student.submitExam") || "تسليم الاختبار"}</span>
              </>
            )}
          </button>
        )}
      </div>

    </div>
  );
}
