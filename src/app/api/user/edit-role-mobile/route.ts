import { auth } from "@/src/auth";
import connectDb from "@/src/lib/db";
import User from "@/src/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    // 🔐 Auth check
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { role, mobile } = await req.json();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { role, mobile },
      { new: true } // ✅ updated doc return
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Update profile error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
