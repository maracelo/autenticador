import { NextFunction, Request, Response, Router } from "express";
import * as LoginController from "../controllers/LoginController";
import * as HomeController from "../controllers/HomeController";
// import * as PhoneAuthController from "../controllers/PhoneAuthController";
import * as EmailController from "../controllers/EmailController";
import Auth from '../middleware/auth';

const router = Router();

router.get('/login', Auth.checkJWT, LoginController.login);
router.post('/login', Auth.checkJWT, LoginController.login);
router.get('/register', Auth.checkJWT, LoginController.register);
router.post('/register', Auth.checkJWT, LoginController.register);
router.get('/logout', /* Auth.checkJWT, */ LoginController.logout);

router.get('/verifyemail', Auth.checkVerifiedEmail, EmailController.page);
router.get('/confirmemail', Auth.checkVerifiedEmail, EmailController.confirm);

/* router.get('/phoneauth', Auth.privateRoute, PhoneAuthController.page);
router.post('/phoneauth', Auth.privateRoute, PhoneAuthController.verify);
router.post('/phoneauth_resend', Auth.privateRoute, PhoneAuthController.resend); */

router.get('/test', (req: Request, res: Response) =>{
    res.render('test');
});

router.get('/', Auth.privateRoute, HomeController.home);

export default router;