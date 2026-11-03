"use client";

import { useEffect } from "react";
import { useFormikContext } from "formik";

interface AudioSyncControllerProps {
  isAudioRequired: boolean;
}

/**
 * Automatically clears audio field values and errors when the selected group
 * does not require audio test (requires_audio === 0).
 */
export function AudioSyncController({ isAudioRequired }: AudioSyncControllerProps) {
  const { values, setFieldValue, setFieldError } = useFormikContext<{
    quran_audio?: File | null;
    quran_audio_duration?: number;
    [key: string]: any;
  }>();

  useEffect(() => {
    if (!isAudioRequired) {
      if (values.quran_audio !== null || values.quran_audio_duration !== undefined) {
        setFieldValue("quran_audio", null, false);
        setFieldValue("quran_audio_duration", undefined, false);
      }
      setFieldError("quran_audio", undefined);
    }
  }, [isAudioRequired, values.quran_audio, values.quran_audio_duration, setFieldValue, setFieldError]);

  return null;
}

