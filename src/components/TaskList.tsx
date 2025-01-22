import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { fetchTasks, fetchTasksByDueDate, fetchTasksByCompletion } from "../store/tasksSlice";
import DraggableList from "./DraggableList";

const TaskList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const status = useSelector((state: RootState) => state.tasks.status);
    const error = useSelector((state: RootState) => state.tasks.error);
    const [filter, setFilter] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchTasks());
        }
    }, [status, dispatch]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFilter(value);

        if (value === "dueDate" && dueDate) {
            dispatch(fetchTasksByDueDate(dueDate));
        } else if (value === "completed") {
            dispatch(fetchTasksByCompletion(true));
        } else if (value === "notCompleted") {
            dispatch(fetchTasksByCompletion(false));
        } else {
            dispatch(fetchTasks());
        }
    };

    const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDueDate(value);
        if (filter === "dueDate") {
            dispatch(fetchTasksByDueDate(value));
        }
    };

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "failed") {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">TODO List</h1>
            <Link to="/tasks/new" className="text-blue-500">
                Add New Task
            </Link>
            <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filter">
                    Filter Tasks
                </label>
                <select
                    id="filter"
                    value={filter}
                    onChange={handleFilterChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">All Tasks</option>
                    <option value="dueDate">By Due Date</option>
                    <option value="completed">Completed Tasks</option>
                    <option value="notCompleted">Not Completed Tasks</option>
                </select>
                {filter === "dueDate" && (
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
                            Select Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            value={dueDate}
                            onChange={handleDueDateChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                )}
            </div>
            <DraggableList tasks={tasks} setTasks={() => {}} />
        </div>
    );
};

export default TaskList;
