import React from "react";
import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

interface SecretNoteModalProps {
  showNoteDialog: boolean;
  studentName: string;
  noteContent: string;
  setNoteContent: (content: string) => void;
  setShowNoteDialog: (show: boolean) => void;
  handleSaveNote: () => void;
  locked?: boolean;
}

export function SecretNoteModal({
  showNoteDialog,
  studentName,
  noteContent,
  setNoteContent,
  setShowNoteDialog,
  handleSaveNote,
  locked = false,
}: SecretNoteModalProps) {
  const t = useTranslations("teacherBoard");
  const tGlobal = useTranslations();

  if (!showNoteDialog) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-background rounded-3xl p-6 w-full max-w-md shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-foreground">
          <MessageSquare className="w-5 h-5 text-primary" />
          {t("secretNoteTitle", { name: studentName }) || `ملاحظة على الطالب/ــة: ${studentName}`}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 font-medium">
          {t("secretNoteDesc") || "هذه الملاحظة سرية وتظهر لك فقط في السجل الداخلي."}
        </p>
        <textarea
          disabled={locked}
          className="w-full min-h-[120px] p-4 rounded-xl border border-input bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none resize-none mb-4 text-foreground focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder={t("secretNotePlaceholder") || "اكتب/ــي ملاحظاتك/ــكِ هنا (مستوى القراءة، الحفظ، الالتزام...)"}
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setShowNoteDialog(false);
              setNoteContent("");
            }}
            className="px-4 py-2 font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors"
          >
            {locked ? (tGlobal("close") || "إغلاق") : (t("confirmSubmitCancel") || "إلغاء")}
          </button>
          {!locked && (
            <button
              onClick={handleSaveNote}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-sm"
            >
              {t("saveNote") || "حفظ الملاحظة"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

