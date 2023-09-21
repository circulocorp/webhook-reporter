export interface IUserData
{
    username: string;
    email: string;
    password: string;
    name: string;
    lastname: string;
    enterprise: string;
}

export interface IAuthData
{
    username: string;
    password: string;
}

export interface IWHookData
{
    event: string;
    category: string;
    message_id: string;
    email: string;
    timestamp: number;
    event_id: string;
    reason?: string;
}