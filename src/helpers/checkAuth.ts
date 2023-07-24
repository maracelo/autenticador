import { User, UserInstance } from "../models/User";
import decodeJWT from "./decodeJWT";

type CheckAuthReturn = {
    user: null | UserInstance;
    redirect: '' | 'login' | 'logout';
}

async function checkAuth(token: any): Promise<CheckAuthReturn>{
    let user: null | UserInstance = null;

    if(!token) return { user, redirect: 'login' };

    const json = await decodeJWT(token);

    if(!json) return { user, redirect: 'logout' };

    user = await User.findOne({ where: {id: json.id} });

    if(!user) return { user, redirect: 'logout' };

    return { user, redirect: ''};
}

export default checkAuth;