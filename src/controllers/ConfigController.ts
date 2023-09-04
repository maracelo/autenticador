import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { UserInstance } from "../models/User";
import validatePassword from "../helpers/login/validatePassword";
import changeConfig from "../helpers/config/changeConfig";

dotenv.config();

export async function config(req: Request, res: Response){
    let messages: string[] = ['Nada Alterado'];
    let errMessages: string[] = [];
    
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
    const errMessage = 'Senha incorreta';

    if(!password && validatePassword(password)) return res.status(401).json({ errMessage });
    
    const user = res.locals.user as UserInstance;
    
    const permission = await bcrypt.compare(password, user.password);

    if(!permission) return res.status(401).json({ errMessage });

    try{
        await user.destroy();
    }catch(err){
        return res.status(500).json({ errMessage: 'Erro no Sistema! Tente novamente mais tarde' });
    }
    
    res.json({ success: 'Usuário deletado com sucesso' });
}