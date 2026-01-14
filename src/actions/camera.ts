// import { isEmpty } from "@/helper/isEmpty";

// export const CameraRegister = async (data: any) => {
//     if (isEmpty(data)) {
//         return {
//             message: 'Please fill all the fields!',
//             status: 400,
//         }
//     }
//     try {
//         const res = await fetch('/api/cameras', {
//             cache: 'no-store',
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             next: { revalidate: 0 },
//             body: JSON.stringify(data)
//         })
//         const resData = await res.json();
//         return { ...resData, status: res.status };
//     } catch (error) {
//         console.log(error);
//         return {
//             message: 'Something went wrong!',
//             status: 500,
//         }
//     }
// }

'use server'

// Register new camera
export const RegisterCamera = async (data: any) => {
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/cameras`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return { status: response.status, message: result.message };
    } catch (error) {
        console.error('Error registering camera:', error);
        return { status: 500, message: 'Failed to register camera' };
    }
}

// Update existing camera
export const UpdateCamera = async (data: { id: string; data: any }) => {
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/cameras`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: data.id,
                data: data.data
            }),
        });

        const result = await response.json();
        return { status: response.status, message: result.message };
    } catch (error) {
        console.error('Error updating camera:', error);
        return { status: 500, message: 'Failed to update camera' };
    }
}

// Delete camera
export const deleteCamera = async (id: string) => {
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/cameras`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });

        const result = await response.json();
        return { status: response.status, message: result.message };
    } catch (error) {
        console.error('Error deleting camera:', error);
        return { status: 500, message: 'Failed to delete camera' };
    }
}