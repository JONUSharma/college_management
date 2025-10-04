import { createSlice } from "@reduxjs/toolkit";
import { LoginUserThunk, SignupUserThunk, fetchUsers, fetchCurrentUser } from "./AuthThunk";

const initialState = {
    user: null,
    users: [],
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
    current_user : null,
    UserAuthenticated: false
}

export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("username");
        }
    },
    extraReducers: (builder) => {
        // login 
        builder.addCase(LoginUserThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(LoginUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload?.user;
            state.token = action.payload?.access_token;
            state.UserAuthenticated = true;
        })
        builder.addCase(LoginUserThunk.rejected, (state) => {
            state.loading = false;
            state.UserAuthenticated = false;
            state.error = action.payload?.error;
        })


        // for signup
        builder.addCase(SignupUserThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(SignupUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload?.user;
            state.token = action.payload?.access_token
            state.UserAuthenticated = true;
        })
        builder.addCase(SignupUserThunk.rejected, (state) => {
            state.loading = false;
            state.error = action.payload?.error;
            state.UserAuthenticated = false;
        })

            //  Fetch ALL USers
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetch current user
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.current_user = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
})


export const { logout } = AuthSlice.actions
export default AuthSlice.reducer