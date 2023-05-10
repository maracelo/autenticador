import { Request, Response } from "express";
import { User } from '../models/User';

export async function home(req: Request, res: Response){
    if(req.session.token){
        const token = req.session.token;

        const user = await User.findOne({where: { token} });

        if(user){
            return res.render('home', {
                title: 'Home',
                pagecss: 'home.css',
                user: user,
            });
        }
    }

    res.status(401).redirect('/login');
}