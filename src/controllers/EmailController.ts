import { Request, Response } from "express";
import jwtDecode from "jwt-decode";
import JWTUserData from "../types/JWTUserData";
import { User, UserInstance } from "../models/User";
import sendEmailVerification from "../helpers/sendEmailVerification";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import decodeJWT from "../helpers/decodeJWT";

dotenv.config();

export async function page(req: Request, res: Response){
    const json = await decodeJWT(await req.session.token) as JWTUserData;

    const user = await User.findOne({ where: {id: json.id} }) as UserInstance;

    // const sendEmail = await sendEmailVerification(user) // temp

    res.render('verify_email', {
        title: 'Verificação',
        pagecss: 'verify_email.css',
        // message: sendEmail ?? null // temp
        message: null // temp
    });
}

export async function demo(req: Request, res: Response){
    const json = await decodeJWT(await req.session.token) as JWTUserData;

    const user = await User.findOne({ where: {id: json.id} }) as UserInstance;

    await user.update({ verified_email: true });

    res.redirect('/');
}

export async function confirm(req: Request, res: Response){
    const token = req.query.confirm;

    if(!token || typeof(token) !== 'string') return res.redirect('/verifyemail');

    if(!verifyToken(token)) return res.redirect('/verifyemail');
    
    const confirmInfo: {id: number, confirm: true} = await jwtDecode(token);
    
    const infoFromSession: JWTUserData = await jwtDecode(req.session.token);
    
    if(confirmInfo.id !== infoFromSession.id) return res.redirect('/verifyemail');

    const user = await User.findOne({ where: {id: confirmInfo.id} });

    if(!user) return res.redirect('/verifyemail');

    await user.update({ verified_email: true });

    res.redirect('/verifyemail');
}

async function verifyToken(token: string){
    try{
        jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        
        const confirmation: undefined | {id: number, confirm: true} = await jwtDecode(token);

        if(!confirmation) return false;

        const user = await User.findOne({ where: {id: confirmation.id} });

        if(!user) return false;

        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}