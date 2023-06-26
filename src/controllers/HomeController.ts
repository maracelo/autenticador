import { Request, Response } from "express";
import dotenv from 'dotenv';
import jwt_decode from 'jwt-decode';
import JWTUserDataType from "../types/JWTUserDataType";

dotenv.config();

// TODO olhar os TODO's

export async function home(req: Request, res: Response){
    const token = req.session.token;

    const user: JWTUserDataType = await jwt_decode(token);

    return res.render('home', {
        title: 'Home',
        pagecss: 'home.css',
        user,
    });
}