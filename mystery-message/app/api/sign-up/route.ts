import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { ApiResponse } from "@/types/ApiResponse";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();


  } catch (error) {

    console.log("Error while registering user", error);

    const response: ApiResponse = {
      success: false,
      message: "Error registering user"
    }

    return NextResponse.json(response, {
      status: 500
    });

  }
}