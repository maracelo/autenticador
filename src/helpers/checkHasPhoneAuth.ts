import { PhoneAuth } from "../models/PhoneAuth";

async function checkHasPhoneAuth(userId: number, phone: string | null){
    
    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: userId} });

    if(!phoneAuth) return null;

    if(phoneAuth.status === 'approved') return 'approved';
    
    if(!phone) return 'pending_phone';
    
    return 'pending';
}

export default checkHasPhoneAuth;