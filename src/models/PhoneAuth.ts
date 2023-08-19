import { Model, DataTypes } from 'sequelize';
// import { sequelize } from '../instances/mysql';
import { sequelize } from '../instances/postgre';

export interface PhoneAuthInstance extends Model{
    user_id: number;
    otp_id: string | null;
    status: 'pending' | 'approved' | 'pending_phone' | 'pending_send';
    exp: string | null;
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
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    exp: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'phone_auth',
    timestamps: false
});