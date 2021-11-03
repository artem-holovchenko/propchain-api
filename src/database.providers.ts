import { Sequelize } from "sequelize-typescript";
import { User } from "./auth/user.entity";

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize({
                dialect: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: 'postgres',
                database: 'propchain-app',
            });  
            sequelize.addModels([User]);         
            await sequelize.sync();
            return sequelize;
        },
    },
];
