import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { UserInstance } from "../models/User";
import validatePassword from "../helpers/login/validatePassword";
import changeConfig from "../helpers/config/changeConfig";

dotenv.config();

export async function config(req: Request, res: Response){
    let messages: string[] = ['Nada Alterado'];
    let errMessages: undefined|string[];
    
    const user = res.locals.user as UserInstance;
    
    if(req.body && Object.keys(req.body).length > 0){
    
        const response = await changeConfig(user, req.body);

        if(response?.messages) messages = response.messages;

        if(response?.errMessages) errMessages = response.errMessages;
    }

    res.json({ messages, errMessages });
}

export async function deleteUser(req: Request, res: Response){
    const password = await req.body.password

    if(!password && validatePassword(password)) return res.status(400).json({ errMessage: 'Senha incorreta' });
    
    const user = res.locals.user as UserInstance;
    
    const permission = await bcrypt.compare(password, user.password);

    if(!permission) return res.json({ errMessage: 'Senha incorreta' });

    await user.destroy();

    res.json({ success: 'Usuário deletado com sucesso' });
}