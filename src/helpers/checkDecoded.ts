import jwtDecode from "jwt-decode";
import JWTUserData from "../types/JWTUserData";
import verifyToken from "./verifyToken";

async function checkDecoded(token: any): Promise<JWTUserData | void>{

    if(!verifyToken(token)) return;

    const decoded: JWTUserData = await jwtDecode(token);

    if(!decoded || !decoded.name || !decoded.email) return;

    return decoded;
}

export default checkDecoded;