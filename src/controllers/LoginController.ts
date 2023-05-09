import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../config/passport';
import Cookies from 'js-cookie';
import bcrypt from 'bcrypt';

export async function login(req: Request, res: Response){
    if(Cookies.get('token') !== undefined){
        res.redirect('/');
        return;
    }

    if(req.body.email && req.body.password){
        const {email, password} = req.body;

        const user = await User.findOne({where: { email }});

        if(user){
            const passComp = await bcrypt.compare(password, user.password);

            if(passComp){
                const token = generateToken({ id: user.id });

                Cookies.set('token', token);
                return res.redirect('/');
            }
        } 
    }

    return res.render('login/login', {
        title: 'Login',
        pagecss: 'login.css',
    });
}

export async function register(req: Request, res: Response){
    console.log(req.body);

    let message: string|false = false;
    
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
    res.send('logout');
};