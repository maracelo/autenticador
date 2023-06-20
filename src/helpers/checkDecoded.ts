import jwtDecode from "jwt-decode";
import TokenDataType from "../types/TokenDataType";
import verifyToken from "./verifyToken";

async function checkDecoded(token: any): Promise<void | 'verified' | 'not_verified'>{
    if(!verifyToken(token)) return;

    const decoded: TokenDataType = await jwtDecode(token);

    if(!decoded || !decoded.name || !decoded.email) return;

    return decoded.verified_email ? 'verified' : 'not_verified';
}

export default checkDecoded;