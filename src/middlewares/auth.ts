import { Request, Response, NextFunction } from 'express';
import { User, UserInstance } from '../models/User';
import checkAuth from '../helpers/checkAuth';

const Auth = { checkJWT, privateRoute, normalRoute, verifyEmailRoute }

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

    next();
}

async function verifyEmailRoute(req: Request, res: Response, next: NextFunction){
    const user = res.locals.user;

    if(user.verified_email) return res.json({ success: 'E-mail já verificado' });

    next();
}

export default Auth;