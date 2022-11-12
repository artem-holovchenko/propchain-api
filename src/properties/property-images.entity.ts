import { Table, Model, Column, ForeignKey } from 'sequelize-typescript';
import { DataTypes } from "sequelize";
import { Properties } from './properties.entity';
import { Files } from 'src/identities/files.entity';

@Table
export class PropertyImages extends Model {
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    })
    id: string;

    @ForeignKey(() => Properties)
    @Column
    propertyId: string;

    @ForeignKey(() => Files)
    @Column
    fileId: string;

    @Column
    isMain: boolean;
}