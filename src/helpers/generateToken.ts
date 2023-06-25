import JWT from 'jsonwebtoken';

function generateToken(data: any, functionLocation : string){
    // console.log(`${functionLocation}, ${JSON.stringify(data)}`);

    try{
        return JWT.sign(data, process.env.JWT_SECRET_KEY as string)
    }catch(err){
        console.log(err);
        return '';
    }
}

export default generateToken;