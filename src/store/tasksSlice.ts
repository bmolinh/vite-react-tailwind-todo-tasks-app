import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Task } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    return data as Task[];
});

interface TasksState {
    tasks: Task[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: TasksState = {
    tasks: [],
    status: "idle",
    error: null,
};

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.status = "succeeded";
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch tasks";
            });
    },
});

export const { setTasks } = tasksSlice.actions;

export default tasksSlice.reducer;
