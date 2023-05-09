import express from "express";
import dotenv from "dotenv";
import path from "path";
import mustache from "mustache-express";
import MainRoutes from "./routes/index";
import { sequelize } from "./instances/mysql";
import session from "express-session";
import cors from 'cors';

dotenv.config();

const app = express();

app.use( cors() );

const sessionSecret = process.env.SESSION_SECRET_KEY as string;

app.use(session({secret: sessionSecret}));

app.use( express.urlencoded({ extended: true }) );
app.use( express.static(path.join(__dirname, '../public')) );

app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.engine('mustache', mustache());

app.use(MainRoutes);

app.use((req, res) =>{
    res.status(404).send('<h1>404</h1>');
});

app.listen(process.env.PORT, () =>{
    console.log(
        `listening port ${process.env.PORT}, link: http://localhost:3000`
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