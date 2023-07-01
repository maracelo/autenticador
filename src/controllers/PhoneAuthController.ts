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
import getExpiresDate from '../helpers/getExpiresDate';

type statusType = undefined | 'approved' | 'pending' | 'invalid';

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
        });

        return res.redirect('/sendotp');
    } 
    
    res.render('phone_auth/phone_register', { title, pagecss });
}

// TODO refatorar

export async function sendOTP(req: Request, res: Response){
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

    const send = async (phone: string, phoneAuth: any) =>{
        const response = await OTP.send(phone);
    
        if(!response) return message = 'Erro no Sistema! Tente novamente mais tarde';

        else phoneAuth.update({ otp_id: response.otp_id, status: 'pending', expires: getExpiresDate() });
    };

    if(!phoneAuth) return res.redirect('/config');

    else{
        if(!phoneAuth.expires){
            await send(phone, phoneAuth);
        }else{
            if(isPhoneAuthExpired(phoneAuth.expires)){
                await phoneAuth.destroy();
                const newPhoneAuth = await PhoneAuth.create({ user_id: user.id });
                await send(phone, newPhoneAuth);
            } 

            else message = 'Próximo código só em 10min. Tente reenviar'; 
        }
    }

    res.render('phone_auth/phone_auth', {
        title: 'Verificação',
        pagecss: 'phone_auth.css',
        otp_id,
        message
    });
}
function isPhoneAuthExpired(expires: string){ return new Date() > new Date(expires); }

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
            phoneAuth.update({ auth: true, status: 'approved', otp_id: null });
            req.session.token = await generateToken({
                name: user.name,
                email: user.email,
                phone: user.phone ?? null,
                verified_email: true,
                phone_auth: 'approved'
            });
            
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
    
    let defaultErrMessage = 'Erro no Sistema! tente novamente mais tarde';

    const json = (message: string) => res.json({ message }).redirect('/sendotp');;
    
    if(!req.body.otp_id) return json( 'otp_id não enviado' );

    const phoneAuth = await PhoneAuth.findOne({ where: {otp_id: req.body.otp_id} });                                   

    if(!phoneAuth) return json( defaultErrMessage );

    const response = await OTP.resend(req.body.otp_id);

    if(!response) return json( defaultErrMessage );

    let message;
    let new_otp_id: undefined | string;

    switch(response.message){
        case 'error': 
            message = defaultErrMessage;
        break;
        case 'frequent':
            message = 'Próximo reenvio só em 1min';
        break;
        default:
    }
        
    if(response.otp_id){
        new_otp_id = response.otp_id;
        await phoneAuth.update({ otp_id: new_otp_id });
    } 

    res.json({ new_otp_id, message }).redirect('/sendotp');
}