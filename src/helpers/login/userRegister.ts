import validator from 'validator';
import bcrypt from 'bcrypt';
import { User, UserInstance } from '../../models/User';
import validatePassword from './validatePassword';
import sanitizeName from '../sanitizeName';

type UserRegisterReturn = {
    messages: string[],
    user?: UserInstance, email_status?: 'pending',
    phone_auth_status?: null
};

async function userRegister(userInfo: any): Promise<UserRegisterReturn>{
    let response;
    
    if(!userInfo) return { messages: ['Campos não enviados'] };

    if(userInfo.password && userInfo.password_confirmation) response = await defaultUserInfoValidation(userInfo);
    
    if(userInfo.sub) response = await SSOUserInfoValidation(userInfo);

    if(response?.messages && response.messages[0]) return { messages: response.messages };

    if(response?.finalUserInfo){
        const user = response.finalUserInfo;
        
        if(user){
            const newUser = await User.create({
                name: user.name, 
                email: user.email, 
                password: user.password ?? '',
                sub: user.sub ?? null
            });
        
            return { messages: [], user: newUser, email_status: 'pending', phone_auth_status: null };
        }
    }

    return { messages: ['Erro no Sistema! Tente novamente mais tarde'] };
}

async function defaultUserInfoValidation(userInfo: any){
    if(
        !userInfo || !userInfo.name || !userInfo.email || 
        !userInfo.password || !userInfo.password_confirmation
    ) return { messages: ['Campo não preenchido'] };

    let messages = [];

    if(!validator.isEmail(userInfo.email)) messages.push( 'E-mail inválido');
    
    const user = await User.findOne({ where: {email: userInfo.email} });
    
    if(user) messages.push( 'E-mail já está em uso');
    
    if(userInfo.name.length < 2) messages.push( 'Nome precisa de no mínimo 2 caracteres');

    if(!userInfo.password) messages.push( 'Senha vazia');

    if(userInfo.password !== userInfo.password_confirmation){
        messages.push( 'Senhas precisam ser iguais');
    }
    
    if(!validatePassword(userInfo.password)){
        [
            'Senha tem que ter entre 8 a 100 caracteres',
            'Senha precisa de caracteres numéricos e alfabéticos',
            'Senha tem que ter 1 ou mais caracteres especias'
        ].forEach((i: any) => { messages.push(i) });
    };      

    if(messages[0]) return { messages, finalName: null};

    const finalName = sanitizeName(userInfo.name);
    const encryptedPassword = await bcrypt.hash(userInfo.password, 8);

    return {
        messages: [],
        finalUserInfo: {
            name: finalName,
            email: userInfo.email,
            password: encryptedPassword,
            sub: null
        }
    };
}

async function SSOUserInfoValidation(userInfo: any){

    if(!userInfo || !userInfo.name || !userInfo.email || !userInfo.sub){
        return { messages: ['Campo não preenchido'] };
    }

    const user = await User.findOne({ where: { email: userInfo.email } });

    if(user) return { messages: ['E-mail já está em uso'] };

    const finalName = sanitizeName(userInfo.name);
    const encryptedSub = await bcrypt.hash(userInfo.sub, 8);

    return { 
        message: [],
        finalUserInfo: {
            name: finalName,
            email: userInfo.email,
            password: null,
            sub: encryptedSub
        } 
    };
}

export default userRegister;