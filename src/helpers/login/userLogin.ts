import UserInfo from "../../types/UserInfo";
import DefaultReturn from "../../types/DefaultReturn";
import validatePassword from "./validatePassword";
import { User } from "../../models/User";
import bcrypt from 'bcryptjs';
import validator from "validator";

async function userLogin(userInfo: UserInfo): Promise<DefaultReturn>{
    let response;

    if(!userInfo) return { message: 'Erro no Sistema' };
    
    if(userInfo.password) response = await defaultUserInfoValidation(userInfo);
    
    if(userInfo.sub) response = await SSOUserInfoValidation(userInfo);

    if(response){
        if(response.message) return { message: response.message };

        if(response.user){
            const { user } = response;
            
            return { message: '',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    verified_email: user.verified_email,
                    phone: user.phone ?? undefined
                }
            };
        }        
    }

    return { message: '' };
}

async function defaultUserInfoValidation(userInfo: UserInfo): Promise<DefaultReturn>{
    const message = 'E-mail e/ou senha inválidos';

    if( !userInfo || !userInfo.email || !userInfo.password) return { message: '' };
    
    if(!validator.isEmail(userInfo.email) || !validatePassword(userInfo.password)){
        return { message }
    }

    const user = await User.findOne({where: { email: userInfo.email }});
    
    if(!user) return { message };
    
    const validPassword = await bcrypt.compareSync(userInfo.password, user.password);

    if(!validPassword) return {message};

    return { message: '',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            verified_email: user.verified_email,
            phone: user.phone ?? undefined
        }
    };
}

async function SSOUserInfoValidation(userInfo: UserInfo): Promise<DefaultReturn>{
    if(!userInfo || !userInfo.email || !userInfo.sub){
        return { message: 'Esse tipo de Login está indisponível no momento, tente mais tarde' };
    }

    const user = await User.findOne({ where: { email: userInfo.email } });

    if(!user || !user.sub) return { message: 'Usuário não encontrado' };

    const validatedSub = await bcrypt.compareSync(userInfo.sub, user.sub);

    if(!validatedSub) return { message: 'Usuário inválido' };

    return { message: '',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            verified_email: user.verified_email,
            phone: user.phone ?? undefined
        }
    };
}

export default userLogin;