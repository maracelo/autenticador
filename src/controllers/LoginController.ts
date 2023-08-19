import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { User } from '../models/User'; 
import { PhoneAuth } from '../models/PhoneAuth';
import userRegister from '../helpers/login/userRegister';
import userLogin from '../helpers/login/userLogin';
import checkPhoneAuthStatus from '../helpers/phone/checkPhoneAuthStatus';
import { sendEmailVerification } from '../helpers/email/sendEmailVerification';
import OTP from '../helpers/phone/OTP';

dotenv.config();

export async function login(req: Request, res: Response){

    if(!req.body) return res.status(400).json({ errMessage: 'Informações não enviadas' });
    
    const response = await userLogin(req.body);

    if(response.message) return res.status(400).json({ errMessage: response.message });
    
    if(response.user){
        const { user } = response;

        req.session.userId = user.id.toString();

        await sendEmailVerification(user);

        const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });

        if(phoneAuth && phoneAuth.status === 'approved'){
            await phoneAuth.update({ status: 'pending_send' });
            await OTP.send(user.phone as string);
        }

        return res.status(201).json({
            success: 'Usuário Lougado',
            email_status: 'pending',
            phone_auth_status: response.phone_auth_status
        });
    }

    return res.status(500).json({ errMessage: 'Erro no Sistema' });
}

export async function demo(req: Request, res: Response){

    const user = await User.findOne({ where: {email: 'test@test.test'} });

    if(!user) return res.status(500).json({ errMessage: 'Erro no Sistema' });
    
    await user.update({ verified_email: false });

    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });

    if(phoneAuth && phoneAuth.status === 'approved'){
        await phoneAuth.update({ status: 'pending_send' });
        await OTP.send(user.phone as string);
    }

    req.session.userId = user.id.toString();

    res.json({ success: 'Usuário Lougado', email_status: 'pending', phone_auth_status: checkPhoneAuthStatus(user) });
}

export async function register(req: Request, res: Response){

    if(!req.body) return res.status(400).json({ errMessage: 'Informações não enviadas' });
    
    const response = await userRegister(req.body);

    if(response.messages && response.messages[0]){
        return res.status(400).json({ errMessage: response.messages });
    }
    
    if(response.user){
        const { user } = response;
        req.session.userId = response.user.id.toString();

        sendEmailVerification(user);

        if(await checkPhoneAuthStatus(user) === 'pending') await OTP.send(user.phone as string);

        return res.status(201).json({ success: 'Usuário Criado' });
    }

    return res.status(500).json({ errMessage: 'Erro no Sistema' });
};

export async function logout(req: Request, res: Response){
    const errMessage = 'Faça seu login em /login';

    if(!req.session) return res.json({ errMessage });

    const id = await req.session.userId;

    if(!id) return res.json({ errMessage });

    const user = await User.findOne({ where: {id} });

    if(user){
        
        if(user.verified_email) await user.update({ verified_email: false });
        
        if(await checkPhoneAuthStatus(user) === 'approved'){
            
            const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });
            
            phoneAuth?.update({ otp_id: null, status: 'pending_send' });
        }
    } 
    
    req.session.destroy( (err) =>{ if(err) console.log(err) } );
    res.json({ success: 'Logout Concluído' });
};