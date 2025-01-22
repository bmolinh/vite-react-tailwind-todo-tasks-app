import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Tag } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTags = createAsyncThunk("tags/fetchTags", async () => {
    const response = await fetch(`${API_URL}/tags`);
    const data = await response.json();
    return data as Tag[];
});

interface TagsState {
    tags: Tag[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: TagsState = {
    tags: [],
    status: "idle",
    error: null,
};

const tagsSlice = createSlice({
    name: "tags",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTags.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTags.fulfilled, (state, action: PayloadAction<Tag[]>) => {
                state.status = "succeeded";
                state.tags = action.payload;
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch tags";
            });
    },
});

export default tagsSlice.reducer;
