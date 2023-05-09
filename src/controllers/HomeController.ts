import { Request, Response } from "express";

export function home(req: Request, res: Response){
    

    res.render('home', {
        title: 'Home',
        pagecss: 'home.css',
        user: {
            name: 'mara',
        }
    });
}