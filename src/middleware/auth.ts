import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction) =>{
        let success: boolean = false;

        if(req.session.token){
            const token = req.session.token;
            
            if(JWT.verify(token, process.env.JWT_SECRET_KEY as string)){
                success = true;
            }
        }

        success ? next() : res.redirect('/login');
    }
}

export const generateToken = (data: { name: string, email: string }) =>{
    return JWT.sign(data, process.env.JWT_SECRET_KEY as string)
}