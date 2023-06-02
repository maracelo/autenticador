import UserInfoType from '../types/UserInfoType';
import ReturnType from '../types/ReturnType';
import validatePassword from '../helpers/validatePassword';
import validator from 'validator';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

async function userRegister(userInfo: UserInfoType|undefined): Promise<ReturnType>{
    let response;
    
    if(userInfo){
        if(userInfo.password && userInfo.password_confirmation) response = await defaultUserInfoValidation(userInfo);
        
        if(userInfo.sub) response = await SSOUserInfoValidation(userInfo);

    }else{
        return { message: 'Erro no Sistema' };
    }

    if(response){
        const { user, message } = response;
    
        if(message) return { message };

        if(user){
            const newUser = await User.create({
                name: user.name, 
                email: user.email, 
                password: user.password ?? '',
                sub: user.sub ?? null
            });
            
            return { user: {name: newUser.name, email: newUser.email} }
        }
    }

    return;
}

async function defaultUserInfoValidation(userInfo: UserInfoType|undefined): Promise<ReturnType>{
    if(!userInfo || !userInfo.name || !userInfo.email || !userInfo.password || !userInfo.password_confirmation){
        return;
    }

    if(userInfo.name.length < 2) return { message: 'Nome precisa de no mínimo 2 caracteres' };
    
    if(!validator.isEmail(userInfo.email)) return { message: 'E-mail inválido' };

    const user = await User.findOne({ where: { email: userInfo.email } });

    if(user) return { message: 'E-mail já está em uso' };

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

    const finalName = validator.blacklist(userInfo.name, '<>');
    const encryptedPassword = await bcrypt.hash(userInfo.password, 8);
    return {
        user: {
            name: finalName,
            email: userInfo.email,
            password: encryptedPassword
        }
    }
}

async function SSOUserInfoValidation(userInfo: UserInfoType|undefined): Promise<ReturnType>{
    if(!userInfo || !userInfo.name || !userInfo.email || !userInfo.sub){
        return { message: 'Esse tipo de Login está indisponível no momento, tente mais tarde' };
    }

    const user = await User.findOne({ where: { email: userInfo.email } });

    if(user) return { message: 'E-mail já está em uso' };
    
    const encryptedSub = await bcrypt.hash(userInfo.sub, 8);

    return {
        user: {
            name: userInfo.name,
            email: userInfo.email,
            sub: encryptedSub
        }
    }
}

export default userRegister;