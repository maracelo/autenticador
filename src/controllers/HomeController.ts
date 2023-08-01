import { Request, Response } from "express";
import dotenv from 'dotenv';
import { User } from "../models/User";
import decodeJWT from "../helpers/decodeJWT";
import JWTUserData from "../types/JWTUserData";

dotenv.config();

export async function home(req: Request, res: Response){
    const json = await decodeJWT(req.session.token) as JWTUserData;
    
    const user = await User.findOne({ where: { id: json.id }});
    
    if(!user) return res.redirect('/logout');

    return res.render('home', {
        title: 'Home',
        pagecss: 'home.css',
        user: {name: user.name, email: user.email},
    });
}