import { Status } from "src/users/status.enum";


export interface IUserIdentity {
    id?: string;
    status?: Status;

}