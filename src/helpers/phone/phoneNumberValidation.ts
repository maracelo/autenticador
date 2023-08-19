import validator from 'validator';

function phoneNumberValidation(phone: string){
    const sanitizedPhone = validator.whitelist(phone, '1234567890');

    if(sanitizedPhone.length === 11) return sanitizedPhone; // Padrão brasileiro (XX)9XXXX-XXXX

    else return false;
}

export default phoneNumberValidation;