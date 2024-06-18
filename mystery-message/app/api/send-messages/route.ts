import UserModel, { Message } from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";


export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { username, content }: { username: string, content: string } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: "User not found"
      };
      return NextResponse.json(response, { status: 400 });
    }


    if (!user.isAcceptingMessage) {
      const response: ApiResponse = {
        success: false,
        message: "User is not accepting messages"
      };
      return NextResponse.json(response, { status: 400 });
    }

    const newMessage = {
      content,
      createdAt: new Date()
    }

    user.messages.push(newMessage as Message);
    await user.save();

    const response: ApiResponse = {
      success: true,
      message: "Message sent successfully"
    };
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.log("Error in sending messages", error);
    const response: ApiResponse = {
      success: false,
      message: "Error in sending messages"
    };
    return NextResponse.json(response, { status: 500 });
  }
}