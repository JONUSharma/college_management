import { createSlice } from "@reduxjs/toolkit";
import { Fetch_Attendance_Thunk, Submit_Attendance_Thunk } from "./AttendanceThunk";
const initialState = {
    attendance: [],
    loading: false,
    error: null,
    success: false,
}

export const AttendanceSlice = createSlice({
    name: "attendance",
    initialState,
    reducers: {
        resetAttendanceState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {

        // Fetch attendance
        builder.addCase(Fetch_Attendance_Thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(Fetch_Attendance_Thunk.fulfilled, (state, action) => {
            state.loading = false;
            state.attendance = action.payload;
        });
        builder.addCase(Fetch_Attendance_Thunk.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Submit Attendance
        builder.addCase(Submit_Attendance_Thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(Submit_Attendance_Thunk.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(Submit_Attendance_Thunk.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload;
        })


    }
})

export default AttendanceSlice.reducer
export const { resetAttendanceState } = AttendanceSlice.actions