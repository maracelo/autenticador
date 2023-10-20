import validator from "validator";
import { ModelStatic } from "sequelize";
import { UserInstance } from "../../models/User";
import { ChangeEmailInstance } from "../../models/ChangeEmail";
import { sendEmailChangeVerification } from "../email/sendEmail";

async function changeEmail(email: string, user: UserInstance, User: ModelStatic<UserInstance>, ChangeEmail: ModelStatic<ChangeEmailInstance>){

    if(!validator.isEmail(email)) return { errMessage: 'E-mail inválido' };

    if(email === user.email) return;
    
    const emailExists = await User.findOne({ where: {email} });

    if(emailExists) return { errMessage: 'E-mail já cadastrado' };

    try{
        await ChangeEmail.create({ user_id: user.id, new_email: email });
    }catch(err){
        console.log(err);
        return { errMessage: 'Erro no sistema' };
    }

    const sendReturn = await sendEmailChangeVerification(user, ChangeEmail);

    if(sendReturn) return { errMessage: sendReturn };

    return { message: 'Mensagem enviada para seu E-mail Atual' };
}

export default changeEmail;