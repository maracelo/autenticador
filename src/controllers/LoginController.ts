import { Request, Response } from 'express';
import { generateToken } from '../middleware/auth';
import dotenv from 'dotenv';
import userRegister from '../helpers/userRegister';
import userLogin from '../helpers/userLogin';

dotenv.config();

declare module 'express-session' {
    interface SessionData {
        token: any;
    }
}

export async function login(req: Request, res: Response){
    if(req.session.token){
        return res.redirect('/');
    }

    const title = 'Login';
    const pagecss = 'login.css';
    
    const response = await userLogin(req.body);

    if(!response){
        return res.render('login/login', { title, pagecss });

    }else{
        if(!response.user && !response.message){
            return res.status(500).render('login/login', { title, pagecss, message: 'Erro no Sistema'});
        }
    
        if(!response.user && response.message){
            return res.render('login/login', { title, pagecss, message: response.message });
        }
        
        if(response && response.user){
            req.session.token = generateToken({ name: response.user.name, email: response.user.email });
            return res.redirect('/');
        }
    }
}

export async function register(req: Request, res: Response){
    if(req.session.token){
        return res.redirect('/');
    }

    const title: string = 'Cadastro';
    const pagecss: string = 'login.css';

    const response = await userRegister(req.body);

    if(!response){
        return res.render('login/register', { title, pagecss });
    }

    if(!response.user && !response.message){
        return res.status(500).render('login/register', { title, pagecss, message: 'Erro no Sistema'});
    }

    if(response.message){
        return res.render('login/register', { title, pagecss, message: response.message });
    }
    
    if(response.user){
        req.session.token = generateToken({ name: response.user.name, email: response.user.email });
        return res.status(201).redirect('/');
    }
};

export function logout(req: Request, res: Response){
    req.session.destroy(function(err){});
    res.redirect('/login');
};