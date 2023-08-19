import { Request, Response } from "express";

export async function home(req: Request, res: Response){
    res.json({ success: 'Você está autorizado a acessar a página Home' });
}