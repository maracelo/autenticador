import bcrypt from "bcrypt";
import { UserInstance } from "../../models/User";
import validatePassword from "../login/validatePassword";

type ChangePasswordReturn = Promise<{message: string}|{errMessage: string}>;

async function changePassword(newPassword: string, user: UserInstance, currentPassword?: string): ChangePasswordReturn{
    
    if( await checkPasswords(newPassword, user, currentPassword) ){
        
        const encryptedPassword = await bcrypt.hash(newPassword, 8);

        await user.update({ password: encryptedPassword });
        
        return { message: 'Senha mudada' };
    }
    
    const errMessage = 'Senha ou senhas precisam ser preenchidas corretamente (com no mínimo 8 caracteres, letra maiúscula e minúcula, número e caractere especial)';

    return { errMessage };
}

async function checkPasswords(newPass: string, user: UserInstance, current?: string, ): Promise<boolean>{

    if( (newPass && validatePassword(newPass)) ){

        if( user.sub && !current && !user.password ) return true;
        
        else if(
            current && validatePassword(current) && current !== newPass && 
            await bcrypt.compare( current, user.password )
        ){
            return true;
        }
    }

    return false;
}

export default changePassword;