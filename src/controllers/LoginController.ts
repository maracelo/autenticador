import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../middleware/auth';
import dotenv from 'dotenv';
import validator from 'validator';
import bcrypt from 'bcrypt';

dotenv.config();

declare module 'express-session' {
    interface SessionData {
        token: any;
    }
}

function validatePassword(password: string){
    return validator.matches(password, /^(?=.*[0-9])(?=.*['";:/><)(}{!@#$%^&*_-])[a-zA-Z0-9'";:/><)(}{!@#$%^&*_-]{8,100}$/g);
}

export async function login(req: Request, res: Response){
    if(req.session.token){
        return res.redirect('/');
    }

    const title = 'Login';
    const pagecss = 'login.css';
    let message: string[] = ['E-mail e/ou senha inválidos'];

    if(!req.body.email || !req.body.password){
        return res.render('login/login', { title, pagecss });
    }
    
    const {email, password} = req.body;

    if(!validator.isEmail(email) || !validatePassword(password)){
        return res.render('login/login', { title, pagecss, message });
    }
    
    const user = await User.findOne({where: { email }});
    
    if(!user){
        return res.render('login/login', { title, pagecss, message });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword){
        return res.render('login/login', { title, pagecss, message });
    }

    req.session.token = generateToken({ name: user.name, email: user.email });
    res.status(200).redirect('/');
}

export async function register(req: Request, res: Response){
    if(req.session.token){
        return res.redirect('/');
    }

    const title = 'Cadastro';
    const pagecss = 'login.css';

    if(!req.body.name || !req.body.email || !req.body.password || !req.body.password_confirmation){
        return res.render('login/register', { title, pagecss });
    }

    const {name, email, password, password_confirmation} = req.body;

    if(name.length < 2){
        return res.render('login/register', {
            title, pagecss,
            message: 'Nome precisa de no mínimo 2 caracteres'
        });
    }
    
    if(!validator.isEmail(email)){
        return res.render('login/register', {
            title, pagecss,
            message: 'E-mail inválido'
        });
    }

    const user = await User.findOne({ where: { email } });

    if(user){
        return res.render('login/register', {
            title, pagecss,
            message: 'E-mail já está em uso'
        });
    }

    if(password !== password_confirmation){
        return res.render('login/register', {
            title, pagecss,
            message: 'Senhas precisam ser iguais'
        });
    }
    
    if(!validatePassword(password)){
        return res.render('login/register', {
            title, pagecss,
            message: [
                'Senha tem que ter entre 8 a 100 caracteres',
                'Senha precisa de caracteres numéricos e alfabéticos',
                'Senha tem que ter 1 ou mais caracteres especias'
            ]
        });
    }
    
    const finalName = validator.blacklist(name, '<>');
    const encryptedPassword = await bcrypt.hash(password, 8);
    const newUser = await User.create({ name: finalName, email, password: encryptedPassword });
    
    req.session.token = generateToken({ name: newUser.name, email: email });
    res.status(201).redirect('/');
};

export function logout(req: Request, res: Response){
    req.session.destroy(function(err){});
    res.redirect('/login');
};