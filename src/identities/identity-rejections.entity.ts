import { Table, Model, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DataTypes } from "sequelize";
import { UserIdentities } from './user-identities.entity';

@Table
export class IdentityRejections extends Model {
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

    @BelongsTo(() => UserIdentities)
    userIdentities: UserIdentities;

    @Column
    description: string;
}