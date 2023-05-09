import { Router } from "express";
import * as LoginController from "../controllers/LoginController";
import * as HomeController from "../controllers/HomeController";
import passport from "../config/passport";

const router = Router();

router.get('/login', LoginController.login);
router.post('/login', LoginController.login);
router.get('/register', LoginController.register);
router.post('/register', LoginController.register);
router.get('/logout', LoginController.logout);

router.get('/', passport.authenticate('jwt', { session: false }), HomeController.home);

export default router;