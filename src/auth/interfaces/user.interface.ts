export interface IUser {
    id?: string;
    first_name?: string;
    last_name?: string;
    username: string;
    phone?: string;
    email?: string;
    password?: string;
    salt?: string;
}