export type User = {
    login: string;
    member?: {
        name: string;
    };
};

export type Comment = {
    id: number;
    content: string;
    createdAt: string;
    createdBy: number;
    createdByUser?: User;
};

export type Discussion = {
    id: number;
    title: string;
    content: string;
    status: string;
    createdAt: string;
    createdBy: number;
    createdByUser?: User;
    comments?: Comment[];
    _count?: {
        comments: number;
    };
};