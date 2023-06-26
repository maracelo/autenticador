import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwtDecode from 'jwt-decode';
import JWTUserDataType from '../types/JWTUserDataType';
import { User } from '../models/User'; 
import { PhoneAuth } from '../models/PhoneAuth';
import generateToken from '../helpers/generateToken';
import userRegister from '../helpers/userRegister';
import userLogin from '../helpers/userLogin';
import checkDecoded from '../helpers/checkDecoded';
import checkHasPhoneAuth from '../helpers/checkHasPhoneAuth';

dotenv.config();

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

        req.session.token = await generateToken({ 
            name: response.user.name, 
            email: response.user.email,
            phone: response.user.phone ?? null,
            verified_email: response.user.verified_email,
            phone_auth: await checkHasPhoneAuth(response.user.id as number, response.user.phone ?? null)
        }, 'login(loginController)');
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

        req.session.token = await generateToken({ 
            name: response.user.name, 
            email: response.user.email,
            phone: response.user.phone ?? null,
            verified_email: response.user.verified_email,
            phone_auth: await checkHasPhoneAuth(response.user.id as number, response.user.phone ?? null)
        }, 'register(LoginController)');
        return res.status(201).redirect('/');
    }
};

export async function logout(req: Request, res: Response){
    const token = req.session.token;

    const response = await checkDecoded(token);

    if(response && (response.verified_email || response.phone_auth === 'approved')){

        let decoded: JWTUserDataType = await jwtDecode(token);

        console.log('LoginController: ' + JSON.stringify(decoded));

        const user = await User.findOne({ where: {email: decoded.email} });

        if(user){
            if(response.verified_email) await user.update({ verified_email: false });
            
            if(response.phone_auth === 'approved'){
                const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });
                
                phoneAuth?.update({ otp_id: null, auth: false, status: false });
            }
        } 
    }
    
    req.session.destroy( (err) =>{ if(err) console.log(err) } );
    res.redirect('/login');
};