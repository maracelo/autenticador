import { Request, Response } from "express";

export function login(req: Request, res: Response){
    res.render('login/login', {
        title: 'Login',
        pagecss: 'login.css',
    });
}

export function register(req: Request, res: Response){
    res.render('login/register', {
        title: 'Cadastro',
        pagecss: 'login.css',
    });
};

export function logout(req: Request, res: Response){
    res.send('logout');
};