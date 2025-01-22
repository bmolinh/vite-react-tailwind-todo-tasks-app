import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { fetchTaskById, deleteTask } from "../store/tasksSlice";

const TaskDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const task = useSelector((state: RootState) => state.tasks.tasks.find((task) => task.id === Number(id)));

    useEffect(() => {
        if (id) {
            dispatch(fetchTaskById(Number(id)));
        }
    }, [id, dispatch]);

    const handleDelete = () => {
        if (id) {
            dispatch(deleteTask(Number(id)));
            navigate("/");
        }
    };

    if (!task) return <div>Task not found</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
            <p>{task.description}</p>
            <Link to={`/tasks/edit/${task.id}`} className="text-blue-500">
                Edit Task
            </Link>
            <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
            >
                Delete Task
            </button>
        </div>
    );
};

export default TaskDetail;
