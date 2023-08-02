import { Request, Response } from "express";
import jwtDecode from "jwt-decode";
import JWTUserData from "../types/JWTUserData";
import { User, UserInstance } from "../models/User";
import { ChangeEmail } from "../models/ChangeEmail";
import { sendEmail, sendEmailChangeVerification } from "../helpers/email/sendEmailVerification";
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

export async function authConfirm(req: Request, res: Response){
    const redirect = () => res.redirect('/verifyemail');
    
    const confirmationToken = req.query.confirm;

    if(!confirmationToken || typeof(confirmationToken) !== 'string') return redirect();

    if(!verifyToken(confirmationToken)) return redirect();

    const content: any = await jwtDecode(confirmationToken);

    if(!content || !content.id || !content.confirm) return redirect();
    
    const user = await User.findOne({ where: {id: content.id} });
    
    if(!user) return redirect();

    const jwtAuth: JWTUserData = await jwtDecode(req.session.token);
    
    if(content.id !== jwtAuth.id) return redirect();

    await user.update({ verified_email: true });

    redirect()
}

export async function changeConfirm(req: Request, res: Response){
    const redirect = () => res.redirect('/login');

    let confirmationToken = req.query.confirm ?? null;

    if(!confirmationToken) confirmationToken = req.query.confirm ?? null;

    if(!confirmationToken || typeof(confirmationToken) !== 'string') return redirect();

    if(!verifyToken(confirmationToken)) return redirect();

    const content: any = await jwtDecode(confirmationToken);

    if(!content || !content.id || (!content.changeConfirm && !content.changeRefuse)) return redirect();

    const user = await User.findOne({ where: {id: content.id} });

    if(!user) return redirect();

    const changeEmail = await ChangeEmail.findOne({ where: {user_id: user.id} });

    if(!changeEmail) return redirect();

    if( (new Date()) > (new Date(content.expires)) ){
        await sendEmailChangeVerification(user);
        return redirect();
    }

    if(content.changeConfirm){    
        await user.update({ email: changeEmail.new_email, verified_email: false });
        await sendEmail(
            changeEmail.new_email, 
            'Agora seu E-mail é esse aqui!', 
            null, 
            'Faça o Login Para entrar na sua conta Usando o novo E-mail'
        );    
    }

    changeEmail.destroy();
    
    redirect()
}

function verifyToken(token: string){
    try{
        return jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    }catch(err){
        console.log(err);
        return false;
    }
}