import { Request, Response } from 'express';
import validator from 'validator';
import { UserInstance } from '../models/User';
import { PhoneAuth, PhoneAuthInstance } from '../models/PhoneAuth';
import OTP from '../helpers/phone/OTP';
import getExpiresDate from '../helpers/phone/getExpiresDate';

export async function sendOTP(req: Request, res: Response){
    const user = res.locals.user as UserInstance;
    const phoneAuth = res.locals.phoneAuth as PhoneAuthInstance;

    if(phoneAuth.exp && phoneAuth.otp_id){
        
        if( (new Date()) < (new Date(phoneAuth.exp)) )
            return res.json({ message: 'Próximo código só em 10min. Tente reenviar', otp_id: phoneAuth.otp_id });
    
        await phoneAuth.update({ otp_id: null, status: null, exp: null });
    }

    const response = await OTP.send(user.phone as string);

    if(!response) return res.json({ message: 'Erro no Sistema! Tente novamente mais tarde' });

    await phoneAuth.update({ otp_id: response.otp_id, status: 'pending', exp: getExpiresDate() });

    res.json({ message: 'Código enviado', otp_id: phoneAuth.otp_id });
}

export async function verifyOTP(req: Request, res: Response){
    const { code } = req.body ?? null;
    const phoneAuth: PhoneAuthInstance = res.locals.phoneAuth;
        
    const sanitizedCode = code ? validator.whitelist(code, '1234567890') : '';

    if(!sanitizedCode || sanitizedCode.length !== 6) return res.json({ errMessage: 'Código inválido'});

    if(!phoneAuth.otp_id || !phoneAuth.exp)
        return res.json({ errMessage: 'SMS não enviado! Mande o Código para /sendotp' });
    
    if((new Date()) > (new Date(phoneAuth.exp)) )
        return res.json({ errMessage: 'SMS expirado! Envie um novo Código em /sendotp' });
    
    const status = await OTP.verify(sanitizedCode, phoneAuth.otp_id);
    
    switch(status){
        case 'approved':
            phoneAuth.update({ status: 'approved', otp_id: null, exp: null });
            res.json({ success: 'Verificação por SMS concluída' })
        break;
        case 'invalid':
            res.json({ errMessage: 'Código inválido' });
        break;
        default:
            res.json({ errMessage: 'Error no Sistema! Tente novamente mais tarde (verify temp)' });
        break;
    }
}

export async function resendOTP(req: Request, res: Response){
    const phoneAuth: PhoneAuthInstance = res.locals.phoneAuth;
    const otp_id = req.body.otp_id ?? null;
    
    if(!otp_id || phoneAuth.otp_id !== otp_id ) return res.status(400).json({ message: 'otp_id inválido' });
    
    let message = 'Código reenviado';
    
    const response = await OTP.resend(otp_id);

    switch(response.message){
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