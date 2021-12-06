import { Status } from "src/users/status.enum";
import { IGetFile } from "./get-file.interface";


export interface IUserIdentity {
    id?: string;
    status?: Status;
}