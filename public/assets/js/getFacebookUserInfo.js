const fInputName = document.querySelector('input[name=name]') ?? undefined;
const fInputEmail = document.querySelector('input[name=email]') ?? undefined;
const fInputSub = document.querySelector('input[name=sub]') ?? undefined;
const fButton = document.querySelector('button') ?? undefined;

let fType = window.location.pathname;

window.fbAsyncInit = function(){
    FB.init({
        appId            : '576559401283179',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v17.0'
    });
};

function getFacebookUserInfo(){
    let status = 'unknown';

    FB.getLoginStatus(function (response){
        if(response) status = response.status;

        else return alert('Erro! Tente novamente mais tarde');
    });

    if(status === 'unknown') return alert('Usuário não está lougado no Facebook');

    else if(status === 'not_authorized') return alert('Usuário não tem permissão');

    else if(status === 'connected'){

        FB.api('/me', {fields: ['id', 'name', 'email'] }, function(response) {
    
            if(!response || !response.id || !response.name || !response.email){
                return alert('Erro! Tente novamente mais tarde');
            } 

            const {id, name, email} = response;

            switch(fType){
                case '/login':
                    fInputEmail.value = email;
                    fInputSub.value = id;
                    fButton.click();
                break;
                case '/register':
                    fInputName.value = name;
                    fInputEmail.value = email;
                    fInputSub.value = id;
                    fButton.click();
                break;
                default:
                    alert('Erro no Sistema');
                break;
            }
            return;
        });

    }else{
        alert('Erro no Sistema');
    }
}