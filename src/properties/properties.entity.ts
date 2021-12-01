import { Table, Model, Column, BelongsToMany, Unique, DataType } from 'sequelize-typescript';
import { DataTypes } from "sequelize";
import { Files } from 'src/common/files.entity';
import { PropertyImages } from './property-images.entity';

@Table
export class Properties extends Model {
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    })
    id: string;

    @Unique({ name: 'unique_property_name_err', msg: 'Property name already exists' })
    @Column
    name: string;

    @Column
    description: string;

    @Column
    address: string;

    @Column
    coordinates: string;

    @Column({type: DataType.FLOAT})
    totalTokens: number;

    @Column({type: DataType.FLOAT})
    tokenPrice: number;

    @Column
    startDate: Date;

    @Column
    endDate: Date;

    @Column
    type: string;

    @Column
    constructionYear: number;

    @Column
    neighborhood: string;

    @Column({type: DataType.FLOAT})
    squareFeet: number;

    @Column({type: DataType.FLOAT})
    lotSize: number;

    @Column
    totalUnits: number;

    @Column
    bedroom: number;

    @Column
    bath: number;

    @Column
    rented: string;

    @Column
    section8: string;

    @Column
    contractId: string;

    @BelongsToMany(() => Files, () => PropertyImages)
    files: Array<Files & {PropertyImages: PropertyImages}>;
}