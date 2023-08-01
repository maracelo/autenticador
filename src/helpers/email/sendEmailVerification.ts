import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { UserInstance } from '../../models/User';
import { ChangeEmail } from '../../models/ChangeEmail';
import generateToken from '../generateToken';
import { buildVerificationHtml, buildChangeVerificationHtml } from './buildEmailHtml';

dotenv.config();

export async function sendEmailVerification(user: UserInstance){

    const token = await generateToken({ id: user.id, confirm: true }, '600000');

    const html =  buildVerificationHtml(token);

    return await sendEmail(user.email, 'Verificação de E-mail', html);
}

export async function sendEmailChangeVerification(user: UserInstance){

    const changeEmail = await ChangeEmail.findOne({ where: {user_id: user.id} });

    if(!changeEmail) return 'Erro! Operação não inicializada';

    const confirmToken = await generateToken({ id: user.id, changeConfirm: true }, '600000');
    const refuseToken = await generateToken({ id: user.id, changeRefuse: true }, '600000');
    const html = buildChangeVerificationHtml(confirmToken, refuseToken);

    return await sendEmail(user.email, 'Verificação de Mudança de E-mail', html);
};

export async function sendEmail(userEmail: string, subject: string, html: string|null, text?: string){
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: { user: process.env.MAILTRAP_USER as string, pass: process.env.MAILTRAP_PASS }
    });

    try{
        transport.sendMail({
            from: 'noreply@test.com',
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