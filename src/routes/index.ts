import { Router } from "express";
import * as LoginController from "../controllers/LoginController";
import * as HomeController from "../controllers/HomeController";

const router = Router();

router.get('/login', LoginController.login);
router.get('/register', LoginController.register);
router.get('/logout', LoginController.logout);

router.get('/', HomeController.home);

export default router;