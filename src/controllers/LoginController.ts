import { Request, Response } from 'express';
import dotenv from 'dotenv';
/* import jwt_decode from 'jwt-decode';
import DecodedType from '../types/decodedType';
import { PhoneAuth } from '../models/PhoneAuth';
import { User } from '../models/User'; */
import generateToken from '../helpers/generateToken';
import userRegister from '../helpers/userRegister';
import userLogin from '../helpers/userLogin';

dotenv.config();

declare module 'express-session' {
    interface SessionData {
        token: any;
    }
}

export async function login(req: Request, res: Response){
    const title = 'Login';
    const pagecss = 'login.css';
    
    const response = await userLogin(req.body);

    if(!response) return res.render('login/login', { title, pagecss });

    if(!response.user && !response.message){
        return res.status(500).render('login/login', { title, pagecss, message: 'Erro no Sistema'});
    }

    if(response.message){
        return res.render('login/login', { title, pagecss, message: response.message });
    }
    
    if(response.user){

        /* if(response.user.phone){
            req.session.token = generateToken({ 
                name: response.user.name, 
                email: response.user.email, 
                phone: response.user.phone 
            }); 

            return res.status(201).redirect('/phoneauth');
        }  */

        req.session.token = generateToken({ name: response.user.name, email: response.user.email });
        res.status(201).redirect('/');
    }
}

export async function register(req: Request, res: Response){
    const title: string = 'Cadastro';
    const pagecss: string = 'login.css';

    const response = await userRegister(req.body);

    if(!response) return res.render('login/register', { title, pagecss });

    if(!response.user && !response.message){
        return res.status(500).render('login/register', { title, pagecss, message: 'Erro no Sistema'});
    }

    if(response.message){
        return res.render('login/register', { title, pagecss, message: response.message });
    }
    
    if(response.user){

        /* if(response.user.phone){
            req.session.token = generateToken({ 
                name: response.user.name, 
                email: response.user.email, 
                phone: response.user.phone 
            }); 

            return res.status(201).redirect('/phoneauth');
        }  */

        req.session.token = generateToken({ name: response.user.name, email: response.user.email });
        return res.status(201).redirect('/');
    }
};

export async function logout(req: Request, res: Response){
    
    // const decoded: DecodedType = await jwt_decode(req.session.token);
    req.session.destroy(function(err){});
    
    /* if(!decoded || !decoded.phone) return res.redirect('/login');
    
    const user = await User.findOne({ where: {phone: decoded.phone} });

    if(!user) return res.redirect('/login');
    
    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });
    
    if(phoneAuth) await phoneAuth.update({ auth: false, status: false }); */
    
    res.redirect('/login');
};