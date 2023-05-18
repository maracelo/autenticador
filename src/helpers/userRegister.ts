import UserInfoType from '../types/UserInfoType';
import UserRegisterReturnType from '../types/ReturnType';
import validatePassword from '../helpers/validatePassword';
import validator from 'validator';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

async function userRegister(userInfo: UserInfoType|undefined): Promise<UserRegisterReturnType>{
    if(!userInfo || !userInfo.name || !userInfo.email || !userInfo.password || !userInfo.password_confirmation){
        return;
    }

    if(userInfo.name.length < 2) return { message: 'Nome precisa de no mínimo 2 caracteres' };
    
    if(!validator.isEmail(userInfo.email)) return { message: 'E-mail inválido' };

    const user = await User.findOne({ where: { email: userInfo.email } });

    if(user) return { message: 'E-mail já está em uso' };

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
    
    const newUser = await User.create({
        name: finalName, 
        email: userInfo.email, 
        password: encryptedPassword 
    });
    
    return { user: {name: newUser.name, email: newUser.email} };
}

export default userRegister;