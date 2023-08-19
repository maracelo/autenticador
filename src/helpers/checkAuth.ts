import { User, UserInstance } from "../models/User";

type CheckAuthReturn = {
    user?: UserInstance;
    errMessage?: string;
}

async function checkAuth(id: any): Promise<CheckAuthReturn>{
    const errMessage = 'Session inválida. Faça seu login em /login';

    if(!id) return { errMessage };

    const user = await User.findOne({ where: {id} });

    if(!user) return { errMessage };

    return { user };
}

export default checkAuth;