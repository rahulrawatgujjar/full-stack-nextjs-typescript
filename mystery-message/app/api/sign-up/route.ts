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

    const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });

    if (existingUserVerifiedByUsername) {
      const response: ApiResponse = {
        success: false,
        message: "Username already taken"
      }
      return NextResponse.json(response, { status: 400 });
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 1);

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();



    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        const response: ApiResponse = {
          success: false,
          message: "User already exists with this email"
        };
        return NextResponse.json(response, { status: 400 });
      } else {
        existingUserByEmail.username = username;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;
        await existingUserByEmail.save();
      }
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: []
      });
      await newUser.save();
    }

    // send verification email

    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode
    );

    console.log("\nemailResponse:",emailResponse); // remove it

    if (!emailResponse.success) {
      const response: ApiResponse = {
        success: false,
        message: emailResponse.message
      };
      return NextResponse.json(response, { status: 500 });
    }
    else {
      const response: ApiResponse = {
        success: true,
        message: "User registered successfully. Please verify your email."
      };
      return NextResponse.json(response, { status: 200 });
    }


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