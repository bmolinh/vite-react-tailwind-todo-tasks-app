import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { createTask, updateTask } from "../store/tasksSlice";
import { Task } from "../types";

const TaskForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const [task, setTask] = useState<Task | null>(null);

    useEffect(() => {
        if (id) {
            const existingTask = tasks.find((task) => task.id === Number(id));
            if (existingTask) setTask(existingTask);
        } else {
            setTask({
                id: Date.now(),
                order: tasks.length + 1,
                title: "",
                description: "",
                completed: false,
                dueDate: new Date().toISOString().split("T")[0], // Set default due date to today
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: [],
            });
        }
    }, [id, tasks]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (task) setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (task) {
            if (id) dispatch(updateTask({ id: task.id, task }));
            else dispatch(createTask(task));

            navigate("/");
        }
    };

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{id ? "Edit Task" : "New Task"}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
                        Due Date
                    </label>
                    <input
                        type="date"
                        name="dueDate"
                        value={task.dueDate}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {id ? "Update Task" : "Add Task"}
                </button>
            </form>
        </div>
    );
};

export default TaskForm;
