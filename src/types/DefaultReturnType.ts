type DefaultReturnType = void | { 
    message?: string | string[];
    user?: {
        name: string;
        email: string;
        verified_email: boolean;
        password?: string;
        sub?: string;
    }
};

export default DefaultReturnType;