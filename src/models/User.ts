import { Model, DataTypes } from 'sequelize';
// import { sequelize } from '../instances/mysql';
import { sequelize } from '../instances/postgre';

export interface UserInstance extends Model {
    id: number,
    name: string,
    email: string,
    verified_email: boolean,
    password: string,
    sub: string | null
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