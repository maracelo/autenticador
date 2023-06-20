import { Request, Response } from "express";
import jwtDecode from "jwt-decode";
import TokenDataType from "../types/TokenDataType";
import { User } from "../models/User";
import sendEmailVerification from "../helpers/sendEmailVerification";
import generateToken from "../helpers/generateToken";
import verifyToken from "../helpers/verifyToken";

export async function page(req: Request, res: Response){
    const decoded: TokenDataType = await jwtDecode(req.session.token);

    const sendEmail = await sendEmailVerification(decoded)

    res.render('verify_email', {
        title: 'Verificação',
        pagecss: 'verify_email.css',
        message: sendEmail ?? null
    });
}

export async function confirm(req: Request, res: Response){
    const token: string = req.query.confirm as string | undefined  ?? '';

    if(!verifyToken(token)) return res.redirect('/verifyemail');

    const confirmInfo: {name: string, email: string} = jwtDecode(token);

    const infoFromSession: TokenDataType = jwtDecode(req.session.token);

    if(confirmInfo.email !==  infoFromSession.email) return res.redirect('/verifyemail');

    const user = await User.findOne({ where: {email: confirmInfo.email} });

    if(!user) return res.redirect('/verifyemail');

    await user.update({ verified_email: true });

    req.session.token = await generateToken({
        name: user.name,
        email:user.email,
        verified_email: true
    });

    res.redirect('/verifyemail');
}

export async function test(req: Request, res: Response){
    res.render('test');
}