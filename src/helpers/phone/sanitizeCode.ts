import validator from "validator";

function sanitizeCode(code: any){
    const newCode = validator.whitelist(code, '1234567890');
    
    if(newCode && newCode.length === 6) return newCode;

    return;
}

export default sanitizeCode;