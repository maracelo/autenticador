import dotenv from 'dotenv';
import setSequelize from '../helpers/setSequelize';

dotenv.config();

export const sequelize = setSequelize(
    {
        tool: 'postgres',
        name: process.env.POSTGRE_DB as string,
        user: process.env.POSTGRE_USER as string,
        password: process.env.POSTGRE_PASSWORD as string,
        port: process.env.POSTGRE_PORT as string,
        url: process.env.POSTGRE_URL as string
    }
);