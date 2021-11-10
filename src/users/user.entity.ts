import { Table, Model, Column, Unique } from 'sequelize-typescript';
import { DataTypes } from "sequelize";
import { Role } from '../auth/role.enum';

@Table
export class User extends Model {
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    })
    id: string;

    @Column
    firstName: string;

    @Column
    lastName: string;

    @Unique({ name: 'unique_username_err', msg: 'Username already exists' })
    @Column
    username: string;

    @Column
    phone: string;

    @Unique({ name: 'unique_email_err', msg: 'Email already exists' })
    @Column
    email: string;

    @Column
    password: string;

    @Column
    salt: string;

    @Column
    role: Role;
}