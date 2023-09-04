import { User, UserInstance } from "../../models/User";
import decodeToken from "./decodeToken";

type confirmValidation = Promise<{ errMessage?: string, content?: any, user?: UserInstance }>;

async function checkToken(confirmToken: any): confirmValidation{
    const content: any = await decodeToken(confirmToken);
    const errMessage: string = 'Token inválido';

    if(!content) return { errMessage };

    const user = await User.findOne({ where: {id: content.id} });

    if(!user) return { errMessage };

    return { content, user };
}

export default checkToken;