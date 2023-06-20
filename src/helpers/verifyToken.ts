import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function verifyToken(token: any){
    if(!token || typeof(token) !== 'string') return false;

    try{
        JWT.verify(token, process.env.JWT_SECRET_KEY as string);
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}

export default verifyToken;