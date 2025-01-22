import React from "react";

interface TaskItemProps {
    id: number;
    title: string;
    description: string;
    index: number;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, description, index, onDragStart, onDragOver, onDrop }) => {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
            className="p-4 border rounded shadow mb-2 bg-white"
        >
            <h3 className="font-bold">{title}</h3>
            <p>{description}</p>
        </div>
    );
};

export default TaskItem;
