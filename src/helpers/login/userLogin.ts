import validator from "validator";
import bcrypt from 'bcrypt';
import { User, UserInstance } from "../../models/User";
import validatePassword from "./validatePassword";

type UserLoginReturn = {
    message: string, 
    user?: UserInstance,
    email_status?: 'pending'
};

async function userLogin(userInfo: any): Promise<UserLoginReturn>{
    let response;

    if(!userInfo) return { message: 'Campos não enviados' };
    
    if(userInfo.password) response = await defaultUserInfoValidation(userInfo);
    
    if(userInfo.sub) response = await SSOUserInfoValidation(userInfo);

    if(response?.message) return { message: response.message };

    if(response?.user){
        const { user } = response;

        if(user.verified_email) user.update({ verified_email: false });

        return { message: '', user, email_status: 'pending' };
    }

    return { message: 'Erro no Sistema! Tente novamente mais tarde' };
}

async function defaultUserInfoValidation(userInfo: any){
    const message = 'E-mail e/ou senha inválidos';

    if( !userInfo || !userInfo.email || !userInfo.password) return { message: '' };
    
    if(!validator.isEmail(userInfo.email) || !validatePassword(userInfo.password)){
        return { message }
    }

    const user = await User.findOne({where: { email: userInfo.email }});
    
    if(!user) return { message };

    const validPassword = await bcrypt.compare(userInfo.password, user.password);

    if(!validPassword) return {message};

    return { message: '', user };
}

async function SSOUserInfoValidation(userInfo: any){
    if(!userInfo || !userInfo.email || !userInfo.sub){
        return { message: 'Esse tipo de Login está indisponível no momento, tente mais tarde' };
    }

    const user = await User.findOne({ where: { email: userInfo.email } });

    if(!user || !user.sub) return { message: 'Usuário não encontrado' };

    const validatedSub = await bcrypt.compare(userInfo.sub, user.sub as string);

    if(!validatedSub) return { message: 'Usuário inválido' };

    return { message: '', user };
}

export default userLogin;