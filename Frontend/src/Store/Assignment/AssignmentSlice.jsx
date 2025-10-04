import { createSlice } from "@reduxjs/toolkit";
import {
    Fetch_assignment_Thunk,
    create_assignment_Thunk,
    delete_assignment_Thunk,
    update_assignment_Thunk,
    Fetch_assignment_by_id_Thunk
} from "./AssignmentThunk";
const initialState = {
    assignment: [],
    loading: false,
    error: null,
}

export const AssignmentSlice = createSlice({
    name: "assignment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // fetch assignments
        builder.addCase(Fetch_assignment_Thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(Fetch_assignment_Thunk.fulfilled, (state, action) => {
            state.loading = false;
            state.assignment = action.payload;
        })
        builder.addCase(Fetch_assignment_Thunk.rejected, (state) => {
            state.loading = false;
            state.error = action.payload;
        })

        //create assignment
        builder.addCase(create_assignment_Thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(create_assignment_Thunk.fulfilled, (state, action) => {
            state.loading = false;
            state.assignment.push(action.payload);
        })
        builder.addCase(create_assignment_Thunk.rejected, (state) => {
            state.loading = false;
            state.error = action.payload;
        })

        //delete assignment
        builder.addCase(delete_assignment_Thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(delete_assignment_Thunk.fulfilled, (state, action) => {
            state.loading = false;
            state.assignment = state.assignment.filter((assignment) => assignment._id !== action.payload);
        })
        builder.addCase(delete_assignment_Thunk.rejected, (state) => {
            state.loading = false;
            state.error = action.payload;
        })

        //update assignment
        builder.addCase(update_assignment_Thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(update_assignment_Thunk.fulfilled, (state, action) => {
            state.loading = false;
            state.assignment = state.assignment.map((assignment) => assignment._id === action.payload._id ? action.payload : assignment);
        })
        builder.addCase(update_assignment_Thunk.rejected, (state) => {
            state.loading = false;
            state.error = action.payload;
        })

        //fetch assignment by id
        builder.addCase(Fetch_assignment_by_id_Thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(Fetch_assignment_by_id_Thunk.fulfilled, (state, action) => {
            state.loading = false;
            state.assignment = action.payload;
        })
        builder.addCase(Fetch_assignment_by_id_Thunk.rejected, (state) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default AssignmentSlice.reducer