type ReturnType = undefined | {
    message?: string|string[];
    user?: { 
        name: string;
        email: string;
        phone?: string;
        password?: string;
        sub?: string;
    }
};

export default ReturnType;