import UserInfoType from "../types/UserInfoType";
import ReturnType from "../types/ReturnType";
import validatePassword from "./validatePassword";
import { User } from "../models/User";
import bcrypt from 'bcrypt';
import validator from "validator";

async function userLogin(userInfo: UserInfoType|undefined): Promise<ReturnType>{
    const message = 'E-mail e/ou senha inválidos';

    if( !userInfo || !userInfo.email || !userInfo.password) return;
    
    if(!validator.isEmail(userInfo.email) || !validatePassword(userInfo.password)){
        return { message }
    }
    
    const user = await User.findOne({where: { email: userInfo.email }});
    
    if(!user) return { message };
    
    const validPassword = await bcrypt.compare(userInfo.password, user.password);

    if(!validPassword) return {message};

    return { user: {name: user.name, email: user.email} };
}

export default userLogin;