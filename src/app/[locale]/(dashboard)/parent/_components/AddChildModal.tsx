"use client";

import { useTranslations, useLocale } from "next-intl";
import { Formik, Form, FormikHelpers } from "formik";
import { X, Info, Loader2, ArrowLeft, ArrowRight, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { AudioUploadField } from "@/app/[locale]/(auth)/register/_components/AudioUploadField";
import { PathSelectionField } from "@/app/[locale]/(auth)/register/_components/PathSelectionField";
import { ScrollToFieldError } from "@/app/[locale]/(auth)/register/_components/ScrollToFieldError";
import { registerSchema } from "@/utils/validation";

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAddPending: boolean;
  enrollmentTypes: any[];
  isFormDataLoading: boolean;
  onSubmit: (values: any, helpers: FormikHelpers<any>) => Promise<void>;
  initialValues: any;
}

export function AddChildModal({
  isOpen,
  onClose,
  isAddPending,
  enrollmentTypes,
  isFormDataLoading,
  onSubmit,
  initialValues,
}: AddChildModalProps) {
  const t = useTranslations("parent");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isRtl = locale === "ar";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={() => !isAddPending && onClose()}
      ></div>

      <div className="relative bg-card rounded-[2rem] shadow-2xl border border-border/50 w-full max-w-2xl mx-auto overflow-hidden animate-in zoom-in-95 duration-200 z-10 my-8">
        {/* Header */}
        <div className="bg-muted/30 border-b border-border/50 p-6 flex justify-between items-center">
          <h5 className="font-black text-foreground text-lg m-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm">
              <UserPlus className="w-4 h-4" />
            </div>
            {t("addChild")}
          </h5>
          <button
            onClick={() => !isAddPending && onClose()}
            disabled={isAddPending}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted text-lg transition-colors cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-primary/90 leading-relaxed mb-0">
              {tAuth("registerSubtitle")}
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validate={(values) => {
              try {
                registerSchema.validateSync(values, {
                  abortEarly: false,
                  context: { enrollmentTypes },
                });
              } catch (err: any) {
                return err.inner.reduce((errors: any, currentError: any) => {
                  return { ...errors, [currentError.path]: currentError.message };
                }, {});
              }
            }}
            onSubmit={onSubmit}
          >
            <Form className="space-y-6">
              <ScrollToFieldError />

              {/* Path Selection */}
              <PathSelectionField
                enrollmentTypes={enrollmentTypes}
                isLoading={isFormDataLoading}
              />

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField name="full_name" label={tAuth("childFullName")} />
                <FormField
                  name="age"
                  type="number"
                  label={tAuth("age")}
                  dir={isRtl ? "rtl" : "ltr"}
                />
              </div>

              {/* Contact */}
              <PhoneFormField
                name="phone"
                label={tAuth("whatsapp")}
                placeholder={tAuth("whatsappPlaceholder") || "0101234567"}
              />

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  name="password"
                  label={tCommon("password")}
                  type="password"
                  placeholder="••••••••"
                />
                <FormField
                  name="password_confirmation"
                  label={tAuth("passwordConfirmation")}
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              {/* Audio Upload */}
              <AudioUploadField variant="child" />

              {/* Footer Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 border-t border-border/50 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isAddPending}
                  className="w-full sm:flex-1 bg-muted hover:bg-muted/80 text-muted-foreground font-bold rounded-xl px-5 py-4 transition-all text-base flex justify-center items-center gap-2 cursor-pointer focus:outline-none disabled:opacity-50"
                >
                  {tCommon("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isAddPending}
                  className={cn(
                    "w-full sm:flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-5 py-4 transition-all hover:shadow-lg hover:-translate-y-0.5 text-base flex justify-center items-center gap-2 cursor-pointer focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  )}
                >
                  {isAddPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("adding")}
                    </>
                  ) : (
                    <>
                      {tAuth("submitRegistration")}
                      {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    </>
                  )}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}
