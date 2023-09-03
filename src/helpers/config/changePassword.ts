import bcrypt from "bcrypt";
import { UserInstance } from "../../models/User";

async function changePassword(new_password: string, user: UserInstance, current_password?: string){
    
    if( await checkPasswords(new_password, user, current_password) ){
        
        const encryptedPassword = await bcrypt.hash(new_password, 8);

        await user.update({ password: encryptedPassword });
        
        return { message: 'Senha Mudada' };
    }
    const errMessage = 'Senha ou senhas precisam ser preenchidas corretamente ' +
    '(com no mínimo 8 caracteres, letra maiúscula e minúcula, número e caractere especial)' ;

    return { errMessage };
}

async function checkPasswords(newPasswod: string, user: UserInstance, current?: string, ){
    if(
        ( user.sub && !user.password && !current)
        || ( current && current !== newPasswod  && await bcrypt.compare( current, user.password ))
    ) return true;

    return false;
}

export default changePassword