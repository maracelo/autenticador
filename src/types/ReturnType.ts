type ReturnType = undefined | {
    message?: string|string[];
    user?: { email: string; name: string; password?: string; sub?: string; }
};

export default ReturnType;