import generateToken from '../../helpers/generateToken';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

describe('Test generateToken', () =>{
    
    it('Should make a token', async () =>{
        const data = {test: 'testing'};
        const exp = 100000;
    
        const token = await generateToken(data, exp);
        const result = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    
        expect(Object.keys(result).sort()).toStrictEqual(["exp", "iat", "test"].sort());
    });
    
    it('Should return an empty string', async () =>{
        const data = '';
    
        expect(await generateToken(data, 0)).toBe('');
    })
});