import changeName from "../../../helpers/config/changeName";
import { UserInstance } from "../../../models/User";

it('Should message has been sent', () =>{
    const email = 'test2';
    const user = {
        id: 1,
        name: 'test1',
        email: 'test@test.test1',
        password: '',
        update(...info: any){
            info
        }
    } as any as UserInstance;

    const result = changeName(email, user);
});

// TODO