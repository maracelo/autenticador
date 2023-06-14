import { Router } from "express";
import * as LoginController from "../controllers/LoginController";
import * as HomeController from "../controllers/HomeController";
import * as PhoneAuthController from "../controllers/PhoneAuthController";
import { Auth } from '../middleware/auth';

const router = Router();

router.get('/login', Auth.checkLogin, LoginController.login);
router.post('/login', Auth.checkLogin, LoginController.login);
router.get('/register', Auth.checkLogin, LoginController.register);
router.post('/register', Auth.checkLogin, LoginController.register);
router.get('/logout', /* Auth.checkLogin, */ LoginController.logout);

/* router.get('/phoneauth', Auth.privateRoute, PhoneAuthController.page);
router.post('/phoneauth', Auth.privateRoute, PhoneAuthController.verify);
router.post('/phoneauth_resend', Auth.privateRoute, PhoneAuthController.resend); */

router.get('/', Auth.privateRoute, /* Auth.checkLogin, */ HomeController.home);

export default router;