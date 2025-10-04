import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../Components/Axios/instance"


import { toast } from "react-toastify";
export const SignupUserThunk = createAsyncThunk(
    "/auth/signup",
    async (UserData, { rejectWithValue }) => {
        try {
            await instance.post("/register", UserData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            // after signup auto login
            const loginPayload = {
                username: UserData.username,
                password: UserData.password
            };
            const res = await instance.post("/login", loginPayload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            toast.success("✅ Login successfully")
            return res.data
        } catch (error) {
            const errorOutput = error?.response?.data?.detail
            toast.error(errorOutput)
            return rejectWithValue(errorOutput)

        }
    }
)
export const LoginUserThunk = createAsyncThunk(
    "/auth/login",
    async (UserData, { rejectWithValue }) => {
        try {
            const res = await instance.post("/login", UserData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            toast.success("✅ Login successfully")
            return res.data
        } catch (error) {
            const errorOutput = error?.response?.data?.detail
            toast.error(errorOutput)
            return rejectWithValue(errorOutput)

        }
    }
)

// fetch all users
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (token, { rejectWithValue }) => {
    try {
      const res = await instance.get("/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// fetch current USer
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (token, { rejectWithValue }) => {
    try {
      const res = await instance.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
)