import { Request, Response } from 'express';
import jwtDecode from 'jwt-decode';
import validator from 'validator';
import JWTUserData from '../types/JWTUserData';
import { User } from '../models/User';
import { PhoneAuth } from '../models/PhoneAuth';
import phoneNumberValidation from '../helpers/phoneNumberValidation';
import OTP from '../helpers/OTP';
import getExpiresDate from '../helpers/getExpiresDate';

export async function add(req: Request, res: Response){

    const json: JWTUserData = await jwtDecode(req.session.token);

    const user = await User.findOne({ where: {id: json.id} });

    if(!user) return res.redirect('/logout');

    if(user.phone) return res.redirect('/sendotp'); 

    const render = (message?: string) =>{
        return res.render('phone_auth/phone_register', {
            title: 'Registrar Celular', 
            pagecss: 'phone_auth.css', 
            message
        });
    }
    
    const phone = req.body.phone ?? '';

    if(!phone || !phoneNumberValidation(phone)) return render();
    
    const exists = await User.findOne({ where: {phone} });

    if(exists) return render('Número de Celular já em uso');

    if(!user.phone){
        await user.update({ phone });

        return res.redirect('/sendotp');
    } 
    
    render();
}

export async function sendOTP(req: Request, res: Response){
    let otp_id: undefined | string;
    let message: undefined | string;

    const redirect = () => res.redirect('/addphone');
    
    const json: JWTUserData = jwtDecode(req.session.token);

    const user = await User.findOne({ where: {id: json.id} });

    if(!user) return redirect;

    if(!user.phone) return redirect;

    const phone = phoneNumberValidation(user.phone);

    if(!phone) return redirect;

    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });

    if(!phoneAuth) return res.redirect('/config');

    if(!phoneAuth.expires || !phoneAuth.otp_id){

        let response = await send(phone, phoneAuth, user);
        otp_id = response.otp_id ?? undefined;
        message = response.message ?? undefined;
        
    }else{
        if( (new Date()) > (new Date(phoneAuth.expires)) ){

            phoneAuth.update({ otp_id: null, status: null, expires: null });

            let response = await send(phone, phoneAuth, user);
            otp_id = response.otp_id ?? undefined;
            message = response.message ?? undefined;

        }else{
            otp_id = phoneAuth.otp_id;
            message = 'Próximo código só em 10min. Tente reenviar'; 
        } 
    }

    res.render('phone_auth/phone_auth', {
        title: 'Verificação',
        pagecss: 'phone_auth.css',
        otp_id,
        message
    });
}

async function send(phone: string, phoneAuth: any, user: any): Promise<{message: string, otp_id: string}>{
    const response = await OTP.send(phone);
    let message: string = '';
    let otp_id: string = '';

    if(!response) message = 'Erro no Sistema! Tente novamente mais tarde';

    else{
        phoneAuth.update({ otp_id: response.otp_id, status: 'pending', expires: getExpiresDate() });
        
        otp_id = phoneAuth.otp_id;

        message = 'Código enviado';
    } 

    return {message, otp_id};
}

export async function verifyOTP(req: Request, res: Response){
    const { code } = req.body ?? null;
    let message: undefined | string;
    let status: undefined | 'approved' | 'pending' | 'invalid';
    
    const json: JWTUserData = await jwtDecode(req.session.token);
    
    const user = await User.findOne({ where: {id: json.id} });
    
    if(!user) return res.redirect('/logout');

    if(!user.phone) return res.redirect('/addphone');
    
    const sanitizedCode = sanitizeVerificationOTP(code);

    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });
    
    if(!phoneAuth) return res.redirect('/config');
    
    if(!phoneAuth.otp_id || !sanitizedCode) return res.redirect('/addphone');
    
    status = await OTP.verify(sanitizedCode, phoneAuth.otp_id);
    
    switch(status){
        case 'approved':
            phoneAuth.update({ status: 'approved', otp_id: null, expires: null });

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

    const json = (message: string) => res.json({ message });

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

    res.json({ new_otp_id, message });
}