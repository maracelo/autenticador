import { PhoneAuth } from "../../models/PhoneAuth";
import { UserInstance } from "../../models/User";

async function changePhoneAuth(phoneAuthToggle: undefined|boolean, user: UserInstance){

    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });

    if(phoneAuthToggle && !phoneAuth){
        
        if(!user.phone){
            await PhoneAuth.create({ user_id: user.id, status: 'pending_phone' });
    
            return { message: 'Verificação por SMS ativada' }
        }

        await PhoneAuth.create({ user_id: user.id, status: 'pending_send' });

        return { message: 'Verificação por SMS ativada' }

    } else if(!phoneAuthToggle && phoneAuth){

        await phoneAuth.destroy();

        return { message: 'Verificação por SMS desativada' };
    } 

    return { errMessage: 'Má Requisição' };
}

export default changePhoneAuth;