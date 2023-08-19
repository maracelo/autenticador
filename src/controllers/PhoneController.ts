import { Request, Response } from 'express';
import { UserInstance } from '../models/User';
import { PhoneAuthInstance } from '../models/PhoneAuth';
import OTP from '../helpers/phone/OTP';
import sanitizeCode from '../helpers/phone/sanitizeCode';

export async function sendOTP(req: Request, res: Response){
    const user = res.locals.user as UserInstance;
    const phoneAuth = res.locals.phoneAuth as PhoneAuthInstance;

    if(phoneAuth.exp && phoneAuth.otp_id){

        if( Math.round(Date.now() / 1000) < phoneAuth.exp ){
            return res.json({
                message: 'Próximo código só em 10min. Você pode Reenviar o mesmo Código em /resend',
                otp_id: phoneAuth.otp_id
            });
        }
    
        await phoneAuth.update({ otp_id: null, status: 'pending', exp: null });
    }

    const response = await OTP.send(user.phone as string);

    if(!response || !response.otp_id || response.status === 'error')
        return res.json({ message: 'Erro no Sistema! Tente novamente mais tarde' });

    await phoneAuth.update({
        otp_id: response.otp_id,
        status: 'pending', 
        exp: Math.round((Date.now() + 600000) / 1000)
    });

    res.json({ message: 'Código enviado', otp_id: phoneAuth.otp_id });
}

export async function verifyOTP(req: Request, res: Response){
    const { code } = req.body ?? null;
    const phoneAuth: PhoneAuthInstance = res.locals.phoneAuth;
        
    const sanitizedCode = sanitizeCode(code);

    if(!sanitizedCode) return res.json({ errMessage: 'Código inválido'});

    if(!phoneAuth.otp_id || !phoneAuth.exp)
        return res.json({ errMessage: 'SMS não enviado! Mande o Código para /sendotp' });
    
    if((new Date()) > (new Date(phoneAuth.exp)) )
        return res.json({ errMessage: 'SMS expirado! Envie um novo Código em /sendotp' });
    
    const response = await OTP.verify(sanitizedCode, phoneAuth.otp_id);
    
    switch(response.status){
        case 'approved':
            phoneAuth.update({ status: 'approved', otp_id: null, exp: null });
            res.json({ success: 'Verificação por SMS concluída' })
        break;
        case 'invalid':
            res.json({ errMessage: 'Código inválido' });
        break;
        default:
            res.json({ errMessage: 'Error no Sistema! Tente novamente mais tarde' });
        break;
    }
}

export async function resendOTP(req: Request, res: Response){
    const phoneAuth: PhoneAuthInstance = res.locals.phoneAuth;
    const otp_id = req.body.otp_id ?? null;
    
    if(!otp_id || phoneAuth.otp_id !== otp_id ) return res.status(400).json({ message: 'otp_id inválido' });
    
    let message = 'Código reenviado';
    
    const response = await OTP.resend(otp_id);

    switch(response.status){
        case 'error': 
            return res.status(500).json({ message: 'Erro no Sistema! Tente novamente mais tarde' });
        break;
        case 'frequent':
            message = 'Próximo reenvio só em 1min';
        break;
        case 'expired':
            message = 'SMS expirado! Mande um novo Código em /sendotp';
        break;
    }

    res.json({ message });
}