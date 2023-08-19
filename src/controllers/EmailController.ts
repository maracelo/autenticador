import { Request, Response } from "express";
import { User, UserInstance } from "../models/User";
import { ChangeEmail, ChangeEmailInstance } from "../models/ChangeEmail";
import * as sendEmails from "../helpers/email/sendEmailVerification";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function demo(req: Request, res: Response){
    const user = res.locals.user as UserInstance;

    await user.update({ verified_email: true });

    res.json({ success: 'E-mail verificado' });
}

export async function authConfirm(req: Request, res: Response){

    const { errMessage, content, user } = await confirmDefaultValidation(req.query.confirm);

    if( errMessage ) return res.json({ errMessage });

    if( (Date.now() / 1000 ) > content.exp ){
        await sendEmails.sendEmailVerification(user as UserInstance);
        return res.json({ errMessage: 'Token expirado! E-mail reenviado' });
    }

    if( content && !content.confirm ) return res.json({ errMessage: 'Token inválido' });

    await User.update({verified_email: true}, { where: {id: content.id} });

    res.json({ success: 'E-mail confirmado' });
}

export async function changeConfirm(req: Request, res: Response){

    const { errMessage, content, user } = await confirmDefaultValidation(req.query.confirm);

    if(errMessage) return res.json({ errMessage });

    const { changeErrMessage, changeEmail } = await changeDefaultValidation(content, user as UserInstance);

    if(changeErrMessage) return res.json({ errMessage: changeErrMessage });

    await user?.update({ email: changeEmail?.new_email, verified_email: false });

    await sendEmails.sendNewEmailNotification(changeEmail?.new_email as string);

    changeEmail?.destroy();

    req.session.destroy( (err) =>{ console.log(err) } );

    res.json({ success: 'E-mail mudado com sucesso' });
}

export async function changeRefuse(req: Request, res: Response){

    const { errMessage, content, user } = await confirmDefaultValidation(req.query.refuse);

    if(errMessage) return res.json({ errMessage });

    const { changeErrMessage, changeEmail } = await changeDefaultValidation(content, user as UserInstance);

    if(changeErrMessage) return res.json({ errMessage: changeErrMessage });

    changeEmail?.destroy();

    res.json({ success: 'Processo recusado' });
}

type confirmValidation = Promise<{ errMessage?: string, content?: any, user?: UserInstance }>;

async function confirmDefaultValidation(confirmToken: any): confirmValidation{
    const content: any = await decodeToken(confirmToken);
    const errMessage: string = 'Token inválido';

    if(!content) return { errMessage };

    const user = await User.findOne({ where: {id: content.id} });

    if(!user) return { errMessage };

    return { content, user };
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

async function decodeToken(token: any){
    if(!token || typeof(token) !== 'string') return false; 

    try{
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        
        if(!decoded.iat || !decoded.exp || !decoded.id) return false;
        
        return decoded;
    }catch(err){
        console.log(err);
        return false;
    }
}