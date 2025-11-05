import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../Components/Axios/instance";
import { toast } from "react-toastify";


// FEtch attendance records
export const Fetch_Attendance_Thunk = createAsyncThunk("attendance/fetch",
    async ({ role, studentId }, { rejectWithValue }) => {
        try {
            if (role === "student") {
                const res = await instance.get(`/attendance/${studentId}`)
                return res.data;
            }
            else {
                const res = await instance.get("/attendance");
                return res.data
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error?.data)
        }

    })

// Submit Attendance
export const Submit_Attendance_Thunk = createAsyncThunk("/attendance/submit",
    async ({ token, attendancePayload }) => {
        try {
            if (attendancePayload.length === 1) {
                const res = await instance.post("/attendance", attendancePayload[0], {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success("✅ Attendance submitted successfully")
                return res.data
            }
            else {
                const res = await instance.post("/attendance/bulk", {
                    attendances: attendancePayload
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type" : "application/json"
                    }
                })
                toast.success("✅ Attendance submitted successfully")
                return res.data
            }
        } catch (error) {
            toast.error("Failed to submit attendance")
            return rejectWithValue(error.response?.data || error.message);
        }

    })