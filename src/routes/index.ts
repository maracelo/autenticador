import { Router } from "express";
import * as LoginController from "../controllers/LoginController"

const router = Router();

router.get('/login', LoginController.login);
router.get('/register', LoginController.register);
router.get('/logout', LoginController.logout);

export default router;