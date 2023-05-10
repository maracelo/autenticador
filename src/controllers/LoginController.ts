import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../middleware/auth';
import dotenv from 'dotenv';
import Cookies from 'js-cookie';
import bcrypt from 'bcrypt';

dotenv.config();

declare module 'express-session' {
    interface SessionData {
        token: any;
    }
}

export async function login(req: Request, res: Response){
    if(req.session.token){
        res.redirect('/');
    }
    
    let message: string|false = false;

    if(req.body.email !== undefined && req.body.password !== undefined){
        const {email, password} = req.body;

        const user = await User.findOne({where: { email }});

        if(user){

            const validPassword = await bcrypt.compare(password, user.password);

            if(validPassword){
                const token = generateToken({ id: user.id });
                user.token = token;
                user.save();
                req.session.token = token;

                res.redirect('/');
                return;
            }
            message = 'E-mail e/ou senha inválidos';
        }
        message = 'E-mail e/ou senha inválidos'
    }

    res.render('login/login', {
        title: 'Login',
        pagecss: 'login.css',
        message
    });
}

export async function register(req: Request, res: Response){
    let message: false|string = false;
    
    if(req.body.email && req.body.password){
        const {email, password} = req.body;

        const hasUser = await User.findAll({where: { email }});

        if(!hasUser){
            const newUser = await User.create({ email, password: bcrypt.hash(password, 8) });
            const token = generateToken({ id: newUser.id });

            Cookies.set('token', token);
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
    req.session.destroy(function(err){});
    res.redirect('/login');
};