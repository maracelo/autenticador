import { Request, Response } from "express";
import dotenv from 'dotenv';
import { User, UserInstance } from "../models/User";
import { ChangeEmail, ChangeEmailInstance } from "../models/ChangeEmail";
import * as sendEmails from "../helpers/email/sendEmail";
import checkToken from "../helpers/email/checkToken";

dotenv.config();

export async function demo(req: Request, res: Response){
    const user = res.locals.user as UserInstance;

    await user.update({ verified_email: true });

    res.json({ success: 'E-mail verificado' });
}

export async function authConfirm(req: Request, res: Response){

    const { errMessage, content, user } = await checkToken(req.query.confirm);

    if( errMessage ) return res.json({ errMessage });

    if( (Date.now() / 1000 ) > content.exp ){
        await sendEmails.sendEmailVerification(user as UserInstance);
        return res.json({ errMessage: 'Token expirado! E-mail reenviado' });
    }

    if( (content && !content.confirm) || (user as UserInstance).verified_email === true )
        return res.json({ errMessage: 'Token inválido' });

    await User.update({verified_email: true}, { where: {id: content.id} });

    res.json({ success: 'E-mail confirmado' });
}

export async function changeConfirm(req: Request, res: Response){

    const { errMessage, content, user } = await checkToken(req.query.confirm);

    if(errMessage) return res.json({ errMessage });

    const { changeErrMessage, changeEmail } = await changeDefaultValidation(content, user as UserInstance);

    if(changeErrMessage) return res.json({ errMessage: changeErrMessage });

    await user?.update({ email: changeEmail?.new_email, verified_email: false });

    await sendEmails.sendNewEmailNotification(user as UserInstance, changeEmail?.new_email as string);

    changeEmail?.destroy();

    res.json({ success: 'E-mail mudado com sucesso' });
}

export async function changeRefuse(req: Request, res: Response){

    const { errMessage, content, user } = await checkToken(req.query.refuse);

    if(errMessage) return res.json({ errMessage });

    const { changeErrMessage, changeEmail } = await changeDefaultValidation(content, user as UserInstance);

    if(changeErrMessage) return res.json({ errMessage: changeErrMessage });

    changeEmail?.destroy();

    res.json({ success: 'Processo recusado' });
}

async function changeDefaultValidation(content: any, user: UserInstance){
    let changeErrMessage = 'Token inválido';

    if( (content.confirmToken && !content.changeConfirm) || (content.refuseToken && !content.changeRefuse) )
        return { changeErrMessage };

    if( (Date.now() / 1000) > content.exp ){
        await sendEmails.sendEmailChangeVerification(user);
        return { changeErrMessage: 'Token expirado! E-mail reenviado' };
    }

    const changeEmail = await ChangeEmail.findOne({ where: {user_id: user.id} });

    if(!changeEmail) return { changeErrMessage };

    return { changeEmail };
}