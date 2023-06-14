import validator from 'validator';

function sanitizeName(name: string){
    return validator.blacklist(name, '<>&\'"/');
}

export default sanitizeName;