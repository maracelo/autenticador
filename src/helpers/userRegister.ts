import validator from 'validator';
import bcrypt from 'bcrypt';
import UserInfoType from '../types/UserInfoType';
import ReturnType from '../types/ReturnType';
import { User } from '../models/User';
import validatePassword from './validatePassword';
// import phoneNumberValidation from './phoneNumberValidation';
import sanitizeName from './sanitizeName';
// import { PhoneAuth } from '../models/PhoneAuth';

async function userRegister(userInfo: UserInfoType|undefined): Promise<ReturnType>{
    let response;
    
    if(!userInfo) return { message: 'Erro no Sistema' };

    if(userInfo.password && userInfo.password_confirmation) response = await defaultUserInfoValidation(userInfo);
    
    if(userInfo.sub) response = await SSOUserInfoValidation(userInfo);

    if(!response) return;

    const { user, message } = response;

    if(message) return { message };

    if(user){
        const newUser = await User.create({
            name: user.name, 
            email: user.email, 
            /* phone: user.phone ?? null, */
            password: user.password ?? '',
            sub: user.sub ?? null
        });

        // await PhoneAuth.create({ user_id: newUser.id });
        
        return { user: {name: newUser.name, email: newUser.email/* , phone: user.phone ?? undefined */} }
    }
}

async function defaultUserInfoValidation(userInfo: UserInfoType): Promise<ReturnType>{
    if(
        !userInfo || !userInfo.name || !userInfo.email || 
        !userInfo.password || !userInfo.password_confirmation/*  || !userInfo.phone */
    ) return;

    if(!validator.isEmail(userInfo.email)) return { message: 'E-mail inválido' };
    
    /* const validatedPhone = phoneNumberValidation(userInfo.phone);
    
    if(!validatedPhone) return { message: 'Número de Celular inválido'} */
    
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

    return { user: {name: finalName, email: userInfo.email, password: encryptedPassword/* , phone: userInfo.phone */} }
}

async function SSOUserInfoValidation(userInfo: UserInfoType): Promise<ReturnType>{
    if(!userInfo || !userInfo.name || !userInfo.email || !userInfo.sub){
        return { message: 'Esse tipo de Login está indisponível no momento, tente mais tarde' };
    }

    const user = await User.findOne({ where: { email: userInfo.email } });

    if(user) return { message: 'E-mail já está em uso' };

    const finalName = sanitizeName(userInfo.name);
    const encryptedSub = await bcrypt.hash(userInfo.sub, 8);

    return { user: {name: finalName, email: userInfo.email, sub: encryptedSub} }
}

export default userRegister;