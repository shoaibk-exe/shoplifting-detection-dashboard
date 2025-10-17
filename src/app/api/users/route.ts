import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { createUserRole, reverseCreateUserRole } from "@/helper/createUserRole";
import { clean } from "@/helper/clearEmptyUndefinedNullfields";
import { prisma } from "@/libs/prismaDb";
import { sendMessage } from "@/actions/message.action";
export async function POST(req: NextRequest) {
    const body = await req.json();
    const {
        email,
        password,
        role,
    } = body;
    delete body.confirmPassword;
    const userExist = await prisma.user.findFirst({
        where: {
            email: email.toLowerCase(),
        },
    });
    if (userExist !== null) {
        return NextResponse.json({ message: 'User Already Exist!' }, { status: 400 });
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                ...body,
                role: {
                    connect: {
                        id: parseInt(role),
                    }
                },
                email: email.toLowerCase(),
                password: hashPassword,
            },
        });

        return NextResponse.json({ message: 'User created successfully!' }, { status: 200 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: 'Failed to create user', error: "Error" }, { status: 500 });
    }






    // try {
    //     // Hash the password
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const hashedconfirmPassword = await bcrypt.hash(confirmPassword, 10);
    //     // Create a new user
    //     const newUser = {
    //         ...body,
    //         email: email?.toLowerCase(),
    //         password: hashedPassword,
    //         confirmPassword: hashedconfirmPassword,
    //     };
    //     const savedUser = await UserModel.insertOne(newUser);
    //     return NextResponse.json({ message: 'User created successfully!', user: savedUser }, { status: 200 });
    // } catch (error) {
    //     return NextResponse.json({ message: 'Failed to create user', error: "Error" }, { status: 500 });
    // }
}
export async function GET(req: NextRequest) {
    let filters = {}
    // await sendMessage("HELLO");
    // const users = await UserModel.aggregate([
    //     {
    //         $match: filters
    //     },
    //     {
    //         $lookup: {
    //             from: "roles", // Collection name where the user get its roles
    //             localField: "role",
    //             foreignField: "role",
    //             as: "role"
    //         },
    //     },
    //     {
    //         $project: {
    //             password: 0,
    //             confirmPassword: 0,
    //         }
    //     },
    // ]).toArray();
    const users = await prisma.user.findMany({
        where: filters,
        include: {
            role: true
        }
    })
    return NextResponse.json({ users }, { status: 200 });
}
export async function DELETE(req: NextRequest) {
    const { id } = await req.json();
    let status = 200;
    let message = "User deleted successfully";
    if (!id) {
        return NextResponse.json({ message: 'User id is required' }, { status: 400 });
    }
    try {
        await prisma.user.delete({
            where: {
                id: id,
            },
        });
        // await UserModel.deleteOne({ _id: new ObjectId(id) });
    } catch (error: unknown) {
        message = 'Failed to delete user';
        status = 500;
    }
    return NextResponse.json({ message }, { status });
}
export async function PUT(req: NextRequest) {
    let message = "User Update successfully!";
    let status = 200;
    const body = await req.json();
    const data = clean(body.data)
    delete data.confirmPassword;
    const updated_object = {
        ...data
    }
    if (data?.password) {
        updated_object.password = await bcrypt.hash(data.password, 10);
    }
    // if (data?.role && data?.role !== "") {
    //     updated_object.role = createUserRole(data.role);
    // }
    try {
        // await UserModel.updateOne({ _id: new ObjectId(`${body.id}`) }, {
        //     $set: {
        //         ...updated_object
        //     }
        // });
        await prisma.user.update({
            where: {
                id: body.id
            },
            data: {
                ...updated_object,
                role: {
                    connect: {
                        id: parseInt(updated_object.role),
                    }
                },
                email: updated_object.email.toLowerCase(),
            },
        });
    } catch (error) {
        message = "User fetching Failed, Please try again!";
        status = 500;
    }
    return NextResponse.json({ message }, { status });
}





// import { NextResponse, NextRequest } from "next/server";
// import { UserModel } from "@/libs/db/AllModels";
// import bcrypt from "bcrypt";
// import { connectToDb } from "@/libs/db/DbConnect";
// import { ObjectId } from "mongodb";
// import { createUserRole, reverseCreateUserRole } from "@/helper/createUserRole";
// import { clean } from "@/helper/clearEmptyUndefinedNullfields";
// import createMysqlConnection from "@/libs/db/MySQLdb";
// export async function GET(req: NextRequest) {
//     const db = await createMysqlConnection();


//     // const body = await req.json();
//     // const {
//     //     email,
//     //     password,
//     //     confirmPassword,
//     // } = body;
//     const name = "Syed Usama";
//     const email = "syedusama076@gmail.com";
//     const password = "Admin1234";
//     const confirmPassword = "Admin1234";

//     if (!email || !password || !confirmPassword) {
//         return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
//     }



//     const lowerCaseEmail = email.toLowerCase();
//     try {
//         const [user] = await db.execute(`SELECT * FROM users WHERE email = ?`, [lowerCaseEmail]);

//         console.log(user);
//         if (user.length > 0) {
//             return NextResponse.json({ message: 'User Already Exist!' }, { status: 400 });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const role = createUserRole("admin");
//         const roleId = 1;
//         const query = `INSERT INTO users (name, email, password, role, roleId) VALUES (?, ?, ?, ?, ?)`;
//         const [result] = await db.execute(query, [name, email, hashedPassword, role, roleId]);
//         console.log(result);
//         return NextResponse.json({ message: 'User created successfully!' }, { status: 201 });




//     } catch (error) {
//         console.log(error);
//     }

//     return NextResponse.json({}, { status: 200 });

//     // const userAlreadyExist = await UserModel.findOne({ email: email?.toLowerCase() });
//     // if (userAlreadyExist) {
//     //     return NextResponse.json({ message: 'User Already Exist!' }, { status: 400 });
//     // }
//     // try {
//     //     // Hash the password
//     //     const hashedPassword = await bcrypt.hash(password, 10);
//     //     const hashedconfirmPassword = await bcrypt.hash(confirmPassword, 10);
//     //     // Create a new user
//     //     const newUser = {
//     //         ...body,
//     //         email: email?.toLowerCase(),
//     //         password: hashedPassword,
//     //         confirmPassword: hashedconfirmPassword,
//     //     };
//     //     const savedUser = await UserModel.insertOne(newUser);
//     //     return NextResponse.json({ message: 'User created successfully!', user: savedUser }, { status: 200 });
//     // } catch (error) {
//     // return NextResponse.json({ message: 'Failed to create user', error: "Error" }, { status: 500 });
//     // }
// }
// // export async function GET(req: NextRequest) {
// //     let filters = {}
// //     const users = await UserModel.aggregate([
// //         {
// //             $match: filters
// //         },
// //         {
// //             $lookup: {
// //                 from: "roles", // Collection name where the user get its roles
// //                 localField: "role",
// //                 foreignField: "role",
// //                 as: "role"
// //             },
// //         },
// //         {
// //             $project: {
// //                 password: 0,
// //                 confirmPassword: 0,
// //             }
// //         },
// //     ]).toArray();
// //     return NextResponse.json({ users }, { status: 200 });
// // }
// export async function DELETE(req: NextRequest) {
//     const searchParams = req.nextUrl.searchParams;
//     const id = searchParams.get('id');
//     let status = 200;
//     let message = "User deleted successfully";
//     if (!id) {
//         return NextResponse.json({ message: 'User id is required' }, { status: 400 });
//     }
//     try {
//         await UserModel.deleteOne({ _id: new ObjectId(id) });
//     } catch (error: unknown) {
//         message = 'Failed to delete user';
//         status = 500;
//     }
//     return NextResponse.json({ message }, { status });
// }
// export async function PUT(req: NextRequest) {
//     let message = "User Update successfully!";
//     let status = 200;
//     const body = await req.json();
//     const data = clean(body.data)
//     const updated_object = {
//         ...data
//     }
//     if (data?.password && data?.confirmPassword) {
//         updated_object.password = await bcrypt.hash(data.password, 10);
//         updated_object.confirmPassword = await bcrypt.hash(data.confirmPassword, 10);
//     }
//     if (data?.role && data?.role !== "") {
//         updated_object.role = createUserRole(data.role);
//     }
//     try {
//         await UserModel.updateOne({ _id: new ObjectId(`${body.id}`) }, {
//             $set: {
//                 ...updated_object
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         message = "User fetching Failed, Please try again!";
//         status = 500;
//     }
//     return NextResponse.json({ message }, { status });
// }


// // export async function GET(req: NextRequest) {
// //     let users = [] as any;
// //     const db = await createMysqlConnection();
// //     const query = `SELECT * FROM users`;
// //     const [user] = await db.query(query);
// //     users = user;


// //     return NextResponse.json({ users }, { status: 200 });
// // }