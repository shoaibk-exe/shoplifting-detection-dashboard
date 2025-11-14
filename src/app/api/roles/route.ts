import { NextRequest, NextResponse } from "next/server";
import { createUserRole } from "@/helper/createUserRole";
import { prisma } from "@/libs/prismaDb";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, description, permissions } = body;

        if (!name || !permissions) {
            return NextResponse.json(
                { message: "Role name and permissions are required" },
                { status: 400 }
            );
        }

        // Check if role already exists
        const roleExist = await prisma.role.findFirst({
            where: {
                name: name.toLowerCase(),
            },
        });

        if (roleExist !== null) {
            return NextResponse.json(
                { message: "Role already exists. Please change the role name!" },
                { status: 400 }
            );
        }

        // Create role
        await prisma.role.create({
            data: {
                name: name.toLowerCase(),
                description: description || null,
                permissions: permissions,
                role: createUserRole(name),
            },
        });

        return NextResponse.json(
            { message: "Role created successfully!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating role:", error);
        return NextResponse.json(
            { message: "Role creation failed, Please try again!" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const roles = await prisma.role.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(
            { roles, message: "Roles fetched successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching roles:", error);
        return NextResponse.json(
            { message: "Roles fetching failed, Please try again!", roles: [] },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.id) {
            return NextResponse.json(
                { message: 'Role id is required' },
                { status: 400 }
            );
        }

        // Validate ID is a number
        const roleId = typeof body.id === 'number' ? body.id : parseInt(body.id);
        if (isNaN(roleId)) {
            return NextResponse.json(
                { message: 'Invalid role ID format' },
                { status: 400 }
            );
        }

        // Check if role exists
        const roleExists = await prisma.role.findUnique({
            where: { id: roleId },
        });

        if (!roleExists) {
            return NextResponse.json(
                { message: 'Role not found' },
                { status: 404 }
            );
        }

        const updateData: any = {};

        if (body.data.name) {
            updateData.name = body.data.name.toLowerCase();
            updateData.role = createUserRole(body.data.name);
        }
        if (body.data.description !== undefined) {
            updateData.description = body.data.description;
        }
        if (body.data.permissions !== undefined) {
            updateData.permissions = body.data.permissions;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { message: "No fields to update" },
                { status: 400 }
            );
        }

        await prisma.role.update({
            where: {
                id: roleId,
            },
            data: updateData,
        });

        return NextResponse.json(
            { message: "Role updated successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating role:", error);
        return NextResponse.json(
            { message: "Role update failed, Please try again!" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { message: 'Role id is required' },
                { status: 400 }
            );
        }

        // Validate and parse role ID
        const roleId = parseInt(id);
        if (isNaN(roleId)) {
            return NextResponse.json(
                { message: 'Invalid role ID format' },
                { status: 400 }
            );
        }

        // Check if role is being used by any user
        const usersWithRole = await prisma.user.findFirst({
            where: {
                roleId: roleId,
            },
        });

        if (usersWithRole) {
            return NextResponse.json(
                { message: 'Cannot delete role. It is assigned to one or more users.' },
                { status: 400 }
            );
        }

        await prisma.role.delete({
            where: {
                id: roleId,
            },
        });

        return NextResponse.json(
            { message: 'Role deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting role:", error);
        return NextResponse.json(
            { message: 'Failed to delete role' },
            { status: 500 }
        );
    }
}
