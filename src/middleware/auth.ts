import { Request, Response, NextFunction } from 'express';
import decodeJWT from '../helpers/decodeJWT';
import phoneNumberValidation from '../helpers/phoneNumberValidation';
import { User } from '../models/User';
import checkPhoneAuthStatus from '../helpers/checkPhoneAuthStatus';

const Auth = { checkJWT, checkVerifiedEmail, privateRoute, checkPhoneAuth, checkPhone }

async function checkJWT(req: Request, res: Response, next: NextFunction){
    const token = await req.session.token;

    if(token) return res.redirect('/verifyemail');
    
    next(); 
}

async function privateRoute(req: Request, res: Response, next: NextFunction){
    const token = await req.session.token;

    if(!token) return res.redirect('/login');

    const json = await decodeJWT(token);

    if(!json) return res.redirect('/logout');

    const user = await User.findOne({ where: {id: json.id} });

    if(!user) return res.redirect('/logout');

    if(!user.verified_email) return res.redirect('/verifyemail');

    switch(await checkPhoneAuthStatus(user.id, user.phone)){
        case 'pending_phone':
        case 'pending':
            res.redirect('/addphone');
        break;
        default:
            next();
        break;
    }
}

async function checkVerifiedEmail(req: Request, res: Response, next: NextFunction){
    const token = await req.session.token;

    if(!token) return res.redirect('/login');

    const json = await decodeJWT(token);

    if(!json) return res.redirect('/logout');

    const user = await User.findOne({ where: {id: json.id} });

    if(!user) return res.redirect('/logout');
    
    const response = await decodeJWT(token);

    if(!response) return res.redirect('/logout');

    if(!user.verified_email) return next();

    switch(await checkPhoneAuthStatus(user.id, user.phone)){
        case 'pending':
            res.redirect('/sendotp');
        break;
        case 'pending_phone':
            res.redirect('/addphone');
        break;
        default:       
            res.redirect('/');
        break;
    }
}

async function checkPhoneAuth(req: Request, res: Response, next: NextFunction){
    const token = await req.session.token;

    if(!token) return res.redirect('/login');

    const json = await decodeJWT(token);

    if(!json) return res.redirect('/logout');

    const user = await User.findOne({ where: {id: json.id} });

    if(!user) return res.redirect('/logout');

    if(!user.verified_email) return res.redirect('/verifyemail');

    switch(await checkPhoneAuthStatus(user.id, user.phone)){
        case 'pending':
        case 'pending_phone':
            next();
            return;
        break;
        default:
            res.redirect('/');
        break;
    }
}

async function checkPhone(req: Request, res: Response, next: NextFunction){
    const token = await req.session.token;

    const json = await decodeJWT(token);

    if(!json) return res.redirect('/logout');

    const user = await User.findOne({ where: {id: json.id} });

    if(!user) return res.redirect('/logout');

    if(
        !user.phone
        || !phoneNumberValidation(user.phone)
        || await checkPhoneAuthStatus(user.id, user.phone) === 'pending_phone'
    ){
        return res.redirect('/addphone');
    }

    next();
}

export default Auth;