import changePassword from "../../../helpers/config/changePassword";
import bcrypt from 'bcrypt';
import { UserInstance } from "../../../models/User";

describe('Test changePassword', () =>{
    const current_password = 'Test#122';
    const user = {
        password: null,
        update(field: any){
            this.password = field.password;
        }
    } as any as UserInstance;

    beforeEach(async () =>{
        user.password = await bcrypt.hash(current_password, 8);
    });

    describe('It should change password', () =>{

        test('Valid password', async () =>{
            const new_password = 'Test#123';
            const result = await changePassword(new_password, user, current_password);
            
            expect(result).toStrictEqual({ message: 'Senha mudada' });
            expect(await bcrypt.compare(new_password, user.password)).toBe(true);
        });
    
        it('Sould add a new password', async () =>{
            const new_password = 'Test#123';
            const userSub = Object.assign({}, user);
            userSub.sub = 'test';
            userSub.password = '';
            const result = await changePassword(new_password, userSub);
    
            expect(result).toStrictEqual({ message: 'Senha mudada' });
            expect(await bcrypt.compare(new_password, user.password));
        });
    });
    
    
    describe('It should not change password', () =>{
        const errMessage = 'Senha ou senhas precisam ser preenchidas corretamente ' + 
        '(com no mínimo 8 caracteres, letra maiúscula e minúcula, número e caractere especial)';

        test('Password empty string', async () =>{
            const new_password = '';
            const result = await changePassword(new_password, user, current_password);
    
            expect(result).toStrictEqual({ errMessage });
            expect(await bcrypt.compare(new_password, user.password)).toBe(false);
        });
        
        test('Invalid password', async () =>{
            const new_password = 'Test';
            const result = await changePassword(new_password, user, current_password);
    
            expect(result).toStrictEqual({ errMessage });
            expect(await bcrypt.compare(new_password, user.password)).toBe(false);
        });
    });
});