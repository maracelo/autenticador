import jwtDecode from "jwt-decode";
import JWTUserData from "../types/JWTUserData";

async function decodeJWT(token: any): Promise<JWTUserData | void>{
    let decoded: any;

    try{
        decoded = await jwtDecode(token);
    }catch(err){
        console.log(err);
        return;
    }

    if(!decoded || !decoded.id) return;

    return decoded;
}

export default decodeJWT;