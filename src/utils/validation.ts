import * as Yup from "yup";

// ============================================================
// Shared Yup Validation Schemas
// ============================================================

// Common field schemas
export const emailSchema = Yup.string()
  .email("validation.email")
  .required("validation.required");

export const passwordSchema = Yup.string()
  .min(6, "validation.passwordMinLength")
  .required("validation.required");

export const phoneSchema = Yup.string()
  .matches(/^[0-9]{4,15}$/, "validation.phoneInvalid")
  .required("validation.required");

export const requiredString = Yup.string().required("validation.required");

export const optionalString = Yup.string().optional();

// ============================================================
// Auth Schemas
// ============================================================

export const loginSchema = Yup.object().shape({
  phone: phoneSchema,
  password: passwordSchema,
});

export const loginWithRecaptchaSchema = loginSchema.shape({
  recaptcha_token: Yup.string().optional(),
});

export const parentRegisterSchema = Yup.object().shape({
  full_name: requiredString,
  mobile: phoneSchema,
  password: passwordSchema,
});

interface PendingGroup {
  id: string | number;
  name?: string;
}

interface Track {
  id: string | number;
  name?: string;
  pending_groups?: PendingGroup[];
}

interface EnrollmentType {
  id: string | number;
  name?: string;
  tracks?: Track[];
}

export const registerSchema = Yup.object().shape({
  full_name: requiredString,
  age: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .required("validation.required")
    .typeError("validation.mustBeNumber")
    .positive("validation.agePositive")
    .integer("validation.ageInteger"),
  phone: phoneSchema,
  password: passwordSchema,
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "validation.passwordMatch")
    .required("validation.required"),
  user_type: Yup.string()
    .oneOf(["student", "teacher", "parent"])
    .required("validation.required"),
  selected_track_id: Yup.string().test(
    "track-required",
    "validation.required",
    function (value, context) {
      const enrollmentTypes = (context.options.context || {}).enrollmentTypes as EnrollmentType[] | undefined;
      if (!enrollmentTypes) return true;
      const { enrollment_type_id } = this.parent;
      const enrollmentType = enrollmentTypes.find((e) => String(e.id) === String(enrollment_type_id));
      const hasTracks = enrollmentType && enrollmentType.tracks && enrollmentType.tracks.length > 0;
      if (hasTracks) {
        return !!value;
      }
      return true;
    }
  ),
  selected_group_id: Yup.string().test(
    "group-required",
    "validation.required",
    function (value, context) {
      const enrollmentTypes = (context.options.context || {}).enrollmentTypes as EnrollmentType[] | undefined;
      if (!enrollmentTypes) return true;
      const { enrollment_type_id, selected_track_id } = this.parent;
      const enrollmentType = enrollmentTypes.find((e) => String(e.id) === String(enrollment_type_id));
      const track = enrollmentType?.tracks?.find((t) => String(t.id) === String(selected_track_id));
      const hasGroups = track && track.pending_groups && track.pending_groups.length > 0;
      if (hasGroups) {
        return !!value;
      }
      return true;
    }
  ),
  enrollment_type_id: Yup.string().required("validation.required"),
  quran_audio: Yup.mixed()
    .required("validation.required")
    .test("fileSize", "validation.audioFileTooLarge", (value) => {
      if (!value) return true;
      if (value instanceof File) {
        return value.size <= 2 * 1024 * 1024;
      }
      return true;
    })
    .test("duration", "validation.audioTooShort", function (value) {
      if (!value) return true;
      const duration = this.parent.quran_audio_duration;
      if (duration !== undefined && duration > 0) {
        return duration >= 10;
      }
      if (value instanceof File) {
        const fileDuration = (value as any).duration;
        if (fileDuration !== undefined && fileDuration > 0) {
          return fileDuration >= 10;
        }
      }
      return true;
    }),
  quran_audio_duration: Yup.number().optional(),
  recaptcha_token: Yup.string().optional(),
});

// ============================================================
// Excuse Schema
// ============================================================

export const excuseSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(["session_absence", "limited_leave"])
    .required("validation.required"),
  reason: requiredString,
  start_date: optionalString,
  end_date: optionalString,
});

// ============================================================
// Teacher Schemas
// ============================================================

export const teacherRequestSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(["absence", "postponement"])
    .required("validation.required"),
  start_date: requiredString,
  end_date: requiredString,
  reason: requiredString,
});

// ============================================================
// Message Schema
// ============================================================

export const messageSchema = Yup.object().shape({
  recipient_type: Yup.string()
    .oneOf(["group", "track", "all", "student"])
    .required("validation.required"),
  recipient_id: optionalString,
  subject: requiredString,
  content: requiredString,
});
