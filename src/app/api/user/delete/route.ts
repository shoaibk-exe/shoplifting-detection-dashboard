import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function DELETE(request: Request) {
	try {
		const body = await request.json();
		const { email } = body;

		if (!email) {
			return NextResponse.json(
				{ message: "Missing Fields" },
				{ status: 400 }
			);
		}

		const session = await getServerSession(authOptions);
		const formatedEmail = email.toLowerCase();

	const user = await prisma.user.findUnique({
		where: {
			email: formatedEmail,
		},
		include: {
			role: true,
		},
	});

		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		const isOthorized = session?.user?.email === email || user?.role?.role === "ADMIN" || user?.role?.role === "SUPERADMIN";

		if (!isOthorized) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const isDemoUser = user?.email?.includes("demo-");

		if (isDemoUser) {
			return NextResponse.json(
				{ message: "Can't delete demo user" },
				{ status: 401 }
			);
		}

		await prisma.user.delete({
			where: {
				email: formatedEmail,
			},
		});

		return NextResponse.json(
			{ message: "Account deleted successfully!" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting user:", error);
		return NextResponse.json(
			{
				message: "Something went wrong",
				error: error instanceof Error ? error.message : "Unknown error"
			},
			{ status: 500 }
		);
	}
}
