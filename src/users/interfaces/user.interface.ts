import { Role } from "../../auth/role.enum";

export interface IUser {
    id?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    phone?: string;
    email?: string;
    password?: string;
    role?: Role;
    emailIsVerified?: boolean;
    isUsaCitizen?: boolean;
    avatarFileId?: string;

}