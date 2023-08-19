import { User, UserInstance } from '../../models/User';
import { PhoneAuth } from '../../models/PhoneAuth';
import phoneNumberValidation from '../phone/phoneNumberValidation';

async function changePhone(phone: string, user: UserInstance){
    const sanitizedPhone = phoneNumberValidation(phone);

    if(!sanitizedPhone) return {errMessage: 'Número Inválido'};
    
    const exists = await User.findOne({ where: {phone: sanitizedPhone} });

    if(exists) return {errMessage: 'Número de Celular já em uso'};

    await user.update({ phone: sanitizedPhone });

    await PhoneAuth.update({ status: 'pending_send' }, { where: {user_id: user.id} });

    return { message: 'Número de celular atualizado' };
}

export default changePhone;