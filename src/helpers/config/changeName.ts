import { UserInstance } from "../../models/User";

async function changeName(name: string, user: UserInstance){
    await user.update({ name });
    return { message: 'Nome mudado' };
}

export default changeName;