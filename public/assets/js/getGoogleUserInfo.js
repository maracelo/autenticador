const gInputName = document.querySelector('input[name=name]') ?? undefined;
const gInputEmail = document.querySelector('input[name=email]') ?? undefined;
const gInputSub = document.querySelector('input[name=sub]') ?? undefined;
const gButton = document.querySelector('button') ?? undefined;

const gType = window.location.pathname;

async function getGoogleUserInfo( {credential} ){
    if(credential && inputEmail && inputSub && gButton){
        const { name, email, email_verified, sub } = jwt_decode(credential);

        if(!email_verified) alert('Esta conta não tem E-mail verificado');

        switch(type){
            case '/login':
                inputEmail.value = email;
                inputSub.value = sub;
                gButton.click();
            break;
            case '/register':
                inputName.value = name;
                inputEmail.value = email;
                inputSub.value = sub;
                gButton.click();
            break;
            default:
                alert('Erro no Sistema');
            break;
        }
        return;
    }else{
        alert('Preencha todos os campos');
    }
}