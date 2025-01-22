import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DraggableList from "./components/DraggableList";
import "./index.css";
import { fetchTasks, setTasks } from "./store/tasksSlice";
import { RootState, AppDispatch } from "./store";

function App() {
    const dispatch: AppDispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const status = useSelector((state: RootState) => state.tasks.status);
    const error = useSelector((state: RootState) => state.tasks.error);

    useEffect(() => {
        if (status === "idle") dispatch(fetchTasks());
    }, [status, dispatch]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "failed") {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">TODO List</h1>
            <DraggableList tasks={tasks} setTasks={(newTasks) => dispatch(setTasks(newTasks))} />
        </div>
    );
}

export default App;
