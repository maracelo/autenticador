import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../middleware/generateToken';
import dotenv from 'dotenv';
import Cookies from 'js-cookie';
import bcrypt from 'bcrypt';

dotenv.config();

export async function login(req: Request, res: Response){
    let message: string|false = false;

    if(req.body.email && req.body.password){
        const {email, password} = req.body;

        const user = await User.findOne({where: { email }});

        if(user){

            const validPassword = await bcrypt.compare(password, user.password);

            if(validPassword){
                const token = generateToken({ id: user.id })
                Cookies.set('token', token)

                res.redirect('/');
                return;
            }
        }
        message = 'E-mail e/ou senha inválidos'
    }

    res.render('login/login', {
        title: 'Login',
        pagecss: 'login.css',
        message
    });
}

export async function register(req: Request, res: Response){
    let message: false|string = false;
    
    if(req.body.email && req.body.password){
        const {email, password} = req.body;

        const hasUser = await User.findAll({where: { email }});

        if(!hasUser){
            const newUser = await User.create({ email, password: bcrypt.hash(password, 8) });
            const token = generateToken({ id: newUser.id });

            Cookies.set('token', token);
            return res.status(201).redirect('/');
        }

        message = 'E-mail já existe.';
    }

    res.render('login/register', {
        title: 'Cadastro',
        pagecss: 'login.css',
        message
    });
};

export function logout(req: Request, res: Response){
    console.log(Cookies.remove('token'));
    res.redirect('/login');
};