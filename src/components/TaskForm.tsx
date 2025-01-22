import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { createTask, updateTask } from "../store/tasksSlice";
import { Task } from "../types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const TaskForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const [initialValues, setInitialValues] = useState<Task>({
        id: Date.now(),
        order: tasks.length + 1,
        title: "",
        description: "",
        completed: false,
        dueDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
    });

    useEffect(() => {
        if (id) {
            const existingTask = tasks.find((task) => task.id === Number(id));
            if (existingTask) setInitialValues(existingTask);
        }
    }, [id, tasks]);

    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        dueDate: Yup.date()
            .required("Due Date is required")
            .min(new Date().toISOString().split("T")[0], "Due Date can't be in the past"),
    });

    const handleSubmit = (values: Task) => {
        if (id) {
            dispatch(updateTask({ id: values.id, task: values }));
        } else {
            dispatch(createTask(values));
        }
        navigate("/");
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{id ? "Edit Task" : "New Task"}</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Title
                            </label>
                            <Field
                                type="text"
                                name="title"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                Description
                            </label>
                            <Field
                                as="textarea"
                                name="description"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
                                Due Date
                            </label>
                            <Field
                                type="date"
                                name="dueDate"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage name="dueDate" component="div" className="text-red-500 text-sm" />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {id ? "Update Task" : "Add Task"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default TaskForm;
