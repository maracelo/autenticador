import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import validator from "validator";
import JWTUserData from "../types/JWTUserData";
import PhoneAuthStatus from "../types/PhoneAuthStatus";
import { User, UserInstance } from "../models/User";
import { PhoneAuth } from "../models/PhoneAuth";
import { ChangeEmail } from '../models/ChangeEmail';
import checkPhoneAuthStatus from "../helpers/phone/checkPhoneAuthStatus";
import decodeJWT from "../helpers/decodeJWT";
import validatePassword from "../helpers/login/validatePassword";
import { sendEmailChangeVerification } from "../helpers/email/sendEmailVerification";

dotenv.config();

export async function config(req: Request, res: Response){
    let message: string = '';
    const json = await decodeJWT(req.session.token) as JWTUserData;

    const userDb = await User.findOne({ where: { id: json.id } }) as UserInstance;
    
    if(req.body && Object.keys(req.body).length > 0){
    
        const response = await changeConfig(userDb, req.body);

        if(response?.redirect) return res.redirect(response.redirect);

        if(response?.message) message = response.message;
    }

    res.render('config', {
        title: 'Configurações',
        pagecss: 'config.css',
        user: { name: userDb.name, email: userDb.email },
        noPassword: userDb.password ? true : false,
        checked: await checkPhoneAuthStatus(userDb.id, userDb.phone),
        message: message ?? null
    });
}

export async function deleteUser(req: Request, res: Response){
    const password = await req.body.password

    if(!password && validatePassword(password)) return res.redirect('/config');
    
    const json = await decodeJWT(req.session.token) as JWTUserData;
    
    const user = await User.findOne({ where: { id: json.id } }) as UserInstance;
    
    const permission = await bcrypt.compare(password, user.password);

    if(!permission) return res.redirect('/config');

    await user.destroy();

    res.redirect('/logout');
}

type Config = {
    name?: string;
    email?: string;
    new_password?: string;
    current_password?: string;
    phone_auth_toggle?: string;
}

type ChangeConfigReturn = void | { redirect?: string, message?: string };

async function changeConfig(user: UserInstance, newInfo: Config): Promise<ChangeConfigReturn>{
    let {name, email, new_password, current_password, phone_auth_toggle} = newInfo;
    
    if(name && name !== user.name) user.name = name;

    if(email){
        const emailChanged = await changeEmail(email, user);
    
        if(emailChanged?.message) return { message: emailChanged.message };

        if(emailChanged?.redirect) return { redirect: emailChanged.redirect };
    }

    if(current_password && new_password){
        const passwordChanged = await changePassword(current_password, new_password, user);
    
        if(passwordChanged?.message) return { message: passwordChanged.message };
    }

    const hasPhoneAuth = await checkPhoneAuthStatus(user.id, user.phone);

    const phoneAuthToggle = await changePhoneAuth(phone_auth_toggle, hasPhoneAuth, user.id);

    if(phoneAuthToggle?.redirect) return { redirect: phoneAuthToggle.redirect };
}

async function changeEmail(email: string, user: UserInstance){

    if(!validator.isEmail(email)) return { message: 'E-mail inválido' };

    if(email === user.email) return;
    
    const emailExists = await User.findOne({ where: {email} });

    if(emailExists) return { message: 'E-mail já cadastrado' };

    await ChangeEmail.create({ user_id: user.id, new_email: email });

    const send = await sendEmailChangeVerification(user);

    if(send) return {messege: send};

    return { redirect: 'logout' };
}

async function changePassword(current_password: string, new_password: string, user: UserInstance){
    
    if( current_password && new_password && checkPasswords(current_password, user, new_password) ){
        const encryptedPassword = bcrypt.hashSync(new_password, 8);
        await user.update({ password: encryptedPassword });
        return;
    }

    return { message: 'Senhas precisam ser preenchidas' };
}

function checkPasswords(current: string, user: UserInstance, newPasswod: string){

    if(current != newPasswod) console.log('ok');

    if( (bcrypt.compareSync( current, user.password ) && current !== newPasswod) 
        || ( user.sub && !user.password && !current) ) return true;

    return false;
}

async function changePhoneAuth(phoneAuthToggle: undefined|string, hasPhoneAuth: PhoneAuthStatus, id: number){
    let redirect: string = '';

    if(phoneAuthToggle && !hasPhoneAuth){
        await PhoneAuth.create({ user_id: id });

        redirect = '/addphone';

    } else if(!phoneAuthToggle && hasPhoneAuth){

        const phoneAuth = await PhoneAuth.findOne({ where: {user_id: id} });

        await phoneAuth?.destroy();
    } 

    return { redirect };
}