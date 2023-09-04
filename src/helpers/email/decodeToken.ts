import jwt from 'jsonwebtoken';

async function decodeToken(token: any){
    if(!token || typeof(token) !== 'string') return false; 

    try{
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        
        if(!decoded.iat || !decoded.exp || !decoded.id) return false;
        
        return decoded;
    
    }catch(err){
        console.log(err);
        return false;
    }
}

export default decodeToken;