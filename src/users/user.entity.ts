import { Table, Model, Column, Unique, HasOne, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { DataTypes } from "sequelize";
import { Role } from '../auth/role.enum';
import { UserIdentities } from 'src/identities/user-identities.entity';
import { Files } from 'src/identities/files.entity';

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

    @Column({defaultValue: false})
    emailIsVerified: boolean;

    @Column({defaultValue: false})
    isUsaCitizen: boolean;

    @Column
    role: Role;

    @ForeignKey(() => Files)
    @Column({
        type: DataTypes.UUID
    })
    avatarFileId: string;

    @HasOne(() => UserIdentities)
    userIdenteties: UserIdentities;

    @BelongsTo(() => Files)
    file: Files;
}