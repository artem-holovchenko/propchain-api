import { Table, Model, Column, BelongsToMany, BelongsTo, HasOne } from 'sequelize-typescript';
import { DataTypes } from "sequelize";
import { UserIdentities } from './user-identities.entity';
import { IdentityFiles } from './identity-files.entity';
import { PropertyImages } from 'src/properties/property-images.entity';
import { Properties } from 'src/properties/properties.entity';
import { User } from 'src/users/user.entity';

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

    @HasOne(() => User)
    user: User;

    @BelongsToMany(() => Properties, () => PropertyImages)
    properties: Array<Properties & {PropertyImages: PropertyImages}>

    @BelongsToMany(() => UserIdentities, () => IdentityFiles)
    userIdentities: UserIdentities[];
}