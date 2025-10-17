import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
	const body = await request.json();
	const { token } = body;
	if (!token) {
		return NextResponse.json({ message: "Missing Fields" }, { status: 400 });
	}
	const user = await prisma.user.findFirst({
		where: {
			passwordResetToken: token,
			passwordResetTokenExp: {
				gte: new Date(),
			},
		},
	});
	if (!user) {
		return NextResponse.json({ message: "Invalid Link or Link Expired" }, { status: 400 });
	}
	return NextResponse.json({ user, message: "Please Enter Your new Password!" }, { status: 200 });
};