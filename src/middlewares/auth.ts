import { Request, Response, NextFunction } from 'express';
import { UserInstance } from '../models/User';
import checkPhoneAuthStatus from '../helpers/checkPhoneAuthStatus';
import checkAuth from '../helpers/checkAuth';

const Auth = { checkJWT, checkVerifiedEmail, privateRoute, checkPhoneAuth, checkPhone }

async function checkJWT(req: Request, res: Response, next: NextFunction){

    const token = await req.session.token;

    if(token) return res.redirect('/verifyemail');
    
    next(); 
}

async function privateRoute(req: Request, res: Response, next: NextFunction){

    const response = await checkAuth(await req.session.token);

    if(response.redirect) return res.redirect(response.redirect);

    let user = response.user as UserInstance;

    if(!user.verified_email) return res.redirect('/verifyemail');

    switch(await checkPhoneAuthStatus(user.id, user.phone)){
        case 'pending_phone':
            res.redirect('/addphone');
        break;
        case 'pending':
            res.redirect('/sendotp')
        break;
        default:
            next();
        break;
    }
}

async function checkVerifiedEmail(req: Request, res: Response, next: NextFunction){
    
    const response = await checkAuth(await req.session.token);

    if(response.redirect) return res.redirect(response.redirect);

    let user = response.user as UserInstance;

    if(user.verified_email) return res.redirect('/');
    
    next();
}

async function checkPhoneAuth(req: Request, res: Response, next: NextFunction){
    
    const response = await checkAuth(await req.session.token);

    if(response.redirect) return res.redirect(response.redirect);

    let user = response.user as UserInstance;

    if(!user.verified_email) return res.redirect('/verifyemail');

    switch(await checkPhoneAuthStatus(user.id, user.phone)){
        case 'pending':
            next();
        break;
        case 'pending_phone':
            res.redirect('/addphone');
        break;
        default:
            res.redirect('/');
        break;
    }
}

async function checkPhone(req: Request, res: Response, next: NextFunction){

    const response = await checkAuth(await req.session.token);

    if(response.redirect) return res.redirect(response.redirect);

    let user = response.user as UserInstance;

    switch(await checkPhoneAuthStatus(user.id, user.phone)){
        case 'pending':
            res.redirect('/addphone');
        break;
        case 'pending_phone':
            next();
        break;
        default:
            res.redirect('/');
        break;
    }
}

export default Auth;