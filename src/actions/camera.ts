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



export const RegisterCamera = async (data: any) => {
    try {
        const res = await fetch('/api/cameras', {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const resData = await res.json();
        return { ...resData, status: res.status };
    } catch (error) {
        console.log(error);
        return {
            message: 'Something went wrong!',
            status: 500,
        };
    }
}
export const deleteCamera = async (id: string) => {
    try {
        const res = await fetch(`/api/cameras`, {
            cache: 'no-store',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });

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

export const getCamera = async (filters?: any) => {
    let url = `/api/cameras?`
    if (filters.videoRecording) {
        url += `videoRecording=${filters.videoRecording}&`
    }
    if (filters.anomaly_logs) {
        url += `anomaly_logs=${filters.anomaly_logs}&`
    }
    try {
        const res = await fetch(url, {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            next: { revalidate: 0 },
        })
        const resData = await res.json();
        return { ...resData, status: res.status };
    } catch (error) {
        console.log(error);
        return {
            message: 'Something went wrong!',
            status: 500,
        };
    }
};

export const UpdateCamera = async (id: string, data: any) => {
    try {
        const res = await fetch('/api/cameras', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, data })
        });
        const resData = await res.json();
        return { ...resData, status: res.status };
    } catch (error) {
        return {
            message: 'Something went wrong!',
            status: 500,
        };
    }
};
