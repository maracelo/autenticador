const inputName = document.querySelector('input[name=name]') ?? undefined;
const inputEmail = document.querySelector('input[name=email]') ?? undefined;
const inputSub = document.querySelector('input[name=sub]') ?? undefined;
const button = document.querySelector('button') ?? undefined;

let type = 'login';

async function getGoogleUserInfo( {credential} ){
    if(credential && inputEmail && inputSub && button){
        const { name, email, email_verified, sub } = jwt_decode(credential);

        if(!email_verified) alert('Esta conta não tem E-mail verificado');

        switch(type){
            case 'login':
                inputEmail.value = email;
                inputSub.value = sub;
                button.click();
            break;
            case 'register':
                inputName.value = name;
                inputEmail.value = email;
                inputSub.value = sub;
                button.click();
            break;
            default:
                alert('Erro no Sistema')
            break;
        }
    }else{
        alert('Preencha todos os campos');
    }
}