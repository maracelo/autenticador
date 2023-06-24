type DefaultReturnType = void | { 
    message?: string | string[];
    user?: {
        id?: number;
        name: string;
        email: string;
        verified_email: boolean;
        password?: string;
        sub?: string;
        phone?: string;
    }
};

export default DefaultReturnType;