import { Request, Response } from 'express';
import jwtDecode from 'jwt-decode';
import validator from 'validator';
import JWTUserDataType from '../types/JWTUserDataType';
import { User } from '../models/User';
import { PhoneAuth } from '../models/PhoneAuth';
import phoneNumberValidation from '../helpers/phoneNumberValidation';
import OTP from '../helpers/OTP';
import generateToken from '../helpers/generateToken';
import checkHasPhoneAuth from '../helpers/checkHasPhoneAuth';

type statusType = undefined | 'approved' | 'pending' | 'invalid';

// TODO desfazer depois de terminar os teste de mock do otp generateToken(data, functionLocation) 
// Problema em que otp não tá sendo retornado de OTP

export async function add(req: Request, res: Response){
    const decoded: JWTUserDataType = await jwtDecode(req.session.token);

    if(decoded.phone) return res.redirect('/sendotp'); 

    const title = 'Registrar Celular';
    const pagecss = 'phone_auth.css';

    const phone = phoneNumberValidation(req.body?.phone ?? '');

    if(!phone) return res.render('phone_auth/phone_register', { title, pagecss });
    
    const user = await User.findOne({ where: {email: decoded.email} });
    
    if(user && !user.phone){
        await user.update({ phone });
        
        req.session.token = await generateToken({
            name: user.name,
            email: user.email,
            phone: user.phone,
            verified_email: true,
            phone_auth: await checkHasPhoneAuth(user.id, user.phone)
        }, 'add(PhoneController)');

        return res.redirect('/sendotp');
    } 
    
    res.render('phone_auth/phone_register', { title, pagecss });
}

export async function sendOTP(req: Request, res: Response){
    let status: statusType;
    let otp_id: undefined | string;
    let message: undefined | string;

    const redirect = () => res.redirect('/addphone');
    
    const decoded: JWTUserDataType = jwtDecode(req.session.token);

    if(!decoded.phone) return redirect;

    const phone = phoneNumberValidation(decoded.phone);

    if(!phone) return redirect;

    const user = await User.findOne({ where: {phone: decoded.phone} });

    if(!user) return redirect;

    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });

    if(!phoneAuth) PhoneAuth.create({ user_id: user.id });
    
    else{
        if(!phoneAuth.status){
            const response = await OTP.send(phone);
            
            status = response.status;
            otp_id = response.otp_id;

            if(!status || !otp_id) message = 'Erro no Sistema! Tente novamente mais tarde (send temp)';
            
            phoneAuth.update({ otp_id, status: true });
            setTimeout(() => { phoneAuth.update({ otp_id: null, status: false }) }, 600000);  
        }else{
            message = 'Próximo SMS só em 10min';
        }
    }

    res.render('phone_auth/phone_auth', {
        title: 'Verificação',
        pagecss: 'phone_auth.css',
        otp_id,
        message
    });
}

export async function verifyOTP(req: Request, res: Response){
    let status: statusType;
    let message: undefined | string;
    const { code } = req.body ?? null;
    
    const decoded: JWTUserDataType = await jwtDecode(req.session.token);
    
    if(!decoded || !decoded.phone) return res.redirect('/logout');

    const user = await User.findOne({ where: {phone: decoded.phone} });

    if(!user) return res.redirect('/addphone');
    
    const sanitizedCode = sanitizeVerificationOTP(code);

    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });
    
    if(!phoneAuth) return res.redirect('/addphone');
    
    if(!phoneAuth.otp_id || !sanitizedCode) return res.redirect('/addphone');
    
    status = await OTP.verify(sanitizedCode, phoneAuth.otp_id);

    
    switch(status){
        case 'approved':
            phoneAuth.update({ auth: true, status: false, otp_id: null });
            req.session.token = await generateToken({
                name: user.name,
                email: user.email,
                phone: user.phone ?? null,
                verified_email: true,
                phone_auth: 'approved'
            }, '');
            
            return res.redirect('/');
        break;
        case 'invalid':
            message = 'Código inválido';
        break;
        default:
            message = 'Error no Sistema! Tente novamente mais tarde (verify temp)';
        break;
    }
        
    res.render('phone_auth/phone_auth', {
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

export async function resendOTP(req: Request, res: Response){
    //TODO
}