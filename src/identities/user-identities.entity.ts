import { Table, Model, Column, ForeignKey, BelongsTo, HasMany, BelongsToMany } from 'sequelize-typescript';
import { DataTypes } from "sequelize";
import { IdentityRejections } from './identity-rejections.entity';
import { Files } from './files.entity';
import { IdentityFiles } from './identity-files.entity';
import { Status } from 'src/users/status.enum';
import { User } from 'src/users/user.entity';

@Table
export class UserIdentities extends Model {
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    })
    id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    })
    userId: string;
    
    @Column
    status: Status;
    
    @BelongsTo(() => User)
    user: User;

    @BelongsToMany(() => Files, () => IdentityFiles)
    files: Files[];

    @HasMany(() => IdentityRejections)
    identityRejections: IdentityRejections[];

   
}
