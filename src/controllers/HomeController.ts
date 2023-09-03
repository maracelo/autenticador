import { Request, Response } from "express";
import { UserInstance } from "../models/User";

export async function home(req: Request, res: Response){
    const user = res.locals.user as UserInstance;

    res.json({ success: `${user.name}(${user.email}) está autorizado a acessar a Home` });
}