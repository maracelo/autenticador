const messageXButton = document.querySelectorAll('.msg p') || undefined;

if(messageXButton){
    messageXButton.forEach(xButton => {
        xButton.addEventListener('click', e =>{
            e.target.closest('.msg').remove();
        });
    })
}