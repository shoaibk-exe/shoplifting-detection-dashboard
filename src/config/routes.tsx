export const routes = {
    auth: {
        signUp: '/auth/signUp',
        signIn: '/auth/signin',
        forgotPassword1: '/auth/forgot-password-1',
        otp1: '/auth/otp-1',
    },
    signIn: '/signin',
    users: {
        AddUsers: '/users/add',
        ListOfUsers: '/users/list',
    },
    Roles: {
        AddRoles: '/roles/add',
        ListOfRoles: '/roles/list',
    },
    Camera: {
        AddCamera: '/manage-devices/add',
        ListOfCameras: '/manage-devices',
    },
    LiveCameras: {
        Add: '/live-cameras/add',
        View: '/live-cameras/view',
    }
};
