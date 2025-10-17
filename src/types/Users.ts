export interface Users {
    id?: string;
    name: string;
    email: string;
    password: string;
    role: string;
    phoneNumber: string;
    profilePicture: string;
    status: string;
    confirmPassword: string;
    actions?: any;
    roleId?: string;
}