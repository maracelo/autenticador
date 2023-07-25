import jwt from 'jsonwebtoken';

async function generateToken(data: any): Promise<string>{
    try{
        return jwt.sign(data, process.env.JWT_SECRET_KEY as string)
    }catch(err){
        console.log(err);
        return '';
    }
}

export default generateToken;