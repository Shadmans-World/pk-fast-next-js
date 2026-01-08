import connectDb from "@/src/lib/db";
import User from "@/src/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
try {
    await connectDb();
    const {name,email,password,mobile} = await req.json();

    const existUser = await User.findOne({email});
    if(existUser){
        return NextResponse.json(
            {message:"Email already exist"},
            {status:400}
        )
    }
    if(password.length <6){
        return NextResponse.json(
            {message:"Password must be at least 6 character"},
            {status:400}
        )
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
        name,email,password:hashedPassword,mobile
    })

   const userObj = user.toObject();
   const {password:any ,...userWithoutPassword} = userObj;
    return NextResponse.json(
           userWithoutPassword,
            {status:200}
        )

} catch (error) {
    return NextResponse.json(
            {message:`Register error ${error}`},
            {status:500}
        )
}
}


// connect to db
// name, email, password frontend
// email check
// password 6 character
// password hashed by bcrypt
// user create