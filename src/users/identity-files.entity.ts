import { Table, Model, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DataTypes } from "sequelize";
import { UserIdentities } from './user-identities.entity';
import { Files } from './files.entity';

@Table
export class IdentityFiles extends Model {
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    })
    id: string;

    @ForeignKey(() => UserIdentities)
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    })
    identityId: string;

    @ForeignKey(() => Files)
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    })
    fileId: string;
}