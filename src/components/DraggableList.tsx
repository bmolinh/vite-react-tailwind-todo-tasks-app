import React from "react";
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch } from "../store";
import { reorderTasks } from "../store/tasksSlice";
import { Task } from "../types";

interface DraggableListProps {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
}

const DraggableList: React.FC<DraggableListProps> = ({ tasks, setTasks }) => {
    const dispatch: AppDispatch = useDispatch();

    const onDragEnd: OnDragEndResponder = (result) => {
        if (!result.destination) return;

        const reorderedTasks = Array.from(tasks);
        const [removed] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, removed);

        const updatedTasks = reorderedTasks.map((task, index) => ({
            ...task,
            order: index + 1,
        }));

        setTasks(updatedTasks);
        dispatch(reorderTasks(updatedTasks));
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <ul className="space-y-2" {...provided.droppableProps} ref={provided.innerRef}>
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                {(provided) => (
                                    <li
                                        className="p-4 border rounded shadow"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Link to={`/tasks/${task.id}`} className="block">
                                            {task.title}
                                        </Link>
                                    </li>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DraggableList;
