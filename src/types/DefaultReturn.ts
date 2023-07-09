type DefaultReturn = {
    message?: string | string[];
    user?: {
        id?: number;
        name: string;
        email: string;
        verified_email: boolean;
        phone?: string;
        password?: string;
        sub?: string;
    }
}

export default DefaultReturn;