import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import genFunc from "connect-pg-simple";
import MainRoutes from "./routes/index";
// import { sequelize } from "./instances/mysql";
import { sequelize } from "./instances/postgre";
import cors from 'cors';

dotenv.config();

const app = express();

app.use( cors() );

const PostgresStore = genFunc(session);
const sessionStore = new PostgresStore({ conString: process.env.POSTGRES_URL as string });

app.use(session({
    secret: process.env.SESSION_SECRET as string, 
    resave: true, 
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 604800000 }
}));

declare module 'express-session' {
    interface SessionData {
        userId: any;
    }
}

app.use( express.urlencoded({ extended: true }) );
app.use( express.static(path.join(__dirname, '../public')) );

app.use(MainRoutes);

app.use((req: Request, res: Response) =>{
    res.status(404).json({ errMessage: 'Página não encontrada' });
});

app.listen(process.env.PORT, () =>{
    console.log(
        `listening port ${process.env.PORT}, link: ${process.env.SITE_URL}`
    );
});

(async () =>{
    try{
        await sequelize.authenticate();
        console.log('Conexão com o banco');
    }catch(error){
        console.error('Não conectado ao banco: ', error);
    } 
})();