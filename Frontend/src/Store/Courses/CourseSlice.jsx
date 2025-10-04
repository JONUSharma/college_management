import { createSlice } from "@reduxjs/toolkit";
import {
    Fetch_course_Thunk,
    create_course_Thunk,
    Fetch_student_enroll_course_Thunk,
    delete_course_Thunk,
    Update_course_thunk
} from "./CourseThunk";

const initialState = {
    courses: [],
    loading: false,
    error: null,
    success: false,
    student_enroll: [],
    courseEdting: false
}

export const CourseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // create course 
        builder.addCase(create_course_Thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(create_course_Thunk.fulfilled, (state, action) => {
            state.loading = false;
            if (state.courses) {
                state.courses.push(action.payload); // append new course
            } else {
                state.courses = [action.payload];
            }
        })
        builder.addCase(create_course_Thunk.rejected, (state) => {
            state.loading = false;
            state.error = action.payload;
        })

        // fetch courses
        builder.addCase(Fetch_course_Thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(Fetch_course_Thunk.fulfilled, (state, action) => {
            state.loading = false;
            state.courses = action.payload;
        });
        builder.addCase(Fetch_course_Thunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // update course
        builder.addCase(Update_course_thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.courseEdting = false;
        });
        builder.addCase(Update_course_thunk.fulfilled, (state, action) => {
            state.loading = false;
            state.courseEdting = true;
            state.courses = state.courses.map((c) =>
                c.id === action.payload.id ? action.payload : c
            );
        });
        builder.addCase(Update_course_thunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.courseEdting = false
        });

        // delete course
        builder.addCase(delete_course_Thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(delete_course_Thunk.fulfilled, (state, action) => {
            state.loading = false;
            state.courses = state.courses.filter((c) => c.id !== action.payload);
        });
        builder.addCase(delete_course_Thunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // student fetch enroll courses
        builder.addCase(Fetch_student_enroll_course_Thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(Fetch_student_enroll_course_Thunk.fulfilled, (state, action) => {
            state.loading = false;
            state.student_enroll = action.payload;
        });
        builder.addCase(Fetch_student_enroll_course_Thunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
})

export default CourseSlice.reducer