import UserInfoType from "../types/UserInfoType";
import ReturnType from "../types/ReturnType";
import validatePassword from "./validatePassword";
import { User } from "../models/User";
import bcrypt from 'bcrypt';
import validator from "validator";

async function userLogin(userInfo: UserInfoType): Promise<ReturnType>{
    let response;

    if(!userInfo) return { message: 'Erro no Sistema' };
    
    if(userInfo.password) response = await defaultUserInfoValidation(userInfo);
    
    if(userInfo.sub) response = await SSOUserInfoValidation(userInfo);

    if(!response) return;
    
    const { user, message } = response;

    if(message) return { message };

    if(user) return { user: {name: user.name, email: user.email/* , phone: user.phone ?? undefined */} };
}

async function defaultUserInfoValidation(userInfo: UserInfoType): Promise<ReturnType>{
    const message = 'E-mail e/ou senha inválidos';

    if( !userInfo || !userInfo.email || !userInfo.password) return;
    
    if(!validator.isEmail(userInfo.email) || !validatePassword(userInfo.password)){
        return { message }
    }

    const user = await User.findOne({where: { email: userInfo.email }});
    
    if(!user) return { message };
    
    const validPassword = await bcrypt.compare(userInfo.password, user.password);

    if(!validPassword) return {message};

    return { user: {name: user.name, email: user.email/* , phone: user.phone ?? undefined */} };
}

async function SSOUserInfoValidation(userInfo: UserInfoType): Promise<ReturnType>{
    if(!userInfo || !userInfo.email || !userInfo.sub){
        return { message: 'Esse tipo de Login está indisponível no momento, tente mais tarde' };
    }

    const user = await User.findOne({ where: { email: userInfo.email } });

    if(!user || !user.sub) return { message: 'Usuário não encontrado' };

    const validatedSub = await bcrypt.compare(userInfo.sub, user.sub);

    if(!validatedSub) return { message: 'Usuário inválido' };

    return { user: {name: user.name, email: user.email} };
}

export default userLogin;