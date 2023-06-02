const inputName = document.querySelector('input[name=name]') ?? undefined;
const inputEmail = document.querySelector('input[name=email]') ?? undefined;
const inputSub = document.querySelector('input[name=sub]') ?? undefined;
const button = document.querySelector('button') ?? undefined;

const type = window.location.pathname;

function getGoogleUserInfo({ credential }){
    
    if(!credential) return alert('Erro! Tente novamente mais tarde');

    const { name, email, email_verified, sub } = jwt_decode(credential);

    if(!email_verified) return alert('Esta conta não tem E-mail verificado');
    
    if(!name, !email, !sub) return alert('Erro! Tente novamente mais tarde');

    sendSSOUserInfo({ name, email, sub });
}

function getFacebookUserInfo(){
    let status = 'unknown';

    FB.getLoginStatus(function (response){
        if(!response || !response.status) return alert('Erro! Tente novamente mais tarde');

        status = response.status;
    });

    switch(status){
        case 'unknown':
            return alert('Usuário não está lougado no Facebook');
        break;
        case 'not_authorized':
            return alert('Usuário não tem permissão');
        break;
        case 'connected':
            FB.api('/me', {fields: ['id', 'name', 'email'] }, function(response) {
    
                if(!response || !response.id || !response.name || !response.email){
                    return alert('Erro! Tente novamente mais tarde');
                } 
                const {id, name, email} = response;

                sendSSOUserInfo({ name, email, sub: id });
            });
        break;
    }
}

function sendSSOUserInfo(user){
    if(!inputName || !inputEmail || !inputSub) return alert('Erro no Site');

    if(!user || !user.name || !user.email || !user.sub){
        return alert('Informações faltando. Tente novamente mais tarde');
    } 

    switch(type){
        case '/login':
            inputEmail.value = user.email;
            inputSub.value = user.sub;
            button.click();
        break;
        case '/register':
            inputName.value = user.name;
            inputEmail.value = user.email;
            inputSub.value = user.sub;
            button.click();
        break;
        default:
            alert('Erro no Site');
        break;
    }
}