import JWT from 'jsonwebtoken';

function generateToken(data: any){
    try{
        return JWT.sign(data, process.env.JWT_SECRET_KEY as string)
    }catch(err){
        console.log('err de generateToken: ' + err);
        return '';
    }
}

export default generateToken;