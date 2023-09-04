import validator from "validator";

function validatePassword(password: string): boolean{
    return validator.matches(
        password, 
        /^(?=.*[0-9])(?=.*['";:/><)(}{!@#$%^&*_-])[a-zA-Z0-9'";:/><)(}{!@#$%^&*_-]{8,100}$/g
    );
}

export default validatePassword;