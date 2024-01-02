import checkAuth from "../../helpers/checkAuth";
import { User } from "../../models/User";

jest.mock("../../models/User");

describe('Test checkAuth', () =>{

    it('Should return user', async () =>{
        const user = {
            id: 1,
            name: 'test'
        };

        (User.findOne as jest.Mock).mockResolvedValue(user);
    
        const result = await checkAuth(user.id, User);
    
        expect(result).toStrictEqual({user});
    });

    describe('Should return errMessage', () =>{
        const errMessage = 'Session inválida. Faça seu login em /login';

        test('User not found', async () =>{
            (User.findOne as jest.Mock).mockResolvedValue(null);
    
            const result = await checkAuth(1, User);
    
            expect(result).toStrictEqual({errMessage});
        });

        test('Invalid id', async () =>{
            (User.findOne as jest.Mock).mockResolvedValue(null);
    
            const result = await checkAuth(null, User);
    
            expect(result).toStrictEqual({errMessage});
        });

        test('Database Error', async () =>{
            (User.findOne as jest.Mock).mockRejectedValue(Error('Mock error'));
    
            const result = await checkAuth(1, User);
    
            expect(result).toStrictEqual({errMessage: 'Erro no sistema'});
        });
    });
});