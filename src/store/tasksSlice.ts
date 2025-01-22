import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Task } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    return data as Task[];
});

export const fetchTasksByDueDate = createAsyncThunk("tasks/fetchTasksByDueDate", async (dueDate: string) => {
    const response = await fetch(`${API_URL}/tasks?dueDate=${encodeURIComponent(dueDate)}`);
    const data = await response.json();
    return data as Task[];
});

export const fetchTasksByCompletion = createAsyncThunk("tasks/fetchTasksByCompletion", async (completed: boolean) => {
    const response = await fetch(`${API_URL}/tasks?completed=${completed}`);
    const data = await response.json();
    return data as Task[];
});

export const fetchTaskById = createAsyncThunk("tasks/fetchTaskById", async (id: number) => {
    const response = await fetch(`${API_URL}/tasks/${id}`);
    const data = await response.json();
    return data as Task;
});

export const createTask = createAsyncThunk("tasks/createTask", async (task: Partial<Task>) => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: task.title,
            description: task.description,
            tags: task.tags,
            dueDate: task.dueDate,
        }),
    });
    const data = await response.json();
    return data as Task;
});

export const updateTask = createAsyncThunk(
    "tasks/updateTask",
    async ({ id, task }: { id: number; task: Partial<Task> }) => {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: task.title,
                description: task.description,
                completed: task.completed,
                tags: task.tags,
                dueDate: task.dueDate,
            }),
        });
        const data = await response.json();
        return data as Task;
    },
);

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id: number) => {
    await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
    });
    return id;
});

export const reorderTasks = createAsyncThunk("tasks/reorderTasks", async (tasks: { id: number; order: number }[]) => {
    const response = await fetch(`${API_URL}/tasks/orders`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks),
    });
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
            })
            .addCase(fetchTasksByDueDate.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.status = "succeeded";
                state.tasks = action.payload;
            })
            .addCase(fetchTasksByCompletion.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.status = "succeeded";
                state.tasks = action.payload;
            })
            .addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
                const index = state.tasks.findIndex((task) => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                } else {
                    state.tasks.push(action.payload);
                }
            })
            .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.tasks.push(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
                const index = state.tasks.findIndex((task) => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            })
            .addCase(reorderTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.tasks = action.payload;
            });
    },
});

export const { setTasks } = tasksSlice.actions;

export default tasksSlice.reducer;
