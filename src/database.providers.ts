import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize/types";
import { User } from "./users/user.entity";

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize(process.env.DATABASE_URL, {
                dialect: process.env.DIALECT_DB as Dialect,
                host: process.env.HOST_DB,
                port: +process.env.PORT_DB,
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false,
                    }
                },               
            });
            sequelize.addModels([User]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
