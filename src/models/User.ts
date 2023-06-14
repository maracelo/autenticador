import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

interface UserInstance extends Model {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    password: string;
    sub: string | null;
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
    }
},{
    tableName: 'users',
    timestamps: false
});