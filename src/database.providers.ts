import { Sequelize } from "sequelize-typescript";
import { Files } from "./identities/files.entity";
import { IdentityFiles } from "./identities/identity-files.entity";
import { IdentityRejections } from "./identities/identity-rejections.entity";
import { UserIdentities } from "./identities/user-identities.entity";
import { Properties } from "./properties/properties.entity";
import { PropertyImages } from "./properties/property-images.entity";
import { User } from "./users/user.entity";

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize(process.env.DATABASE_URL, {
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false,
                    }
                },
            });
            sequelize.addModels([User, Files, IdentityFiles, IdentityRejections, UserIdentities, Properties, PropertyImages]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
