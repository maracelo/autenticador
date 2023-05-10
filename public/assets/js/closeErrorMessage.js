const messageXButton = document.querySelectorAll('.message p') || undefined;

if(messageXButton){
    messageXButton.forEach(xButton => {
        xButton.addEventListener('click', e =>{
            e.target.closest('.message').remove();
        });
    })
}