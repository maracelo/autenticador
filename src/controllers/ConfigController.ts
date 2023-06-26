import { Request, Response } from "express";
import jwtDecode from "jwt-decode";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import JWTUserDataType from "../types/JWTUserDataType";
import { User } from "../models/User";
import { PhoneAuth } from "../models/PhoneAuth";
import generateToken from "../helpers/generateToken";
import checkHasPhoneAuth from "../helpers/checkHasPhoneAuth";

dotenv.config();

export async function config(req: Request, res: Response){
    const user: JWTUserDataType = await jwtDecode(req.session.token);

    const userDb = await User.findOne({ where: {email: user.email} });
    
    if(!userDb) return res.redirect('/logout');

    if(req.body && Object.keys(req.body).length > 0){
    
        const response = await changeConfig(userDb, req.body);

        if(!response) return res.redirect('/logout');

        if(response.newToken) req.session.token = response.newToken;

        if(response.redirect) return res.redirect('/addphone');
    }

    res.render('config', {
        title: 'Configurações',
        pagecss: 'config.css',
        user,
        noPassword: userDb.password ? true : false,
        checked: await checkHasPhoneAuth(userDb.id, userDb.phone) 
    });
}

type configType = {
    name?: string;
    email?: string;
    new_password?: string;
    current_password?: string;
    phone_auth_toggle?: string;
}

async function changeConfig(user: any, newInfo: configType){
    let newToken;
    let redirect: boolean = false;

    let {name, /* email, */ new_password, current_password, phone_auth_toggle} = newInfo;
    
    if(name && name !== user.name) user.name = name;

    // TODO will be add in future
    // if(email) 'change a verification to email to confirm';

    if( 
        new_password 
        && (
            ( current_password && await bcrypt.compare(current_password, user.password) ) 
            || ( user.sub && !user.password && !current_password) 
        )
    ){
        const encryptedPassword = await bcrypt.hash(new_password, 8);

        await user.update({ password: encryptedPassword });
    }

    const hasPhoneAuth = await checkHasPhoneAuth(user.id, user.phone);

    let tokenContent: JWTUserDataType = {
        name: user.name,
        email: user.email,
        phone: user.phone ?? null,
        verified_email: true,
        phone_auth: user.phone ? 'pending' : 'pending_phone'
    };

    if(phone_auth_toggle && !hasPhoneAuth){

        await PhoneAuth.create({ user_id: user.id });
        
        newToken = await generateToken(tokenContent, 'changeConfig1(ConfigController)');

        redirect = true;
    } 

    else if(!phone_auth_toggle && hasPhoneAuth){
        const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });

        await phoneAuth?.destroy();

        tokenContent.phone_auth = null;

        newToken = await generateToken(tokenContent, 'changeConfig2(ConfigController)');
    } 

    return { newToken, redirect };
}