import bcrypt from "bcrypt";
import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, email, password, phoneNumber } = body;

		if (!name || !email || !password) {
			return NextResponse.json(
				{ message: "Missing required fields: name, email, password" },
				{ status: 400 }
			);
		}

		const formatedEmail = email.toLowerCase();

		// Check if user already exists
		const exist = await prisma.user.findUnique({
			where: {
				email: formatedEmail,
			},
		});

		if (exist) {
			return NextResponse.json(
				{ message: "Email already exists" },
				{ status: 400 }
			);
		}

		// Find default user role or create one if it doesn't exist
		let userRole = await prisma.role.findFirst({
			where: {
				name: 'user',
			},
		});

		// If user role doesn't exist, create it with basic permissions
		if (!userRole) {
			userRole = await prisma.role.create({
				data: {
					name: 'user',
					description: 'Standard user with read permissions',
					permissions: ['Read_Users'],
					role: 'USER',
				},
			});
		}

		const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

		// Function to check if an email is in the list of admin emails
		function isAdminEmail(email: string) {
			return adminEmails.includes(email);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		// Find admin role if admin email
		let roleId = userRole.id;
		if (isAdminEmail(formatedEmail)) {
			const adminRole = await prisma.role.findFirst({
				where: {
					name: 'admin',
				},
			});
			if (adminRole) {
				roleId = adminRole.id;
			}
		}

		// Create user with required fields
		const user = await prisma.user.create({
			data: {
				name,
				email: formatedEmail,
				password: hashedPassword,
				phoneNumber: phoneNumber || '+0000000000',
				status: 'Active',
				roleId: roleId,
			},
		});

		// Remove password from response
		const { password: _, ...safeUser } = user;

		return NextResponse.json(safeUser, { status: 201 });
	} catch (error) {
		console.error("Error registering user:", error);
		return NextResponse.json(
			{ message: "Something went wrong", error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}
