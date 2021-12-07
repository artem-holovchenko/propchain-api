import { Table, Model, Column, BelongsToMany } from 'sequelize-typescript';
import { DataTypes } from "sequelize";
import { UserIdentities } from './user-identities.entity';
import { IdentityFiles } from './identity-files.entity';

@Table
export class Files extends Model {
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    })
    id: string;

    @Column
    name: string;

    @Column
    url: string;

    @BelongsToMany(() => UserIdentities, () => IdentityFiles)
    userIdentities: UserIdentities[];
}