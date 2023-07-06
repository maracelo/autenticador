import jwtDecode from "jwt-decode";
import JWTUserData from "../types/JWTUserData";
import verifyToken from "./verifyToken";

type Response = {
    verified_email: boolean;
    phone_auth: 'pending' | 'pending_phone' | 'approved' | null;
}

async function checkDecoded(token: any): Promise<Response | void>{

    let res: Response = { verified_email: false, phone_auth: null }

    if(!verifyToken(token)) return;

    const decoded: JWTUserData = await jwtDecode(token);

    if(!decoded || !decoded.name || !decoded.email) return;
        
    res.verified_email = decoded.verified_email;

    res.phone_auth = decoded.phone_auth;

    return res;
}

export default checkDecoded;