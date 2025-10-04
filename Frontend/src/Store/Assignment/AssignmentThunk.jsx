import {createAsyncThunk} from '@reduxjs/toolkit'
import instance from '../../Components/Axios/instance'

// create assignment
export const create_assignment_Thunk = createAsyncThunk("/assignment/create",
    async (assignmentData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const res = await instance.post("/create-assignment", assignmentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create assignment")
        }
    }
)

// FEtch  all assignments
export const Fetch_assignment_Thunk = createAsyncThunk("/assignment/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await instance.get("/assignment/all");
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch assignments")
        }
    }
)

// assignment by id
export const Fetch_assignment_by_id_Thunk = createAsyncThunk("/assignment/fetch-by-id",
    async (id, { rejectWithValue }) => {
        try {
            const res = await instance.get(`/assignment/${id}`);
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch assignment")
        }
    }
)        

// delete assignment
export const delete_assignment_Thunk = createAsyncThunk("/assignment/delete",
    async (id, {rejectWithValue})=> {
        try {
            const token = localStorage.getItem("token")
            const res = await instance.delete(`/assignment/${id}`, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })
            return res.data?.id
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete the assignment") 
        }
    }   
)

// update assignment by id
export const update_assignment_Thunk = createAsyncThunk("/assignment/update",
    async ({id, assignmentData}, {rejectWithValue})=> {
        try {
            const token = localStorage.getItem("token")
            const res = await instance.put(`/assignment/${id}`, assignmentData, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })
            return res.data?.id
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update the assignment") 
        }
    }   
)