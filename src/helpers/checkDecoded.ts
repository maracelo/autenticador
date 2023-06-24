import jwtDecode from "jwt-decode";
import JWTUserDataType from "../types/JWTUserDataType";
import verifyToken from "./verifyToken";

type ResponseType = {
    verified_email: boolean;
    phone_auth: 'pending' | 'pending_phone' | 'approved' | null;
}

async function checkDecoded(token: any): Promise<ResponseType | void>{

    let res: ResponseType = { verified_email: false, phone_auth: null }

    if(!verifyToken(token)) return;

    const decoded: JWTUserDataType = await jwtDecode(token);

    if(!decoded || !decoded.name || !decoded.email) return;
        
    res.verified_email = decoded.verified_email;

    res.phone_auth = decoded.phone_auth;

    return res;
}

export default checkDecoded;