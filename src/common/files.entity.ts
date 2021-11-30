import { Table, Model, Column, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { DataTypes } from "sequelize";
import { Properties } from 'src/properties/properties.entity';
import { PropertyImages } from 'src/properties/property-images.entity';

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

    @BelongsToMany(() => Properties, () => PropertyImages)
    properties: Array<Properties & {PropertyImages: PropertyImages}>
    //properties: Properties[];
}