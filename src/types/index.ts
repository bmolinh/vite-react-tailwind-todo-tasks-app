export interface Tag {
    id: number;
    name: string;
}

export interface Task {
    id: number;
    order: number;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    tags: Tag[];
}
