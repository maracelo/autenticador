import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { User } from '../models/User'; 
import userRegister from '../helpers/login/userRegister';
import userLogin from '../helpers/login/userLogin';
import { sendEmailVerification } from '../helpers/email/sendEmailVerification';

dotenv.config();

export async function login(req: Request, res: Response){

    if(!req.body) return res.status(400).json({ errMessage: 'Informações não enviadas' });
    
    const response = await userLogin(req.body);

    if(response.message) return res.status(400).json({ errMessage: response.message });
    
    if(response.user){
        req.session.userId = response.user.id.toString();

        await sendEmailVerification(response.user);

        return res.status(201).json({
            success: 'Usuário Lougado',
            email_status: 'pending'
        });
    }

    return res.status(500).json({ errMessage: 'Erro no Sistema' });
}

export async function demo(req: Request, res: Response){

    const user = await User.findOne({ where: {email: 'test@test.test'} });

    if(!user) return res.status(500).json({ errMessage: 'Erro no Sistema' });
    
    await user.update({ verified_email: false });

    req.session.userId = user.id.toString();

    res.json({ success: 'Usuário Lougado', email_status: 'pending' });
}

export async function register(req: Request, res: Response){

    if(!req.body) return res.status(400).json({ errMessage: 'Informações não enviadas' });
    
    const response = await userRegister(req.body);

    if(response.messages && response.messages[0]){
        return res.status(400).json({ errMessage: response.messages });
    }
    
    if(response.user){
        const { user } = response;
        req.session.userId = response.user.id.toString();

        sendEmailVerification(user);

        return res.status(201).json({ success: 'Usuário Criado' });
    }

    return res.status(500).json({ errMessage: 'Erro no Sistema' });
};

export async function logout(req: Request, res: Response){
    const errMessage = 'Faça seu login em /login';

    if(!req.session) return res.json({ errMessage });

    const id = await req.session.userId;

    if(!id) return res.json({ errMessage });

    const user = await User.findOne({ where: {id} });

    if(user && user.verified_email) await user.update({ verified_email: false });
    
    req.session.destroy( (err) =>{ if(err) console.log(err) } );
    res.json({ success: 'Logout Concluído' });
};