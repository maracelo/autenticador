import { Request, Response } from "express";
import { User } from '../models/User';
import dotenv from 'dotenv';
import jwt_decode from 'jwt-decode';

dotenv.config();

export async function home(req: Request, res: Response){
    if(req.session.token){
        const token = req.session.token;

        const decoded: null | { name: string; email: string } = await jwt_decode(token);

        if(decoded){
            
            const user = await User.findOne({where: { email: decoded.email } });
            
            if(user){
                return res.render('home', {
                    title: 'Home',
                    pagecss: 'home.css',
                    user: user,
                });
            }
        }
    }
    
    res.status(401).redirect('/login');
}