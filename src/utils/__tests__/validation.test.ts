import { describe, it, expect } from "vitest";
import {
  loginSchema,
  loginWithRecaptchaSchema,
  registerSchema,
  excuseSchema,
  teacherRequestSchema,
  messageSchema,
} from "../validation";

describe("Validation Schemas", () => {
  describe("loginSchema", () => {
    it("should validate correct login details", async () => {
      const validData = {
        phone: "01012345678",
        password: "password123",
      };
      await expect(loginSchema.validate(validData)).resolves.toEqual(validData);
    });

    it("should reject invalid phone format", async () => {
      const invalidData = {
        phone: "12",
        password: "password123",
      };
      await expect(loginSchema.validate(invalidData)).rejects.toThrow();
    });

    it("should reject short password", async () => {
      const invalidData = {
        phone: "01012345678",
        password: "12345",
      };
      await expect(loginSchema.validate(invalidData)).rejects.toThrow();
    });
  });

  describe("loginWithRecaptchaSchema", () => {
    it("should pass without recaptcha_token", async () => {
      const validData = {
        phone: "01012345678",
        password: "password123",
      };
      await expect(loginWithRecaptchaSchema.validate(validData)).resolves.toEqual(validData);
    });

    it("should pass with recaptcha_token", async () => {
      const validData = {
        phone: "01012345678",
        password: "password123",
        recaptcha_token: "some-token",
      };
      await expect(loginWithRecaptchaSchema.validate(validData)).resolves.toEqual(validData);
    });
  });

  describe("registerSchema", () => {
    const baseValidStudentData = {
      full_name: "Ahmed Ali",
      age: 25,
      phone: "01012345678",
      password: "password123",
      password_confirmation: "password123",
      user_type: "student",
      enrollment_type_id: "type-1",
      selected_track_id: "",
      selected_group_id: "",
      quran_audio: "mock-audio-file",
      quran_audio_duration: undefined as number | undefined,
      recaptcha_token: "token-abc",
    };

    const mockEnrollmentTypesContext = {
      context: {
        enrollmentTypes: [
          {
            id: "type-1",
            tracks: [
              {
                id: "track-1",
                pending_groups: [
                  { id: "group-1" },
                ],
              },
            ],
          },
          {
            id: "type-no-tracks",
            tracks: [],
          },
        ],
      },
    };

    it("should pass standard registration when no tracks or groups exist", async () => {
      const data = {
        ...baseValidStudentData,
        enrollment_type_id: "type-no-tracks",
      };

      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).resolves.toBeDefined();
    });

    it("should reject if tracks exist in the type but selected_track_id is missing", async () => {
      const data = {
        ...baseValidStudentData,
        enrollment_type_id: "type-1", // has tracks
        selected_track_id: "",
      };

      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).rejects.toThrow(
        "validation.required"
      );
    });

    it("should reject if groups exist in the track but selected_group_id is missing", async () => {
      const data = {
        ...baseValidStudentData,
        enrollment_type_id: "type-1",
        selected_track_id: "track-1", // track-1 has groups
        selected_group_id: "",
      };

      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).rejects.toThrow(
        "validation.required"
      );
    });

    it("should pass if all dynamic requirements (tracks/groups) are filled", async () => {
      const data = {
        ...baseValidStudentData,
        enrollment_type_id: "type-1",
        selected_track_id: "track-1",
        selected_group_id: "group-1",
      };

      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).resolves.toBeDefined();
    });

    it("should reject if password and password_confirmation do not match", async () => {
      const data = {
        ...baseValidStudentData,
        password_confirmation: "different-password",
      };

      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).rejects.toThrow();
    });

    it("should reject if age is empty string and throw validation.required", async () => {
      const data = {
        ...baseValidStudentData,
        enrollment_type_id: "type-no-tracks",
        age: "" as any,
      };

      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).rejects.toThrow(
        "validation.required"
      );
    });

    it("should reject if age is not a number and throw validation.mustBeNumber", async () => {
      const data = {
        ...baseValidStudentData,
        enrollment_type_id: "type-no-tracks",
        age: "not-a-number" as any,
      };

      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).rejects.toThrow(
        "validation.mustBeNumber"
      );
    });

    it("should reject if age is negative and throw validation.agePositive", async () => {
      const data = {
        ...baseValidStudentData,
        enrollment_type_id: "type-no-tracks",
        age: -5,
      };

      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).rejects.toThrow(
        "validation.agePositive"
      );
    });

    it("should reject if age is a decimal and throw validation.ageInteger", async () => {
      const data = {
        ...baseValidStudentData,
        enrollment_type_id: "type-no-tracks",
        age: 12.5,
      };

      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).rejects.toThrow(
        "validation.ageInteger"
      );
    });

    it("should accept audio file of size <= 2MB", async () => {
      const smallFile = new File([new ArrayBuffer(1.5 * 1024 * 1024)], "test.wav", { type: "audio/wav" });
      const data = {
        ...baseValidStudentData,
        enrollment_type_id: "type-no-tracks",
        quran_audio: smallFile,
      };
      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).resolves.toBeDefined();
    });

    it("should reject audio file of size > 2MB", async () => {
      const largeFile = new File([new ArrayBuffer(2.5 * 1024 * 1024)], "test.wav", { type: "audio/wav" });
      const data = {
        ...baseValidStudentData,
        enrollment_type_id: "type-no-tracks",
        quran_audio: largeFile,
      };
      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).rejects.toThrow(
        "validation.audioFileTooLarge"
      );
    });

    it("should accept audio file with duration >= 10s", async () => {
      const audioFile = new File([new ArrayBuffer(1000)], "test.wav", { type: "audio/wav" });
      const data = {
        ...baseValidStudentData,
        enrollment_type_id: "type-no-tracks",
        quran_audio: audioFile,
        quran_audio_duration: 12,
      };
      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).resolves.toBeDefined();
    });

    it("should reject audio file with duration < 10s", async () => {
      const audioFile = new File([new ArrayBuffer(1000)], "test.wav", { type: "audio/wav" });
      const data = {
        ...baseValidStudentData,
        enrollment_type_id: "type-no-tracks",
        quran_audio: audioFile,
        quran_audio_duration: 5,
      };
      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).rejects.toThrow(
        "validation.audioTooShort"
      );
    });

    it("should accept audio file with undefined duration", async () => {
      const audioFile = new File([new ArrayBuffer(1000)], "test.wav", { type: "audio/wav" });
      const data = {
        ...baseValidStudentData,
        enrollment_type_id: "type-no-tracks",
        quran_audio: audioFile,
        quran_audio_duration: undefined,
      };
      await expect(registerSchema.validate(data, mockEnrollmentTypesContext)).resolves.toBeDefined();
    });


  });

  describe("excuseSchema", () => {
    it("should validate valid excuse data", async () => {
      const validData = {
        type: "session_absence",
        reason: "Sick",
        start_date: "2026-06-01",
        end_date: "2026-06-02",
      };
      await expect(excuseSchema.validate(validData)).resolves.toEqual(validData);
    });

    it("should reject invalid excuse type", async () => {
      const invalidData = {
        type: "invalid_type",
        reason: "Sick",
      };
      await expect(excuseSchema.validate(invalidData)).rejects.toThrow();
    });
  });

  describe("teacherRequestSchema", () => {
    it("should validate valid teacher request", async () => {
      const validData = {
        type: "absence",
        start_date: "2026-06-01",
        end_date: "2026-06-02",
        reason: "Vacation",
      };
      await expect(teacherRequestSchema.validate(validData)).resolves.toEqual(validData);
    });
  });

  describe("messageSchema", () => {
    it("should validate valid messages", async () => {
      const validData = {
        recipient_type: "group",
        subject: "Meeting",
        content: "We have a meeting today.",
      };
      await expect(messageSchema.validate(validData)).resolves.toBeDefined();
    });
  });
});
