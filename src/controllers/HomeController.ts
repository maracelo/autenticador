import { Request, Response } from "express";
import dotenv from 'dotenv';
import jwt_decode from 'jwt-decode';
import JWTUserData from "../types/JWTUserData";

dotenv.config();

export async function home(req: Request, res: Response){
    const token = req.session.token;

    const user: JWTUserData = await jwt_decode(token);

    return res.render('home', {
        title: 'Home',
        pagecss: 'home.css',
        user,
    });
}