import { Roles } from "@/types/Roles";
export const AddRole = async (data: Roles) => {
    try {
        const res = await fetch('/api/roles', {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const resData = await res.json();
        return { ...resData, status: res.status };
    } catch (error) {
        console.log(error);
        return {
            message: 'Something went wrong!',
            status: 500,
        }
    }
}
export const UpdateRole = async (data: Roles, id: string) => {
    try {
        const res = await fetch('/api/roles', {
            cache: 'no-store',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data, id })
        })
        const resData = await res.json();
        return { ...resData, status: res.status };
    } catch (error) {
        console.log(error);
        return {
            message: 'Something went wrong!',
            status: 500,
        }
    }
}
export const deleteRole = async (id: string) => {
    try {
        const res = await fetch(`/api/roles`, {
            cache: 'no-store',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
        const resData = await res.json();
        return { ...resData, status: res.status };
    } catch (error) {
        console.log(error);
        return {
            message: 'Something went wrong!',
            status: 500,
        }
    }
}