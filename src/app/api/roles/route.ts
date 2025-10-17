import { NextRequest, NextResponse } from "next/server"; 
import { createUserRole } from "@/helper/createUserRole"; 
import { prisma } from "@/libs/prismaDb";
export async function POST(req: NextRequest) {
    const body = await req.json();
    let message = "Role is Created Successfully!";
    let status = 200;
    try { 
        const roleExist = await prisma.role.findFirst({
            where: {
                name: body.name.toLowerCase(),
            },
        });
        if (roleExist !== null) {
            return NextResponse.json({ message: "Role already exists. Please change the role name!" }, { status: 400 });
        }
        await prisma.role.create({
            data: {
                name: body.name.toLowerCase(),
                description: body.description,
                permissions: body.permissions,
                role: createUserRole(body.name),
            },
        });
    } catch (error) {
        console.log(error);
        message = "Role creation Failed, Please try again!";
        status = 500;
    }

    // try {
    //     const adminNameExist = await RoleModel.findOne({ name: body.name });
    //     if (adminNameExist !== null) {
    //         message = "Role name already exist!";
    //         status = 409
    //     } else {
    //         await RoleModel.insertOne({ ...body, role: createUserRole(body.name) });
    //     }
    // } catch (error) {
    //     console.log(error);
    //     message = "Role creation Failed, Please try again!";
    //     status = 500;
    // }
    return NextResponse.json({ message }, { status });
}

export async function GET(req: NextRequest) {
    let message = "Roles fetched successfully!";
    let status = 200;
    let roles;
    try {
        // roles = await RoleModel.find({}).toArray();
        roles = await prisma.role.findMany();
    } catch (error) {
        console.log(error);
        message = "Roles fetching Failed, Please try again!";
        status = 500;
    }
    return NextResponse.json({ roles, message }, { status });
}
export async function PUT(req: NextRequest) {
    let message = "Roles Update successfully!";
    let status = 200;
    const body = await req.json();
    try {
        await prisma.role.update({
            where: {
                id: body.id,
            },
            data: {
                ...body.data,
                role: createUserRole(body.data.name)
            },
        });
    } catch (error) {
        console.log(error);
        message = "Roles fetching Failed, Please try again!";
        status = 500;
    }
    return NextResponse.json({ message }, { status });
}
// export async function DELETE(req: NextRequest) {
//     let message = "Roles fetched successfully!";
//     let status = 200;
//     let roles;
//     try {
//         roles = await RoleModel.find({}).toArray();
//     } catch (error) {
//         console.log(error);
//         message = "Roles fetching Failed, Please try again!";
//         status = 500;
//     }
//     return NextResponse.json({ roles, message }, { status });
// }

export async function DELETE(req: NextRequest) {
    try {
        // const searchParams = req.nextUrl.searchParams;
        // const id = searchParams.get('id');
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ message: 'Role id is required' }, { status: 400 });
        }

        await prisma.role.delete({
            where: {
                id: parseInt(id),
            },
        });


        return NextResponse.json({ message: 'Role deleted successfully' }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ message: 'Failed to delete role', error: 'An unknown error occurred' }, { status: 500 });
    }
}