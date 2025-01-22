import { useEffect, useState } from "react";
import DraggableList from "./components/DraggableList";
import "./index.css";
import { Task } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        fetch(`${API_URL}/tasks`)
            .then((response) => response.json())
            .then((data) => setTasks(data))
            .catch((error) => console.error("Error fetching tasks:", error));
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">TODO List</h1>
            <DraggableList tasks={tasks} setTasks={setTasks} />
        </div>
    );
}

export default App;
