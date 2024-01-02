import changeEmail from "../../../helpers/config/changeEmail";
import { User, UserInstance } from "../../../models/User";
import { ChangeEmail } from "../../../models/ChangeEmail";

jest.mock("../../../models/User");
jest.mock("../../../models/ChangeEmail");

describe('Test changeEmail', () =>{
    const email = 'maraceloaugust@gmail.com';
    const user = {
        id: 1,
        email: 'test@test.test'
    } as any as UserInstance;

    it('Should send email warning notification', async () =>{
        
        (User.findOne as jest.Mock).mockResolvedValue(false);
        (ChangeEmail.create as jest.Mock).mockResolvedValue(true);
        (ChangeEmail.findOne as jest.Mock).mockResolvedValue(true);

        const result = await changeEmail(email, user, User, ChangeEmail);

        expect(result).toStrictEqual({ message: 'Mensagem enviada para seu E-mail Atual' });
    })

    it('Should return invalid email error', async () =>{
        const emptyEmail = '';
        
        (User.findOne as jest.Mock).mockResolvedValue(false);
        (ChangeEmail.create as jest.Mock).mockResolvedValue(true);
        (ChangeEmail.findOne as jest.Mock).mockResolvedValue(true);

        const result = await changeEmail(emptyEmail, user, User, ChangeEmail);

        expect(result).toStrictEqual({ errMessage: 'E-mail inválido' });
    });

    it('Should return email already exists', async () =>{

        (User.findOne as jest.Mock).mockResolvedValue(true);
        (ChangeEmail.create as jest.Mock).mockResolvedValue(false);
        (ChangeEmail.findOne as jest.Mock).mockResolvedValue(false);

        const result = await changeEmail(email, user, User, ChangeEmail);

        expect(result).toStrictEqual({ errMessage: 'E-mail já cadastrado' });
    });

    it('Should return email system error', async () =>{

        (User.findOne as jest.Mock).mockResolvedValue(false);
        (ChangeEmail.create as jest.Mock).mockRejectedValue(Error('Mock error'));
        (ChangeEmail.findOne as jest.Mock).mockResolvedValue(false);

        const result = await changeEmail(email, user, User, ChangeEmail);

        expect(result).toStrictEqual({ errMessage: 'Erro no sistema' });
    });

    it('Should return change was not requested', async () =>{

        (User.findOne as jest.Mock).mockResolvedValue(false);
        (ChangeEmail.create as jest.Mock).mockResolvedValue(true);
        (ChangeEmail.findOne as jest.Mock).mockResolvedValue(false);

        const result = await changeEmail(email, user, User, ChangeEmail);

        expect(result).toStrictEqual({ errMessage: 'Troca de E-mail não foi solicitada' });
    });

});