export interface IModelUser
{
    uuid?: string;
    username: string;
    email: string;
    password: string;
    name: string;
    lastname: string;
    enterprise?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IModelWHook
{
    count?: any;
    uuid?: string;
    event: string;
    category: string;
    message_id: string;
    email: string;
    timestamp: number;
    event_id: string;
    reason?: string;
    createdAt?: Date;
    deliveryCount?: number;
    rejectedCount?: number;
}

export interface IModelWHookStat
{
    uuid?: string;
    event: string;
    count: number;
    event_two?: string;
    count_two?: number;
    createdAt?: Date;
}