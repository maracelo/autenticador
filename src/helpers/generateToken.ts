import jwt from 'jsonwebtoken';

async function generateToken(data: any, exp: number): Promise<string>{
    try{
        if(data === '') throw Error('Data is Empty');
        return jwt.sign(data, process.env.JWT_SECRET_KEY as string, {expiresIn: exp});
    }catch(err){
        console.log(err);
        return '';
    }
}

export default generateToken;