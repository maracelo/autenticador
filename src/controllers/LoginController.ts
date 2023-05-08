import { Request, Response } from "express";
import { User } from '../models/User';
import { generateToken } from "../config/passport";

export async function login(req: Request, res: Response){

    if(req.body.email && req.body.password){
        const {email, password} = req.body;

        const user = await User.findOne({where: { email, password }});

        if(user) return res.redirect('/');
    }

    return res.render('login/login', {
        title: 'Login',
        pagecss: 'login.css',
    });
}

export async function register(req: Request, res: Response){
    let message: string|false = false;
    
    if(req.body.email && req.body.password){
        const {email, password} = req.body;

        const hasUser = await User.findAll({where: { email }});

        if(!hasUser){
            const newUser = await User.create({ email, password });
            const token = generateToken({ id: newUser.id });

            //criar cookie do token;
            return res.status(201).redirect('/');
        }

        message = 'E-mail já existe.';
    }

    res.render('login/register', {
        title: 'Cadastro',
        pagecss: 'login.css',
        message
    });
};

export function logout(req: Request, res: Response){
    res.send('logout');
};