import { Request, Response, NextFunction } from 'express';
import jwtDecode from 'jwt-decode';
import JWTUserDataType from '../types/JWTUserDataType';
import verifyToken from '../helpers/verifyToken';
import checkDecoded from '../helpers/checkDecoded';
import generateToken from '../helpers/generateToken';
import phoneNumberValidation from '../helpers/phoneNumberValidation';

const Auth = { checkJWT, checkVerifiedEmail, privateRoute, checkPhoneAuth, checkPhone }

async function checkJWT(req: Request, res: Response, next: NextFunction){
    const token = await req.session.token;

    if(verifyToken(token)) return res.redirect('/verifyemail');
    
    next(); 
}

async function privateRoute(req: Request, res: Response, next: NextFunction){
    const token = await req.session.token;

    const response = await checkDecoded(token);

    if(!response) return res.redirect('/logout');

    if(!response.verified_email) return res.redirect('/verifyemail');

    switch(response.phone_auth){
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
    
    if(!verifyToken(token)) return res.redirect('/login');

    const response = await checkDecoded(token);

    if(!response) return res.redirect('/logout');

    if(!response.verified_email) return next();

    switch(response.phone_auth){
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
    
    if(!verifyToken(token)) return res.redirect('/login');

    const response = await checkDecoded(token);

    if(!response) return res.redirect('/logout');

    if(!response.verified_email) return res.redirect('/verifyemail');

    switch(response.phone_auth){
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
    const decoded: JWTUserDataType = await jwtDecode(await req.session.token);

    if(
        !decoded.phone
        || !phoneNumberValidation(decoded.phone)
        || decoded.phone_auth === 'pending_phone'
    ){
        req.session.token = await generateToken({
            name: decoded.name,
            email: decoded.email,
            phone: null,
            verified_email: true,
            phone_auth: 'pending_phone'
        }, 'checkPhone(auth)');

        return res.redirect('/addphone');
    }

    next();
}

export default Auth;

// TODO Password to SSO accounts to have a new option to enter in default login