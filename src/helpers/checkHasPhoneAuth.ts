import { PhoneAuth } from "../models/PhoneAuth";

async function checkHasPhoneAuth(userId: number, phone: string | null){
    
    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: userId} });

    if(!phoneAuth) console.log('não tem phoneAuth');
    
    if(!phoneAuth) return null;

    if(phoneAuth) console.log('tem phoneAuth');
    
    if(phoneAuth.auth) return 'approved';
    
    if(!phone) return 'pending_phone';
    
    return 'pending';
}

export default checkHasPhoneAuth;

// se tem phoneauth no db é pq tá pending e tem que checar se o úsuario tem phone

// pending phone
//  acontece quando o usuario não tem phone e tem um phone auth
//  tenho que checar no auth se o usuario tem phone