import { Router } from "express";
import * as LoginController from "../controllers/LoginController";
import * as HomeController from "../controllers/HomeController";
import * as EmailController from "../controllers/EmailController";
import * as ConfigController from "../controllers/ConfigController";
import Auth from '../middlewares/auth';

const router = Router();

router.post('/login', Auth.checkJWT, LoginController.login);
router.post('/register', Auth.checkJWT, LoginController.register);
router.get('/logout', LoginController.logout);

router.get('/confirmemail', EmailController.authConfirm);
router.get('/confirm_changeemail', EmailController.changeConfirm);
router.get('/refuse_changeemail', EmailController.changeRefuse);
router.get('/emaildemo', Auth.privateRoute, Auth.verifyEmailRoute, EmailController.demo);

router.get('/', Auth.privateRoute, Auth.normalRoute, HomeController.home);
router.post('/config', Auth.privateRoute, Auth.normalRoute, ConfigController.config);
router.post('/deleteuser', Auth.privateRoute, Auth.normalRoute, ConfigController.deleteUser);

export default router;