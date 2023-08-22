import dotenv from 'dotenv';
import setSequelize from '../helpers/setSequelize';

dotenv.config();

export const sequelize = setSequelize(
    {
        tool: 'mysql',
        name: process.env.MYSQL_DB as string,
        user: process.env.MYSQL_USER as string,
        password: process.env.MYSQL_PASSWORD as string,
        port: process.env.MYSQL_PORT as string,
        url: process.env.MYSQL_URL as string
    }
);