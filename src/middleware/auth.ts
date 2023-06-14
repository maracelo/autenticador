import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import jwt_decode from 'jwt-decode';
import { User } from '../models/User';
// import { PhoneAuth } from '../models/PhoneAuth';
import TokenDataType from '../types/TokenDataType';

dotenv.config();

export const Auth = { privateRoute, checkLogin }

function privateRoute(req: Request, res: Response, next: NextFunction){
    const token = req.session.token ?? null;
    
    if(!req.session.token || !JWT.verify(token, process.env.JWT_SECRET_KEY as string)){
        return res.redirect('/login');
    } 
    
    next();
}

async function checkLogin(req: Request, res: Response, next: NextFunction){
    const token = req.session.token ?? null;
    
    if(!token || !JWT.verify(token, process.env.JWT_SECRET_KEY as string)) return next();
    
    const decoded: TokenDataType = await jwt_decode(token);

    if(!decoded || !decoded.email) return res.redirect('/logout');

    const user = await User.findOne({ where: {email: decoded.email} });

    if(!user) return res.redirect('/logout');

    res.redirect('/'); //temp

    /* if(!user.phone) return next();

    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });

    if(!phoneAuth) return res.redirect('/logout');

    phoneAuth.auth ? next() : res.redirect('/phoneauth'); */
}