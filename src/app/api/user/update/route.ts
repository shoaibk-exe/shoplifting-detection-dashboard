import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { email, name, profilePicture } = body;

		const session = await getServerSession(authOptions);
		const updateData: { [key: string]: any } = {};

		const isDemo = session?.user?.email?.includes("demo-");

		if (!session?.user) {
			return NextResponse.json(
				{ message: "User not found!" },
				{ status: 401 }
			);
		}

		if (body === null) {
			return NextResponse.json(
				{ message: "Missing Fields" },
				{ status: 400 }
			);
		}

		if (isDemo) {
			return NextResponse.json(
				{ message: "Can't update demo user" },
				{ status: 401 }
			);
		}

		if (name) {
			updateData.name = name;
		}

		if (email) {
			updateData.email = email.toLowerCase();
		}

		if (profilePicture !== undefined) {
			updateData.profilePicture = profilePicture || null;
		}

		if (Object.keys(updateData).length === 0) {
			return NextResponse.json(
				{ message: "No fields to update" },
				{ status: 400 }
			);
		}

		const user = await prisma.user.update({
			where: {
				email: session?.user?.email as string,
			},
			data: updateData,
		});

		revalidatePath("/user");

		// Remove password from response
		const { password: _, ...safeUser } = user;

		return NextResponse.json(
			{
				email: safeUser.email,
				name: safeUser.name,
				profilePicture: safeUser.profilePicture,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating user:", error);
		return NextResponse.json(
			{ message: "Something went wrong", error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}
