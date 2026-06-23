import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface EnrollmentData {
  application_id: number;
  full_name: string;
  phone: string;
  enrollment_type_id: string;
  track_id: string;
  age: string;
  audio_test_path?: string;
  status_id: number;
  status_name: string;
}

interface EnrollmentState {
  currentEnrollment: EnrollmentData | null;
}

const initialState: EnrollmentState = {
  currentEnrollment: null,
};

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {
    setEnrollmentData: (state, action: PayloadAction<EnrollmentData>) => {
      state.currentEnrollment = action.payload;
    },
    clearEnrollmentData: (state) => {
      state.currentEnrollment = null;
    },
  },
});

export const { setEnrollmentData, clearEnrollmentData } = enrollmentSlice.actions;

export const selectCurrentEnrollment = (state: { enrollment: EnrollmentState }) => state.enrollment.currentEnrollment;

export default enrollmentSlice.reducer;
