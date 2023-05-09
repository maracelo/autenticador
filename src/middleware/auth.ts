import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import Cookies from 'js-cookie';

dotenv.config();

export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction) =>{
        let success: boolean = false;

        if(Cookies.get('token')){
            const token: string|null = Cookies.get('token') ?? null;
            
            if(JWT.verify(token as string, process.env.JWT_SECRET_KEY as string)){
                success = true;
            }
        }

        success ? next() : res.redirect('/login');
    }
}