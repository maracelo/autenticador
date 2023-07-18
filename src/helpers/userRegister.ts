import validator from 'validator';
import bcrypt from 'bcryptjs';
import UserInfo from '../types/UserInfo';
import DefaultReturn from '../types/DefaultReturn';
import { User } from '../models/User';
import validatePassword from './validatePassword';
import sanitizeName from './sanitizeName';

async function userRegister(userInfo: UserInfo|undefined): Promise<DefaultReturn>{
    let response;
    
    if(!userInfo) return { message: 'Erro no Sistema' };

    if(userInfo.password && userInfo.password_confirmation) response = await defaultUserInfoValidation(userInfo);
    
    if(userInfo.sub) response = await SSOUserInfoValidation(userInfo);

    if(response){
        if(response.message) return { message: response.message };

        if(response.user){
            const { user } = response;

            const newUser = await User.create({
                name: user.name, 
                email: user.email, 
                password: user.password ?? '',
                sub: user.sub ?? null
            });
        
            return { message: '',
                user: {
                    id: newUser.id,
                    name: newUser.name, 
                    email: newUser.email, 
                    verified_email: newUser.verified_email,
                    phone: newUser.phone ?? undefined
                }
            };
        }
    }

    return { message: '' };
}

async function defaultUserInfoValidation(userInfo: UserInfo): Promise<DefaultReturn>{
    if(
        !userInfo || !userInfo.name || !userInfo.email || 
        !userInfo.password || !userInfo.password_confirmation
    ) return { message: '' };

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
    const encryptedPassword = await bcrypt.hashSync(userInfo.password, 8);

    return {user: {
        name: finalName,
        email: userInfo.email,
        verified_email: false,
        password: encryptedPassword
    }};
}

async function SSOUserInfoValidation(userInfo: UserInfo): Promise<DefaultReturn>{
    if(!userInfo || !userInfo.name || !userInfo.email || !userInfo.sub){
        return { message: 'Esse tipo de Login está indisponível no momento, tente mais tarde' };
    }

    const user = await User.findOne({ where: { email: userInfo.email } });

    if(user) return { message: 'E-mail já está em uso' };

    const finalName = sanitizeName(userInfo.name);
    const encryptedSub = await bcrypt.hashSync(userInfo.sub, 8);

    return {user: {
        name: finalName,
        email: userInfo.email,
        verified_email: true,
        sub: encryptedSub
    }};
}

export default userRegister;