import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config();

const notAuthorized = { status: 401, message: 'Não Autorizado(a)'}

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY as string,
}

passport.use(new JwtStrategy(opts, async (jwt_payload, done) =>{
    
    if(jwt_payload){
        const user =  await User.findByPk(jwt_payload.id);

        if(user){
            return done(null, user);
        }
    }

    return done(notAuthorized, false);
}));

export const privateRoute = (req: Request, res: Response, next: NextFunction) =>{
    passport.authenticate('jwt', (err: any, user: any) =>{
        req.user = user;
        return user ? next() : res.redirect('/login');
    })(req, res, next);
}

export const generateToken = (data: Object) =>{
    return JWT.sign(data, process.env.JWT_SECRET_KEY as string)
}

export default passport;