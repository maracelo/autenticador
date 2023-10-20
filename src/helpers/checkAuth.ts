import { UserInstance } from "../models/User";

type CheckAuthReturn = Promise<{ user?: UserInstance, errMessage?: string }>;

async function checkAuth(id: any, User: any): CheckAuthReturn{
    const errMessage = 'Session inválida. Faça seu login em /login';

    if(!id || typeof(id) !== 'number') return { errMessage };

    try{
        const user = await User.findOne({ where: {id} });
        if(!user) return { errMessage };
        return { user };
    }catch(err){
        console.log(err);
        return { errMessage: 'Erro no sistema' };
    }
}

export default checkAuth;