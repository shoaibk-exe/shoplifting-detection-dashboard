
export const forgottenPassword = async (email: string) => {
    try {
        const res = await fetch("/api/forgot-password/reset", {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const { message } = await res.json();
        return {
            status: res.status,
            message: message
        }
    } catch (error: any) {
        return {
            status: 500,
            message: "Please Try again later!"
        }
    }
}

export const verifyToken = async (token: string) => {
    try {
        const res = await fetch(`/api/forgot-password/verify-token`, {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        const { message, user } = await res.json();
        return {
            message: message,
            status: res.status,
            user: user
        }
    } catch (error: any) {
        return {
            message: "Please Try again Later",
            status: 500,
        }
    }
};

export const updatePassword = async (user: { email: string, newPassword: string, ReNewPassword: string }) => {
    try {
        const res = await fetch(`/api/forgot-password/update`, {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                password: user.newPassword,
                confirmPassword: user.ReNewPassword
            })
        });
        const { message } = await res.json();
        return {
            message: message,
            status: res.status,
        }
    } catch (error: any) {
        return {
            message: "Please Try again Later",
            status: 500,
        }
    }
}