import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize/types";
import { User } from "./users/user.entity";

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize({
                dialect: process.env.DIALECT_DB as Dialect,
                host: process.env.HOST_DB,
                port: +process.env.PORT_DB,
                username: process.env.USERNAME_DB,
                password: process.env.PASS_DB,
                database: process.env.DB,
            });
            sequelize.addModels([User]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
