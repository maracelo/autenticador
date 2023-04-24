import { Request, Response } from "express";

export function login(req: Request, res: Response){
    res.render('login/login');
}

export function register(req: Request, res: Response){
    res.render('login/register');
};

export function logout(req: Request, res: Response){
    res.send('logout');
};