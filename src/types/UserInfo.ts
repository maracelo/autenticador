type UserInfo = undefined | {
    name?: string;
    email: string;
    phone?: string;
    password?: string;
    password_confirmation?: string;
    sub?: string;
}

export default UserInfo;