import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { clean } from "@/helper/clearEmptyUndefinedNullfields";
import { prisma } from "@/libs/prismaDb";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            email,
            password,
            role,
            name,
            phoneNumber,
            status,
            profilePicture,
        } = body;

        // Validate required fields
        if (!email || !password || !name || !phoneNumber || !status || !role) {
            return NextResponse.json(
                { message: 'All required fields are missing: email, password, name, phoneNumber, status, and role' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Invalid email format. Please enter a valid email address.' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const userExist = await prisma.user.findFirst({
            where: {
                email: email.toLowerCase(),
            },
        });

        if (userExist !== null) {
            return NextResponse.json(
                { message: 'User already exists!' },
                { status: 400 }
            );
        }

        // Validate and parse role ID
        const roleId = parseInt(role);
        if (isNaN(roleId)) {
            return NextResponse.json(
                { message: 'Invalid role ID format' },
                { status: 400 }
            );
        }

        // Verify role exists
        const roleExists = await prisma.role.findUnique({
            where: { id: roleId },
        });

        if (!roleExists) {
            return NextResponse.json(
                { message: 'Invalid role ID' },
                { status: 400 }
            );
        }

        // Hash password and create user
        const hashPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashPassword,
                name: name,
                phoneNumber: phoneNumber,
                status: status,
                roleId: roleId,
                profilePicture: profilePicture || null,
            },
        });

        return NextResponse.json(
            { message: 'User created successfully!' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            {
                message: 'Failed to create user',
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const users = await prisma.user.findMany({
            include: {
                role: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Remove password from response
        const safeUsers = users.map(({ password, ...user }) => user);

        return NextResponse.json({ users: safeUsers }, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { message: 'Failed to fetch users', users: [] },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { message: 'User id is required' },
                { status: 400 }
            );
        }

        // Validate ID is a number
        const userId = typeof id === 'number' ? id : parseInt(id);
        if (isNaN(userId)) {
            return NextResponse.json(
                { message: 'Invalid user ID format' },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        await prisma.user.delete({
            where: {
                id: userId,
            },
        });

        return NextResponse.json(
            { message: 'User deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { message: 'Failed to delete user' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const data = clean(body.data);

        if (!body.id) {
            return NextResponse.json(
                { message: 'User id is required' },
                { status: 400 }
            );
        }

        // Validate ID is a number
        const userId = typeof body.id === 'number' ? body.id : parseInt(body.id);
        if (isNaN(userId)) {
            return NextResponse.json(
                { message: 'Invalid user ID format' },
                { status: 400 }
            );
        }

        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!userExists) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        delete data.confirmPassword;

        // Build update object with only valid fields
        const updateData: any = {};

        if (data.email) {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                return NextResponse.json(
                    { message: 'Invalid email format. Please enter a valid email address.' },
                    { status: 400 }
                );
            }
            
            // Check if email is already taken by another user
            const emailExists = await prisma.user.findFirst({
                where: {
                    email: data.email.toLowerCase(),
                    id: { not: userId },
                },
            });

            if (emailExists) {
                return NextResponse.json(
                    { message: 'Email already exists. Please use a different email address.' },
                    { status: 400 }
                );
            }
            
            updateData.email = data.email.toLowerCase();
        }
        if (data.name) {
            updateData.name = data.name;
        }
        if (data.phoneNumber) {
            updateData.phoneNumber = data.phoneNumber;
        }
        if (data.status) {
            updateData.status = data.status;
        }
        if (data.profilePicture !== undefined) {
            updateData.profilePicture = data.profilePicture || null;
        }
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        if (data.role) {
            // Validate and parse role ID
            const roleId = parseInt(data.role);
            if (isNaN(roleId)) {
                return NextResponse.json(
                    { message: 'Invalid role ID format' },
                    { status: 400 }
                );
            }

            // Verify role exists
            const roleExists = await prisma.role.findUnique({
                where: { id: roleId },
            });

            if (!roleExists) {
                return NextResponse.json(
                    { message: 'Invalid role ID' },
                    { status: 400 }
                );
            }

            updateData.roleId = roleId;
        }

        await prisma.user.update({
            where: {
                id: userId
            },
            data: updateData,
        });

        return NextResponse.json(
            { message: 'User updated successfully!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { message: 'Failed to update user' },
            { status: 500 }
        );
    }
}
