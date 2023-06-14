import { Request, Response } from 'express';
import jwt_decode from 'jwt-decode';
import validator from 'validator';
import DecodedType from '../types/decodedType';
import { User } from '../models/User';
import { PhoneAuth } from '../models/PhoneAuth';
import phoneNumberValidation from '../helpers/phoneNumberValidation';
import OTP from '../helpers/OTP';

type statusType = undefined | 'approved' | 'pending' | 'invalid';

//Problema em que otp não tá sendo retornado de OTP
export async function page(req: Request, res: Response){
    let status: statusType;
    let otp_id: undefined | string;
    let message: undefined | string;

    const decoded: DecodedType = jwt_decode(req.session.token);

    if(!decoded || !decoded.phone) return res.redirect('/logout');

    const phone = phoneNumberValidation(decoded.phone);

    if(!phone) return res.redirect('/logout');

    const user = await User.findOne({ where: {phone: decoded.phone} });

    if(!user || !user.id) return res.redirect('/logout');

    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });

    if(!phoneAuth) return res.redirect('/logout');
    
    if(phoneAuth.status == false){
        const response = await OTP.send(phone);
        
        status = response.status;
        otp_id = response.otp_id;

        phoneAuth.update({ otp_id, status: true });
        setTimeout(() => { phoneAuth.update({ otp_id: null, status: false }) }, 600000);    
        
        if(!status || !otp_id) message = 'Erro no Sistema! Tente novamente mais tarde (send)';
    }else{
        message = 'Próximo SMS só em 10min'
    }

    res.render('phone_auth', {
        title: 'Verificação',
        pagecss: 'phone_auth.css',
        otp_id,
        message
    });
}

export async function verify(req: Request, res: Response){
    let status: statusType;
    let message: undefined | string;
    const { code } = req.body ?? null;
    
    const decoded: DecodedType = await jwt_decode(req.session.token);
    
    if(!decoded || !decoded.phone) return res.redirect('/logout');

    const user = await User.findOne({ where: {phone: decoded.phone} });

    if(!user) return res.redirect('/phoneauth');
    
    const sanitizedCode = sanitizeVerificationOTP(code);

    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });
    
    if(!phoneAuth) return res.redirect('/phoneauth');
    
    if(!phoneAuth.otp_id || !sanitizedCode) return res.redirect('/phoneauth');
    
    status = await OTP.verify(sanitizedCode, phoneAuth.otp_id);
    
    switch(status){
        case 'approved':
            phoneAuth.update({ auth: true, status: false, otp_id: null });
            return res.redirect('/');
        break;
        case 'invalid':
            message = 'Código inválido';
        break;
        default:
            message = 'Error no Sistema! Tente novamente mais tarde (verify)'
        break;
    }
        
    res.render('phone_auth', {
        title: 'Verificação',
        pagecss: 'phone_auth.css',
        message
    });
}

function sanitizeVerificationOTP(code?: string){
    if(!code) return false;

    const sanitizedCode = validator.whitelist(code, '1234567890');

    if(sanitizedCode.length !== 6) return false;

    return sanitizedCode;
}

export async function resend(req: Request, res: Response){
    //TODO
}