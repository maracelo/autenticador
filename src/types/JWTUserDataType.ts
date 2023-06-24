type JWTUserDataType = { 
    name: string, 
    email: string, 
    phone?: string;
    verified_email: boolean;
    phone_auth: 'pending' | 'pending_phone' | 'approved' | null;
}

export default JWTUserDataType;