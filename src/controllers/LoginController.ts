import { Request, Response } from "express";

export function login(req: Request, res: Response){
    res.render('login');
}

export function register(req: Request, res: Response){
    res.render('register');
};

export function logout(req: Request, res: Response){
    res.render('logout');
};