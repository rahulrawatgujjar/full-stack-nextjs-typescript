import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";


const UsernameQuerySchema = z.object({
  username: usernameValidation
})


export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      username: searchParams.get("username")
    };

    // validation with zod
    const result = UsernameQuerySchema.safeParse(queryParams);
    console.log("result:\n", result); // TODO: remove

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      const response: ApiResponse = {
        success: false,
        message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters"
      }
      return NextResponse.json(response, { status: 400 });
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

    if (existingVerifiedUser) {
      const response: ApiResponse = {
        success: false,
        message: "Username already taken"
      }
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: true,
      message: "Username is available"
    }
    return NextResponse.json(response, { status: 200 });



  } catch (error) {
    console.log("Error checking username", error);

    const response: ApiResponse = {
      success: false,
      message: "Error checking username"
    };

    return NextResponse.json(response, { status: 500 });
  }
}