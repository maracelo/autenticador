const phoneInput = document.querySelector('#input_verification_code');

const pattenMask = IMask(phoneInput, {
    mask: '000000'
})