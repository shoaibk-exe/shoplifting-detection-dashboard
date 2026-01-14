import bcrypt from "bcrypt";
import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { email, password, currentPassword } = body;

		if (!email || !password || !currentPassword) {
			return NextResponse.json(
				{ message: "Missing required fields: email, password, and currentPassword" },
				{ status: 400 }
			);
		}

		const formatedEmail = email.toLowerCase();

		const user = await prisma.user.findUnique({
			where: {
				email: formatedEmail,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		// Check if passwords match
		const passwordMatch = await bcrypt.compare(
			currentPassword,
			user.password
		);

		if (!passwordMatch) {
			return NextResponse.json(
				{ message: "Incorrect current password!" },
				{ status: 400 }
			);
		}

		const isDemo = user.email?.includes("demo-");

		if (isDemo) {
			return NextResponse.json(
				{ message: "Can't change password for demo user" },
				{ status: 401 }
			);
		}

		// Validate new password strength (optional - basic check)
		if (password.length < 6) {
			return NextResponse.json(
				{ message: "Password must be at least 6 characters long" },
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.user.update({
			where: {
				email: formatedEmail,
			},
			data: {
				password: hashedPassword,
			},
		});

		return NextResponse.json(
			{ message: "Password updated successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error changing password:", error);
		return NextResponse.json(
			{
				message: "Something went wrong",
				error: error instanceof Error ? error.message : "Unknown error"
			},
			{ status: 500 }
		);
	}
}
