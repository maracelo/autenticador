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
    let html = '<html style="width: 100%; height: 100%;">';
    html += '<head>';
    html += '<meta charset="UTF-8"/>';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>';
    html += '<title>Confirme seu E-mail</title>';
    html += '</head>';
    html += '<body style="background-color: #489dec; width: 100%; height: 100%;">';
    html += '<table align="center" border="0" style="max-height: 400px; height: 100%;">';
    html += '<tbody style="height: 100%;">';
    html += '<tr style="height: 100%;">';
    html += '<td style="background-color: #ddd; max-width: 600px; vertical-align: center; padding: 20px">';
    html += '<h1 style="margin-bottom: 40px; font-size: 40px; color: #489dec;">Clique no botão ou copie o link <br/> <span style="color: #aaa;">para confirmar seu E-mail</span></h1>';
    html += '<a href="http://localhost:3000/confirmemail/?confirm=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJpYXQiOjE2ODcyMjQzNzF9.V9JIW5aVdelmzbEyaCoq7bZvYhXfJaalMfR37rZYaag" style="background-color: #489dec; padding: 20px; font-size: 20px; color: #fff; text-decoration: none;">Confirmar E-mail &#x1F448</a>';
    html += '<div style="margin-top: 40px; width: 100%;">';
    html += '<a href="http://localhost:3000/confirmemail/?confirm=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJpYXQiOjE2ODcyMjQzNzF9.V9JIW5aVdelmzbEyaCoq7bZvYhXfJaalMfR37rZYaag" style="font-size: 18px; color: #1D3461; word-wrap: break-word;">http://localhost:3000/confirmemail/?confirm=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJpYXQiOjE2ODcyMjQzNzF9.V9JIW5aVdelmzbEyaCoq7bZvYhXfJaalMfR37rZYaag</a>';
    html += '</div>';
    html += '</td>';
    html += '</tr>';
    html += '</tbody>';
    html += '</table>';
    html += '</body>';
    html += '</html>';

    return html;
}

export default sendEmailVerification;