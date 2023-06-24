import validator from 'validator';
import bcrypt from 'bcrypt';
import UserInfoType from '../types/UserInfoType';
import DefaultReturnType from '../types/DefaultReturnType';
import { User } from '../models/User';
import validatePassword from './validatePassword';
// import phoneNumberValidation from './phoneNumberValidation';
import sanitizeName from './sanitizeName';
// import { PhoneAuth } from '../models/PhoneAuth';

async function userRegister(userInfo: UserInfoType|undefined): Promise<DefaultReturnType>{
    let response;
    
    if(!userInfo) return { message: 'Erro no Sistema' };

    if(userInfo.password && userInfo.password_confirmation) response = await defaultUserInfoValidation(userInfo);
    
    if(userInfo.sub) response = await SSOUserInfoValidation(userInfo);

    if(!response || (!response.user && !response.message)) return;

    const {user, message} = response;

    if(message) return { message };

    if(user){
        const newUser = await User.create({
            name: user.name, 
            email: user.email, 
            password: user.password ?? '',
            sub: user.sub ?? null
        });

        return {user: {
            id: newUser.id,
            name: newUser.name, 
            email: newUser.email, 
            verified_email: newUser.verified_email,
            phone: newUser.phone ?? undefined
        }};
    }
}

async function defaultUserInfoValidation(userInfo: UserInfoType): Promise<DefaultReturnType>{
    if(
        !userInfo || !userInfo.name || !userInfo.email || 
        !userInfo.password || !userInfo.password_confirmation/*  || !userInfo.phone */
    ) return;

    if(!validator.isEmail(userInfo.email)) return { message: 'E-mail inválido' };
    
    const user = await User.findOne({ where: {email: userInfo.email} });
    
    if(user) return { message: 'E-mail já está em uso' };
    
    if(userInfo.name.length < 2) return { message: 'Nome precisa de no mínimo 2 caracteres' };

    if(!userInfo.password) return { message: 'Senha vazia' };

    if(userInfo.password !== userInfo.password_confirmation){
        return { message: 'Senhas precisam ser iguais' };
    }
    
    if(!validatePassword(userInfo.password)){
        return { 
            message: [
                'Senha tem que ter entre 8 a 100 caracteres',
                'Senha precisa de caracteres numéricos e alfabéticos',
                'Senha tem que ter 1 ou mais caracteres especias'
            ]
        };
    }

    const finalName = sanitizeName(userInfo.name);
    const encryptedPassword = await bcrypt.hash(userInfo.password, 8);

    return {user: {
        name: finalName,
        email: userInfo.email,
        verified_email: false,
        password: encryptedPassword
    }};
}

async function SSOUserInfoValidation(userInfo: UserInfoType): Promise<DefaultReturnType>{
    if(!userInfo || !userInfo.name || !userInfo.email || !userInfo.sub){
        return { message: 'Esse tipo de Login está indisponível no momento, tente mais tarde' };
    }

    const user = await User.findOne({ where: { email: userInfo.email } });

    if(user) return { message: 'E-mail já está em uso' };

    const finalName = sanitizeName(userInfo.name);
    const encryptedSub = await bcrypt.hash(userInfo.sub, 8);

    return {user: {
        name: finalName,
        email: userInfo.email,
        verified_email: true,
        sub: encryptedSub
    }};
}

export default userRegister;