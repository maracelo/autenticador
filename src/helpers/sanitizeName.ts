import validator from 'validator';

function sanitizeName(name: string): string{
    return validator.blacklist(name, '<>&\'"/');
}

export default sanitizeName;