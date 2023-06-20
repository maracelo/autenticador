import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwtDecode from 'jwt-decode';
import TokenDataType from '../types/TokenDataType';
import { User } from '../models/User'; 
// import { PhoneAuth } from '../models/PhoneAuth';
import generateToken from '../helpers/generateToken';
import userRegister from '../helpers/userRegister';
import userLogin from '../helpers/userLogin';
import verifyToken from '../helpers/verifyToken';
import checkDecoded from '../helpers/checkDecoded';

dotenv.config();

export async function login(req: Request, res: Response){
    const title = 'Login';
    const pagecss = 'login.css';
    
    const response = await userLogin(req.body);

    if(!response) return res.render('login/login', { title, pagecss });

    if(!response.user && !response.message){
        return res.status(500).render('login/login', { title, pagecss, message: 'Erro no Sistema'});
    }

    if(response.message){
        return res.render('login/login', { title, pagecss, message: response.message });
    }
    
    if(response.user){

        /* if(response.user.phone){
            req.session.token = generateToken({ 
                name: response.user.name, 
                email: response.user.email, 
                phone: response.user.phone 
            }); 

            return res.status(201).redirect('/phoneauth');
        }  */
        
        req.session.token = await generateToken({ 
            name: response.user.name, 
            email: response.user.email,
            verified_email: response.user.verified_email 
        });
        res.status(201).redirect('/');
    }
}

export async function register(req: Request, res: Response){
    const title: string = 'Cadastro';
    const pagecss: string = 'login.css';

    const response = await userRegister(req.body);

    if(!response) return res.render('login/register', { title, pagecss });

    if(!response.user && !response.message){
        return res.status(500).render('login/register', { title, pagecss, message: 'Erro no Sistema'});
    }

    if(response.message){
        return res.render('login/register', { title, pagecss, message: response.message });
    }
    
    if(response.user){

        /* if(response.user.phone){
            req.session.token = generateToken({ 
                name: response.user.name, 
                email: response.user.email, 
                phone: response.user.phone 
            }); 

            return res.status(201).redirect('/phoneauth');
        }  */

        req.session.token = generateToken({ 
            name: response.user.name, 
            email: response.user.email, 
            verified_email: response.user.verified_email
        });
        return res.status(201).redirect('/');
    }
};

export async function logout(req: Request, res: Response){
    const token = req.session.token;

    const checkRes = await checkDecoded(token);
    
    if(checkRes === 'verified'){
        let decoded: TokenDataType = await jwtDecode(token);
        
        const user = await User.findOne({ where: {email: decoded.email} });
        
        if(user) await user.update({ verified_email: false });
    }
    
    req.session.destroy( (err) =>{ console.log(err) } );
    res.redirect('/login');

    /* const phoneAuth = await PhoneAuth.findOne({ where: {user_id: user.id} });
    
    if(phoneAuth) await phoneAuth.update({ auth: false, status: false }); */
};