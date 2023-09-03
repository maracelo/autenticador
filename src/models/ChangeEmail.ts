import { Model, DataTypes } from "sequelize";
// import { sequelize } from '../instances/mysql';
import { sequelize } from '../instances/postgre';

export interface ChangeEmailInstance extends Model {
    user_id: number,
    new_email: string
}

export const ChangeEmail = sequelize.define<ChangeEmailInstance>('ChangeEmail', {
    user_id: {
        primaryKey: true,
        type: DataTypes.NUMBER
    },
    new_email: DataTypes.STRING,
},{
    tableName: 'change_email',
    timestamps: false
});