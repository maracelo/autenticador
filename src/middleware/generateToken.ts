import JWT from 'jsonwebtoken';

export const generateToken = (data: Object) =>{
    return JWT.sign(data, process.env.JWT_SECRET_KEY as string)
}