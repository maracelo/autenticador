import { Model, DataTypes } from 'sequelize';
// import { sequelize } from '../instances/mysql';
import { sequelize } from '../instances/postgre';

interface PhoneAuthInstance extends Model{
    user_id: number;
    otp_id: string | null;
    auth: boolean;
    status: 'pending' | 'approved' | null;
    expires: string | null;
}

export const PhoneAuth = sequelize.define<PhoneAuthInstance>('PhoneAuth', {
    user_id: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    otp_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    auth: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expires: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'phone_auth',
    timestamps: false
});