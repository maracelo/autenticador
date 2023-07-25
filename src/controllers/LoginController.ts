import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { User } from '../models/User'; 
import { PhoneAuth } from '../models/PhoneAuth';
import generateToken from '../helpers/generateToken';
import userRegister from '../helpers/userRegister';
import userLogin from '../helpers/userLogin';
import decodeJWT from '../helpers/decodeJWT';
import checkPhoneAuthStatus from '../helpers/checkPhoneAuthStatus';

dotenv.config();

export async function login(req: Request, res: Response){
    const title = 'Login';
    const pagecss = 'login.css';
    
    if(!req.body) return res.render('login/login', { title, pagecss });
    
    const response = await userLogin(req.body);

    if(response.message){
        return res.render('login/login', { title, pagecss, message: response.message });
    }
    
    if(response.user){
        req.session.token = await generateToken({ id: response.user.id });
        return res.status(201).redirect('/');
    }

    return res.render('login/login', { title, pagecss, message: response?.message ?? undefined});
}

export async function demo(req: Request, res: Response){
    const user = await User.findOne({ where: {email: 'test@test.test'} });

    if(!user) return res.status(500).redirect('/login');

    req.session.token = await generateToken({ id: user.id })

    res.status(201).redirect('/');
}

export async function register(req: Request, res: Response){
    const title: string = 'Cadastro';
    const pagecss: string = 'login.css';

    if(!req.body) return res.render('login/register', { title, pagecss });
    
    const response = await userRegister(req.body);

    if(response.message){
        return res.render('login/register', { title, pagecss, message: response.message });
    }
    
    if(response.user){
        req.session.token = await generateToken({ id: response.user.id });
        return res.status(201).redirect('/');
    }

    return res.status(500).render('login/register', { title, pagecss});
};

export async function logout(req: Request, res: Response){
    const json: any = await decodeJWT(await req.session.token);

    if(json){
        const user = await User.findOne({ where: {id: json.id} });

        if(user){
            
            if(user.verified_email) await user.update({ verified_email: false });
            
            if(await checkPhoneAuthStatus(user.id, user.phone) === 'approved'){
                
                const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });
                
                phoneAuth?.update({ otp_id: null, status: 'pending' });
            }
        } 
    }
    
    req.session.destroy( (err) =>{ if(err) console.log(err) } );
    res.redirect('/login');
};