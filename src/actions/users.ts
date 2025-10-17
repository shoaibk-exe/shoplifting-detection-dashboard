
import { Users } from "@/types/Users";
export const RegisterUser = async (data: Users) => {
    try {
        const res = await fetch('/api/users', {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            next: { revalidate: 0 },
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
export const deleteUser = async (id: string) => {
    try {
        const res = await fetch(`/api/users`, {
            cache: 'no-store',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            next: { revalidate: 0 },
            body: JSON.stringify({id})
        })
        const resData = await res.json();
        return { ...resData, status: res.status }; // { message: 'User deleted successfully', status: 200 }
    } catch (error) {
        console.log(error);
        return {
            message: 'Something went wrong!',
            status: 500,
        }
    } 
}
export const UpdateUser = async (id: string, data: any) => { // Accept 'data' as a parameter
    try {
        const res = await fetch('/api/users', {  // Correctly use the user id in the API endpoint
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, data }) // Pass the data to the body
        });
        const resData = await res.json();
        return { ...resData, status: res.status };
    } catch (error) {
        return {
            message: 'Something went wrong!',
            status: 500,
        }
    }
}


// // actions/users.ts
// export const GetUserById = async (id: string) => {
//     try {
//         const response = await fetch(`/api/users/${id}`);
//         const data = await response.json();
        
//         if (!response.ok) {
//             throw new Error(data.message || 'Failed to fetch user');
//         }
        
//         return { data, error: null };
//     } catch (error) {
//         return { data: null, error: error };
//     }
// };
// "use server";
// import { prisma } from "@/libs/prismaDb";
// import { isAuthorized } from "@/libs/isAuthorized";
// import bcrypt from "bcrypt";
// export async function getUsers(filter?: any) {
//     const currentUser = await isAuthorized();

//     const res = await prisma.user.findMany({
//         where: {
//             role: filter,
//         },
//     });

//     const filtredUsers = res.filter(
//         (user) =>
//             user.email !== currentUser?.email && !user.email?.includes("demo-"),
//     );

//     return filtredUsers;
// }

// export async function updateUser(data: any) {
//     const { email } = data;
//     return await prisma.user.update({
//         where: {
//             email: email.toLowerCase(),
//         },
//         data: {
//             email: email.toLowerCase(),
//             ...data,
//         },
//     });
// }

// export async function deleteUser(user: any) {
//     if (user?.email?.includes("demo-")) {
//         return new Error("Can't delete demo user");
//     }

//     if (!user) {
//         return new Error("User not found");
//     }

//     return await prisma.user.delete({
//         where: {
//             email: user?.email.toLowerCase() as string,
//         },
//     });
// }

// export async function serchUser(email: string) {
//     return await prisma.user.findUnique({
//         where: {
//             email: email.toLowerCase(),
//         },
//     });
// }


