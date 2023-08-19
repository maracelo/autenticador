import { PhoneAuth } from "../../models/PhoneAuth";
import { UserInstance } from "../../models/User";

async function checkPhoneAuthStatus(user: UserInstance){
    
    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });

    if(!phoneAuth) return null;

    return phoneAuth.status;
}

export default checkPhoneAuthStatus;