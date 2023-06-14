import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

interface PhoneAuthInstance extends Model{
    user_id: number;
    otp_id: string;
    auth: boolean;
    status: boolean;
}

export const PhoneAuth = sequelize.define<PhoneAuthInstance>('PhoneAuth', {
    user_id: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    otp_id: {
        type: DataTypes.STRING
    },
    auth: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'phone_auth',
    timestamps: false
});