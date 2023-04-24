import express from "express";
import dotenv from "dotenv";
import path from "path";
import mustache from "mustache-express";
import MainRoutes from "./routes/index";

dotenv.config();

const server = express();

server.set('view engine', 'mustache');
server.set('views', path.join(__dirname, 'views'));
server.engine('mustache', mustache());

server.use(express.static( path.join(__dirname, '../public') ));

server.use(MainRoutes);

server.use((req, res) =>{
    res.status(404).send('<h1>404</h1>');
});

server.listen(process.env.PORT, () =>{
    console.log(
        `listening port ${process.env.PORT}, link: http://localhost:3000`
    );
});