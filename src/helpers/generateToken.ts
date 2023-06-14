import JWT from 'jsonwebtoken';
import TokenDataType from "../types/TokenDataType";

const generateToken = (data: TokenDataType) =>{
    return JWT.sign(data, process.env.JWT_SECRET_KEY as string)
}

export default generateToken;