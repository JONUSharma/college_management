import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Auth/AuthSlice";
import CourseSlice from "./Courses/CourseSlice";
import AttendanceSlice from "./Attendance/AttendanceSlice";
import AssignmentSlice from "./Assignment/AssignmentSlice";
export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        CourseSlice: CourseSlice,
        AttendanceSlice: AttendanceSlice,
        assignment: AssignmentSlice
    }
})

export default store;
