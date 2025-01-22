import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import tagsReducer from "./tagsSlice";

const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        tags: tagsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;