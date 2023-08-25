import dotenv from 'dotenv';

dotenv.config();

export function buildVerificationHtml(token: string){
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
    html += `<a href="${process.env.SITE_URL}/confirmemail/?confirm=${token}" style="background-color: #489dec; padding: 20px; font-size: 20px; color: #fff; text-decoration: none;">Confirmar E-mail &#x1F448</a>`;
    html += '<div style="margin-top: 40px; width: 100%;">';
    html += `<a href="${process.env.SITE_URL}/confirmemail/?confirm=${token}" style="font-size: 18px; color: #1D3461; word-wrap: break-word;">${process.env.SITE_URL}/confirmemail/?confirm=${token}</a>`;
    html += '</div>';
    html += '</td>';
    html += '</tr>';
    html += '</tbody>';
    html += '</table>';
    html += '</body>';
    html += '</html>';

    return html;
}

export function buildChangeVerificationHtml(confirmToken: string, refuseToken: string){
    let html = '<html style="width: 100%; height: 100%;">';
    html += '<head>';
    html += '<meta charset="UTF-8"/>';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>';
    html += '<title>Pedido de Mudança de Email</title>';
    html += '</head>';
    html += '<body style="background-color: #489dec; width: 100%; height: 100%;">';
    html += '<table align="center" border="0" style="max-height: 400px; height: 100%;">';
    html += '<tbody style="height: 100%;">';
    html += '<tr style="height: 100%;">';
    html += '<td style="background-color: #ddd; max-width: 800px; vertical-align: center; padding: 20px">';
    html += '<h1 style="margin-bottom: 40px; font-size: 40px; color: #489dec;">Clique no botão ou copie o link <br/> <span style="color: #aaa;">para confirmar a mudança de E-mail</span></h1>';
    html += `<a href="${process.env.SITE_URL}/confirm_changeemail/?confirm=${confirmToken}" style="background-color: #489dec; padding: 20px; font-size: 20px; color: #fff; text-decoration: none;">Confirmar mudança de E-mail &#x1F448</a>`;
    html += '<div style="margin-top: 40px; width: 100%;">';
    html += `<a href="${process.env.SITE_URL}/confirm_changeemail/?confirm=${confirmToken}" style="font-size: 18px; color: #1D3461; word-wrap: break-word;">${process.env.SITE_URL}/changeemail/?confirm=${confirmToken}</a>`;
    html += '</div>';
    html += '<h1 style="margin-bottom: 40px; font-size: 40px; color: #489dec;">Se não foi você, <br/> <span style="color: #aaa;">clique no botão a baixo</span></h1>';
    html += `<a href="${process.env.SITE_URL}/refuse_changeemail/?refuse=${refuseToken}" style="background-color: #f00; padding: 20px; font-size: 20px; color: #fff; text-decoration: none;">Cancelar mudança de E-mail &#x1F448</a>`;
    html += '<div style="margin-top: 40px; width: 100%;">';
    html += `<a href="${process.env.SITE_URL}/refuse_changeemail/?refuse=${refuseToken}" style="font-size: 18px; color: #1D3461; word-wrap: break-word;">${process.env.SITE_URL}/changeemail/?refuse=${refuseToken}</a>`;
    html += '</div>';
    html += '</td>';
    html += '</tr>';
    html += '</tbody>';
    html += '</table>';
    html += '</body>';
    html += '</html>';

    return html;
}