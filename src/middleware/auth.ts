import { Request, Response, NextFunction } from 'express';
// import { PhoneAuth } from '../models/PhoneAuth';
import verifyToken from '../helpers/verifyToken';
import checkDecoded from '../helpers/checkDecoded';

const Auth = { checkJWT, checkVerifiedEmail, privateRoute }

async function checkJWT(req: Request, res: Response, next: NextFunction){
    const token = await req.session.token;

    if(verifyToken(token)) return res.redirect('/verifyemail');
    
    next(); 
}

async function privateRoute(req: Request, res: Response, next: NextFunction){
    const token = await req.session.token;

    const checkRes = await checkDecoded(token)

    switch(checkRes){
        case 'not_verified':
            res.redirect('/verifyemail');
        break;
        case 'verified':
            next();
        break;
        default:
            res.redirect('/logout');
        break;
    }
}

async function checkVerifiedEmail(req: Request, res: Response, next: NextFunction){
    const token = await req.session.token;
    
    if(!verifyToken(token)) return res.redirect('/login');
    
    const checkRes = await checkDecoded(token)

    switch(checkRes){
        case 'not_verified':
            next();
        break;
        case 'verified':
            res.redirect('/');
        break;
        default:
            res.redirect('/logout');
        break;
    }
}

export default Auth;