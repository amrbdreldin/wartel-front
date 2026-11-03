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

export const guestJoinSchema = Yup.object().shape({
  name: requiredString,
  phone: phoneSchema,
  password: passwordSchema,
});

export const sonItemSchema = Yup.object().shape({
  name: requiredString,
  phone: phoneSchema,
  password: passwordSchema,
});

export const parentWithSonsJoinSchema = Yup.object().shape({
  name: requiredString,
  phone: phoneSchema,
  password: passwordSchema,
  sons: Yup.array()
    .of(sonItemSchema)
    .min(1, "validation.atLeastOneChildRequired"),
});

export const addSingleSonSchema = Yup.object().shape({
  name: requiredString,
  phone: phoneSchema,
  password: passwordSchema,
});

export interface PendingGroup {
  id: string | number;
  name?: string;
  requires_audio?: number | boolean | string | null;
}

export interface Track {
  id: string | number;
  name?: string;
  requires_audio?: number | boolean | string | null;
  pending_groups?: PendingGroup[];
}

export interface EnrollmentType {
  id: string | number;
  name?: string;
  requires_audio?: number | boolean | string | null;
  tracks?: Track[];
}

export interface GroupLookupContext {
  enrollmentTypes?: EnrollmentType[];
  allTracks?: Track[];
  enrollmentTypeId?: string | number | null;
  trackId?: string | number | null;
}

const sameId = (a: unknown, b: unknown) =>
  a !== undefined && a !== null && b !== undefined && b !== null && String(a) === String(b);

export function findPendingGroup(
  groupId?: string | number | null,
  context?: GroupLookupContext
): PendingGroup | undefined {
  if (!groupId) return undefined;
  const { enrollmentTypes = [], allTracks = [], enrollmentTypeId, trackId } = context ?? {};

  const searchTracks = (tracks: Track[] = []): PendingGroup | undefined => {
    const ordered = trackId
      ? [...tracks.filter((t) => sameId(t.id, trackId)), ...tracks.filter((t) => !sameId(t.id, trackId))]
      : tracks;
    for (const tr of ordered) {
      const grp = tr.pending_groups?.find((g) => sameId(g.id, groupId));
      if (grp) return grp;
    }
    return undefined;
  };

  // 1. Selected enrollment type first, then remaining enrollment types, then standalone tracks
  const orderedTypes = enrollmentTypeId
    ? [
        ...enrollmentTypes.filter((e) => sameId(e.id, enrollmentTypeId)),
        ...enrollmentTypes.filter((e) => !sameId(e.id, enrollmentTypeId)),
      ]
    : enrollmentTypes;

  for (const et of orderedTypes) {
    const grp = searchTracks(et.tracks);
    if (grp) return grp;
  }

  return searchTracks(allTracks);
}

export function isAudioRequiredForGroup(group?: PendingGroup | null): boolean {
  if (!group) return true;
  return group.requires_audio !== 0 && group.requires_audio !== "0" && group.requires_audio !== false;
}

/** Resolves whether the current form values require a recitation audio upload. */
export function isAudioRequiredForSelection(
  values: {
    selected_group_id?: string | number | null;
    enrollment_type_id?: string | number | null;
    selected_track_id?: string | number | null;
  },
  context?: { enrollmentTypes?: EnrollmentType[]; allTracks?: Track[] }
): boolean {
  return isAudioRequiredForGroup(
    findPendingGroup(values.selected_group_id, {
      ...context,
      enrollmentTypeId: values.enrollment_type_id,
      trackId: values.selected_track_id,
    })
  );
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
      const allTracks = (context.options.context || {}).allTracks as Track[] | undefined;
      const { enrollment_type_id } = this.parent;
      const enrollmentType = enrollmentTypes?.find((e) => String(e.id) === String(enrollment_type_id));
      const hasTracks = (enrollmentType && enrollmentType.tracks && enrollmentType.tracks.length > 0) ||
                        (allTracks && allTracks.length > 0);
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
      const allTracks = (context.options.context || {}).allTracks as Track[] | undefined;
      const { enrollment_type_id, selected_track_id } = this.parent;
      const enrollmentType = enrollmentTypes?.find((e) => String(e.id) === String(enrollment_type_id));
      let track = enrollmentType?.tracks?.find((t) => String(t.id) === String(selected_track_id));
      if (!track && allTracks) {
        track = allTracks.find((t) => String(t.id) === String(selected_track_id));
      }
      const hasGroups = track && track.pending_groups && track.pending_groups.length > 0;
      if (hasGroups) {
        return !!value;
      }
      return true;
    }
  ),
  enrollment_type_id: Yup.string().required("validation.required"),
  quran_audio: Yup.mixed()
    .nullable()
    .test("audio-required", "validation.required", function (value, context) {
      const ctx = (context.options.context || {}) as {
        enrollmentTypes?: EnrollmentType[];
        allTracks?: Track[];
      };
      if (!isAudioRequiredForSelection(this.parent, ctx)) {
        return true;
      }
      return !!value;
    })
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
        const fileDuration = (value as File & { duration?: number }).duration;
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
