import { Dialect, Sequelize } from "sequelize";

type dbInfo = { tool: Dialect, name: string, user: string, password: string, port: string, url: string };

function setSequelize(dbInfo: dbInfo){
    const env = process.env.NODE_ENV;

    if(env === 'production'){
        try{
            return new Sequelize(dbInfo.url);
        }catch(err){
            throw Error('Alguma variável de ambiente não preenchida');
        }
    }
    
    try{
        return new Sequelize(
            dbInfo.name,
            dbInfo.user,
            dbInfo.password,
            {
                dialect: dbInfo.tool, port: parseInt(dbInfo.port)
            }
        );
    }catch(err){
        throw Error('Alguma variável de ambiente não preenchida');
    }
}

export default setSequelize;