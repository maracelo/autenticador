import { Model, DataTypes } from 'sequelize';
// import { sequelize } from '../instances/mysql';
import { sequelize } from '../instances/postgre';

export interface UserInstance extends Model {
    id: number;
    name: string;
    email: string;
    verified_email: boolean;
    phone: string | null;
    password: string;
    sub: string | null;
    active_token: string;
}

export const User = sequelize.define<UserInstance>('User', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    verified_email: {
        type: DataTypes.BOOLEAN
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING
    },
    sub: {
        type: DataTypes.STRING,
        allowNull: true
    },
    active_token: {
        type: DataTypes.STRING
    }
},{
    tableName: 'users',
    timestamps: false
});