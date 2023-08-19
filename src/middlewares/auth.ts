import { Request, Response, NextFunction } from 'express';
import { User, UserInstance } from '../models/User';
import checkPhoneAuthStatus from '../helpers/phone/checkPhoneAuthStatus';
import checkAuth from '../helpers/checkAuth';
import { PhoneAuth } from '../models/PhoneAuth';

const Auth = { checkJWT, privateRoute, normalRoute, verifyEmailRoute, phoneAuthRoute }

async function checkJWT(req: Request, res: Response, next: NextFunction){
    const id = await req.session.userId ?? null;
    const user = await User.findOne({ where: {id} });

    if(user) return res.json({ errMessage: 'Você já está lougado' });

    next();
}

async function privateRoute(req: Request, res: Response, next: NextFunction){
    
    const response = await checkAuth(await req.session.userId ?? null);

    if(response.errMessage) return res.json({ errMessage: response.errMessage });

    res.locals.user = response.user;

    next();
}

async function normalRoute(req: Request, res: Response, next: NextFunction){
    const user = res.locals.user;

    if(!user.verified_email) return res.json({ errMessage: 'Verifique seu E-mail' });

    switch(await checkPhoneAuthStatus(user)){
        case 'pending_phone':
            res.json({ message: 'Adicionar Número de Telefone em /config' });
        break;
        case 'pending_send': 
            res.json({ errMessage: 'Enviar Código SMS em /sendotp' });
        break;
        case 'pending':
            res.json({ message: 'Confirme Código de Verificação por SMS em /verifyotp' });
        break;
        default:
            next();
        break;
    }
}

async function verifyEmailRoute(req: Request, res: Response, next: NextFunction){
    const user = res.locals.user;

    if(user.verified_email) return res.json({ success: 'E-mail já verificado' });

    next();
}

async function phoneAuthRoute(req: Request, res: Response, next: NextFunction){
    const user = res.locals.user as UserInstance;

    if(!user.verified_email) return res.json({ errMessage: 'Verifique seu E-mail' });

    const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });

    if(!phoneAuth) return res.json({ errMessage: 'Verificação por SMS não ativada' });

    res.locals.phoneAuth = phoneAuth;

    switch(phoneAuth.status){
        case 'pending_phone':
            res.json({ errMessage: 'Adicionar Número de Telefone em /config' });
        break;
        case 'pending_send':
            if(req.route.path === '/sendotp') return next();
            res.json({ errMessage: 'Enviar Código SMS em /sendotp' });
        break;
        case 'pending':
            next();
        break;
        case 'approved':
            res.json({ success: 'SMS já foi verificado' });
        break;
        default:
            res.json({ errMessage: 'Verificação por SMS não está ativada' });
        break;
    }
}

export default Auth;