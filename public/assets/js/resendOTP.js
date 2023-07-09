const resendButton = document.querySelector('#resend');
const otpIdInput = document.querySelector('#otp_id');

resendButton.addEventListener('click', async () =>{

    if(otpIdInput.value){
        let response = await axios({
            method: 'POST',
            url: 'http://localhost:3000/resendotp',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: { otp_id: otpIdInput.value }
        });

        if(response.data.new_otp_id){
            otpIdInput.value = response.new_otp_id;
            alert('Código foi reenviado. Próximo só em 1min!');
        } 
            
        if(response.data.message) alert(response.message);
    }
});