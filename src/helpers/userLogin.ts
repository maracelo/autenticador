import UserInfoType from "../types/UserInfoType";
import DefaultReturnType from "../types/DefaultReturnType";
import validatePassword from "./validatePassword";
import { User } from "../models/User";
import bcrypt from 'bcrypt';
import validator from "validator";

async function userLogin(userInfo: UserInfoType): Promise<DefaultReturnType>{
    let response;

    if(!userInfo) return { message: 'Erro no Sistema' };
    
    if(userInfo.password) response = await defaultUserInfoValidation(userInfo);
    
    if(userInfo.sub) response = await SSOUserInfoValidation(userInfo);

    if(!response) return;
    
    const { user, message } = response;

    if(message) return { message };

    if(user) return {user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified_email: user.verified_email,
        phone: user.phone ?? undefined
    }};
}

async function defaultUserInfoValidation(userInfo: UserInfoType): Promise<DefaultReturnType>{
    const message = 'E-mail e/ou senha inválidos';

    if( !userInfo || !userInfo.email || !userInfo.password) return;
    
    if(!validator.isEmail(userInfo.email) || !validatePassword(userInfo.password)){
        return { message }
    }

    const user = await User.findOne({where: { email: userInfo.email }});
    
    if(!user) return { message };
    
    const validPassword = await bcrypt.compare(userInfo.password, user.password);

    if(!validPassword) return {message};

    return {user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified_email: user.verified_email,
        phone: user.phone ?? undefined
    }};
}

async function SSOUserInfoValidation(userInfo: UserInfoType): Promise<DefaultReturnType>{
    if(!userInfo || !userInfo.email || !userInfo.sub){
        return { message: 'Esse tipo de Login está indisponível no momento, tente mais tarde' };
    }

    const user = await User.findOne({ where: { email: userInfo.email } });

    if(!user || !user.sub) return { message: 'Usuário não encontrado' };

    const validatedSub = await bcrypt.compare(userInfo.sub, user.sub);

    if(!validatedSub) return { message: 'Usuário inválido' };

    return {user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified_email: true
    }};
}

export default userLogin;