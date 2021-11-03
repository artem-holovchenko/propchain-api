import { Table, Model, Column, Unique } from 'sequelize-typescript';
import { DataTypes } from "sequelize";

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
    first_name: string;

    @Column
    last_name: string;

    @Unique({ name: 'unique_username_err', msg: 'Username already exists' })
    @Column
    username: string;

    @Column
    phone: string;

    @Column
    email: string;

    @Column
    password: string;

    @Column
    salt: string;
}