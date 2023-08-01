import { Router } from "express";
import * as LoginController from "../controllers/LoginController";
import * as HomeController from "../controllers/HomeController";
import * as PhoneAuthController from "../controllers/PhoneController";
import * as EmailController from "../controllers/EmailController";
import * as ConfigController from "../controllers/ConfigController";
import Auth from '../middlewares/auth';

const router = Router();

router.get('/login', Auth.checkJWT, LoginController.login);
router.post('/login', Auth.checkJWT, LoginController.login);
router.get('/logindemo', Auth.checkJWT, LoginController.demo);
router.get('/register', Auth.checkJWT, LoginController.register);
router.post('/register', Auth.checkJWT, LoginController.register);
router.get('/logout', LoginController.logout);

router.get('/verifyemail', Auth.checkVerifiedEmail, EmailController.page);
router.get('/confirmemail', Auth.checkVerifiedEmail, EmailController.authConfirm);
router.get('/changeemail', EmailController.changeConfirm);
router.get('/emaildemo', Auth.checkVerifiedEmail, EmailController.demo);

router.get('/addphone', Auth.checkPhone, PhoneAuthController.add);
router.post('/addphone', Auth.checkPhone, PhoneAuthController.add)
router.get('/sendotp', Auth.checkPhoneAuth, PhoneAuthController.sendOTP);
router.post('/sendotp', Auth.checkPhoneAuth, PhoneAuthController.verifyOTP);
router.post('/resendotp', Auth.checkPhoneAuth, PhoneAuthController.resendOTP);

router.get('/', Auth.privateRoute, HomeController.home);
router.get('/config', Auth.privateRoute, ConfigController.config);
router.post('/config', Auth.privateRoute, ConfigController.config);
router.post('/deleteuser', Auth.privateRoute, ConfigController.deleteUser);

export default router;