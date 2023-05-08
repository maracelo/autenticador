import { Router } from "express";
import * as LoginController from "../controllers/LoginController";
import * as HomeController from "../controllers/HomeController";
import { privateRoute } from "../config/passport";

const router = Router();

router.get('/login', LoginController.login);
router.get('/register', LoginController.register);
router.get('/logout', LoginController.logout);

router.get('/', privateRoute, HomeController.home);

export default router;