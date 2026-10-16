---
name: forms
description: Use when creating or editing any form in Waratel — Formik + Yup schemas, inputs (FormField, FormSelect, FormTextarea, FormDatePicker, FormFileUpload, PhoneFormField, OTP), validation messages, submit handling with mutations, field errors from the backend, scroll-to-error, or modal forms.
---

# Forms (Formik + Yup)

## Pieces (reuse)
- Fields: `src/components/forms/` — `FormField` (text/password with eye toggle/icon), `FormSelect`, `FormTextarea`, `FormDatePicker`, `FormFileUpload`, `PhoneFormField`/`PhoneInput`. They use `useField(name)`, `FieldWrapper` (label + required `*`) and `FieldError` (translates `validation.*` keys).
- `ScrollToFieldError` (`src/components/forms/ScrollToFieldError.tsx`) — put inside every `<Form>`. (A duplicate exists in `register/_components/` — use the shared one.)
- Submit: `LoadingButton` or `SubmitButton` (gradient CTA for auth/primary flows).
- Schemas: shared field schemas in `src/utils/validation.ts` (`emailSchema`, `phoneSchema`, `passwordSchema`, `requiredString`…). Messages are **i18n keys** (`"validation.required"`), not text.

## Skeleton
```tsx
const t = useTranslations("teacher");
const { mutate, isPending } = useCreateX();

<Formik
  initialValues={INITIAL_VALUES}            // every field defined, "" not undefined
  validationSchema={schema}
  onSubmit={(values, { setErrors, resetForm }) =>
    mutate(toPayload(values), {
      onSuccess: (res) => { toast.success(res.message || t("createdSuccess")); resetForm(); onDone?.(); },
      onError: (err) => {
        const fieldErrors = (err as AxiosError<ApiError>).response?.data?.errors;
        if (fieldErrors) setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v[0]])));
      },
    })
  }
>
  <Form noValidate className="space-y-4">
    <ScrollToFieldError />
    <FormField name="title" label={t("title")} required />
    …
    <LoadingButton type="submit" isLoading={isPending} loadingText={t("saving")}>{t("save")}</LoadingButton>
  </Form>
</Formik>
```

## Rules (from docs/DEVELOPMENT_GUIDELINES.md)
- Disable/loading from the mutation's `isPending`, never only `isSubmitting`.
- Loading text is specific: "جاري الإرسال/Sending…", "جاري الحفظ/Saving…".
- Don't toast errors in `onError` — the axios interceptor already does (map field errors into Formik instead).
- Custom required widgets (path/course selectors, audio upload) must show a red `FieldError` when skipped — never block submit silently.
- Field `name` === schema key === payload key mapping in one `toPayload()`; keep it pure.
- Namespaced translators can't resolve `validation.*` — `FieldError` uses the root translator; if you render errors yourself use `const tRoot = useTranslations()`.
- Edit mode: `enableReinitialize` + initial values from the query; guard against resetting what the user typed (only reinit when the id changes).
- Phones: use `PhoneFormField`; store digits; display `dir="ltr"`.
- Inputs: correct `type`, `inputMode`, `autoComplete`; height `h-11 rounded-xl` like `FormField`.
- Large flows finish with an in-place success view, not a redirect to a blank page.
- Small local-state forms (like `CreateTicketModal`) exist; for new forms with >2 fields prefer Formik + Yup for consistency.

## Tests
Validation schemas are unit-tested in `src/utils/__tests__/validation.test.ts` — add cases when you add/change a shared schema, run `yarn test`.
