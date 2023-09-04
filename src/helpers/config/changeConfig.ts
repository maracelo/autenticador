import { UserInstance } from "../../models/User";
import changeName from "./changeName";
import changeEmail from "./changeEmail";
import changePassword from "./changePassword";

type Config = {
    name?: string,
    email?: string,
    new_password?: string,
    current_password?: string
}

async function changeConfig(user: UserInstance, newInfo: Config){
    const changesRes = [];
    let {name, email, new_password, current_password} = newInfo;

    if(name && name !== user.name) changesRes.push( await changeName(name, user) );

    if(email) changesRes.push( await changeEmail(email, user) );

    if(new_password) changesRes.push( await changePassword(new_password, user, current_password) );

    if(changesRes) return handleMessages(changesRes);
}

function handleMessages(services: any){
    let messages = [];
    let errMessages = [];

    for(let service of services){
        if(service?.message) messages.push(service.message);
        if(service?.errMessage) errMessages.push(service.errMessage);
    }

    return { messages, errMessages };
}

export default changeConfig;