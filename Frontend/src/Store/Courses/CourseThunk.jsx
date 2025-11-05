import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../Components/Axios/instance";
import { toast } from "react-toastify";


// create course
export const create_course_Thunk = createAsyncThunk("/course/create",
    async (courseData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const res = await instance.post("/create-course", courseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
                return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create course")
        }
    }
)


// FEtch  all courses
export const Fetch_course_Thunk = createAsyncThunk("/course/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await instance.get("/fetch-courses");
            return res.data

        } catch (error) {
            return rejectWithValue(error?.response?.data || "Failed to fetch course")
        }
    }
)

// update a course
export const Update_course_thunk = createAsyncThunk("/course/update",
    async ({id, courseData}) => {
        try {
            const token = localStorage.getItem("token");
            const res = await instance.put(`/update-course/${id}`, courseData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data.course;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update course")
        }

    }
)

// delete course
export const delete_course_Thunk = createAsyncThunk("/course/delete",
    async (id, {rejectWithValue})=> {
        try {
            console.log(id)
            const token = localStorage.getItem("token")
            const res = await instance.delete(`/delete-course/${id}`, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })
            console.log(res.data)
            return res.data?.id
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete the course") 
        }
    }
)

// student view their enroll course
export const Fetch_student_enroll_course_Thunk = createAsyncThunk("/enroll/fetch",
    async ({token, student_id}, { rejectWithValue }) => {
        try {
            const res = await instance.get(`${student_id}/enroll-course`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch enroll course")
        }
    }
)