// import { sequelize } from "./instances/mysql";
import { sequelize } from "../instances/postgre";

async function dbConnection(){
    try{
        await sequelize.authenticate();
        console.log('Conexão com o banco');
    }catch(error){
        console.error('Não conectado ao banco: ', error);
    } 
}

export default dbConnection;