import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: "User not found"
      };
      return NextResponse.json(response, { status: 400 });
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = user.verifyCodeExpiry > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      const response: ApiResponse = {
        success: true,
        message: "User verified successfullly"
      };
      return NextResponse.json(response, { status: 200 });
    }
    else if (!isCodeNotExpired) {
      const response: ApiResponse = {
        success: false,
        message: "Verification code has expired, please signup again to get new code"
      };
      return NextResponse.json(response, { status: 400 });
    }
    else {
      const response: ApiResponse = {
        success: false,
        message: "Incorrect verification code"
      };
      return NextResponse.json(response, { status: 400 });
    }


  } catch (error) {
    console.log("Error while verifying code", error);
    const response: ApiResponse = {
      success: false,
      message: "Error while verifying code"
    }
    return NextResponse.json(response, { status: 500 })
  }

}