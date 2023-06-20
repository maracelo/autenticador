import nodemailer from 'nodemailer';
import TokenDataType from "../types/TokenDataType";
import generateToken from './generateToken';

async function sendEmailVerification(user: TokenDataType){

    const token = generateToken({ name: user.name, email: user.email });

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: { user: "5e8f596b37f011", pass: "5bb30ff5c1369d" }
    });

    const html = buildHTML(token);    

    try{
        transport.sendMail({
            from: 'noreply@test.com',
            to: 'test@test.test',
            subject: 'Verificação de email',
            html
        });
    }catch(err){
        console.log(err);
        return 'Error ao tentar enviar';
    }
}

function buildHTML(token: string){
    let html = '<!DOCTYPE html>'
    html += '<html lang="pt-BR" style="width: 100%; height: 100%;">'
    html += '<head>'
    html += '<meta charset="UTF-8"/>'
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>'
    html += '<title>Confirme seu E-mail</title>'
    html += '</head>'
    html += '<body style="overflow: hidden; background-color: #489dec; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">'
    html += '<div style="background-color: #ddd; width: fit-content; height: fit-content; max-width: 600px; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: 20px;/*  border: 4px solid #fff;">'
    html += '<h1 style="margin: 0; font-size: 40px; color: #489dec;">Clique no botão ou copie o link <br/> <span style="color: #aaa;">para confirmar seu E-mail</span></h1>'
    html += '<a href="http://localhost:3000/confirmemail/?confirm=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJpYXQiOjE2ODcyMjQzNzF9.V9JIW5aVdelmzbEyaCoq7bZvYhXfJaalMfR37rZYaag" target="_blank" style="background-color: #489dec; margin: 40px 0; padding: 20px; font-size: 20px; color: #fff; text-decoration: none;">Confirmar E-mail &#x1F448</a>'
    html += '<div style="width: 100%; overflow-wrap: break-word;">'
    html += '<a href="http://localhost:3000/confirmemail/?confirm=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJpYXQiOjE2ODcyMjQzNzF9.V9JIW5aVdelmzbEyaCoq7bZvYhXfJaalMfR37rZYaag" target="_blank" style="font-size: 18px; color: #1D3461;">http://localhost:3000/confirmemail/?confirm=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJpYXQiOjE2ODcyMjQzNzF9.V9JIW5aVdelmzbEyaCoq7bZvYhXfJaalMfR37rZYaag</a>'
    html += '</div>'
    html += '</div>'
    html += '</body>'
    html += '</html>'

    return html;
}

export default sendEmailVerification;