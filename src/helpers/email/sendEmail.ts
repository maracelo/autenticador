import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { ModelStatic } from 'sequelize';
import { UserInstance } from '../../models/User';
import { ChangeEmailInstance } from '../../models/ChangeEmail';
import generateToken from '../generateToken';
import { buildVerificationHtml, buildChangeVerificationHtml } from './buildEmailHtml';

dotenv.config();

export async function sendEmailVerification(user: UserInstance){

    const token = await generateToken({ id: user.id, confirm: true }, 600000);

    const html = buildVerificationHtml(token);

    return await sendEmail(user.email, 'Verificação de E-mail', html);
}

export async function sendEmailChangeVerification(user: UserInstance, ChangeEmail: ModelStatic<ChangeEmailInstance>){

    const changeEmail = await ChangeEmail.findOne({ where: {user_id: user.id} });

    if(!changeEmail) return 'Troca de E-mail não foi solicitada';

    const confirmToken = await generateToken({ id: user.id, changeConfirm: true }, 600000);
    const refuseToken = await generateToken({ id: user.id, changeRefuse: true }, 600000);
    const html = buildChangeVerificationHtml(confirmToken, refuseToken);

    return await sendEmail(user.email, 'Verificação de Mudança de E-mail', html);
};

export async function sendNewEmailNotification(user: UserInstance, new_email: string){

    const token = await generateToken({ id: user.id, confirm: true }, 600000);

    const html = buildVerificationHtml(token);

    await sendEmail(new_email, 'Agora seu E-mail é esse aqui!', html);
}

export async function sendEmail(userEmail: string, subject: string, html: string|null, text?: string){
    const transport = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST as string,
        port: process.env.NODEMAILER_PORT as any,
        auth: { user: process.env.NODEMAILER_USER as string, pass: process.env.NODEMAILER_PASS as string }
    });

    try{
        transport.sendMail({
            from: process.env.NODEMAILER_USER,
            to: userEmail,
            subject: subject,
            html: html ?? undefined,
            text: text ?? undefined
        });
    }catch(err){
        console.log(err);
        return 'Error ao tentar enviar';
    }
}