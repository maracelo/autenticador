import { Request, Response } from "express";
import { User } from '../models/User';
import dotenv from 'dotenv';
import jwt_decode from 'jwt-decode';
import JWTUserDataType from "../types/JWTUserDataType";

dotenv.config();

// TODO ajeitar esse user da home
export async function home(req: Request, res: Response){
    const token = req.session.token;

    const decoded: JWTUserDataType = await jwt_decode(token);

    const user = await User.findOne({where: { email: decoded.email } });
    
    if(user){
        return res.render('home', {
            title: 'Home',
            pagecss: 'home.css',
            user,
        });
    }
}