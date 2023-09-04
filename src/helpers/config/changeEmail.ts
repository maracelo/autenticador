import validator from "validator";
import { User, UserInstance } from "../../models/User";
import { ChangeEmail } from "../../models/ChangeEmail";
import { sendEmailChangeVerification } from "../email/sendEmail";

async function changeEmail(email: string, user: UserInstance){

    if(!validator.isEmail(email)) return { errMessage: 'E-mail inválido' };

    if(email === user.email) return;
    
    const emailExists = await User.findOne({ where: {email} });

    if(emailExists) return { errMessage: 'E-mail já cadastrado' };

    await ChangeEmail.create({ user_id: user.id, new_email: email });

    const sendReturn = await sendEmailChangeVerification(user);

    if(sendReturn) return { errMessage: sendReturn };

    return { message: 'Mensagem enviada para seu E-mail Atual' };
}

export default changeEmail;