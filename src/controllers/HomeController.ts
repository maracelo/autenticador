import { Request, Response } from "express";
import dotenv from 'dotenv';
import { User } from "../models/User";
import decodeJWT from "../helpers/decodeJWT";

dotenv.config();

export async function home(req: Request, res: Response){
    const json = await decodeJWT(req.session.token);

    if(!json) return res.redirect('/logout');
    
    const user = await User.findOne({ where: { id: json.id }});
    
    if(!user) return res.redirect('/logout');

    return res.render('home', {
        title: 'Home',
        pagecss: 'home.css',
        user: {name: user.name, email: user.email},
    });
}