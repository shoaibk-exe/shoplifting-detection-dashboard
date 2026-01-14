import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const users = await prisma.user.findMany({
			include: {
				role: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		// Remove password from response
		const safeUsers = users.map(({ password, ...user }) => user);

		return NextResponse.json(safeUsers, { status: 200 });
	} catch (error) {
		console.error("Error fetching users:", error);
		return NextResponse.json(
			{ message: "Something went wrong", users: [] },
			{ status: 500 }
		);
	}
}
