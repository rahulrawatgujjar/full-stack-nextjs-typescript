import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";


export async function POST(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user;

  if (!session || !user) {
    const response: ApiResponse = {
      success: false,
      message: "Not authenticated"
    }
    return NextResponse.json(response, { status: 500 })
  }

  const userId = user._id;
  const { acceptMessages: isAcceptingMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId,
      {
        $set: {
          isAcceptingMessage
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      const response: ApiResponse = {
        success: false,
        message: "Error while updating message acceptence status"
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse = {
      success: true,
      message: "Message acceptance status updated successfully",
      data: updatedUser
    };
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.log("Error while updating message acceptence status", error);
    const response: ApiResponse = {
      success: false,
      message: "Error while updating message acceptence status"
    };
    return NextResponse.json(response, { status: 500 });

  }
}


export async function GET(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user;

  if (!session || !user) {
    const response: ApiResponse = {
      success: false,
      message: "Not authenticated"
    }
    return NextResponse.json(response, { status: 500 })
  }

  const userId = user._id;

  try {

    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      const response: ApiResponse = {
        success: false,
        message: "User not found"
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: true,
      message: "Message status is known successfully",
      isAcceptingMessage: foundUser.isAcceptingMessage
    };
    return NextResponse.json(response, { status: 200 });


  } catch (error) {
    console.log("Error while checking message acceptence status", error);
    const response: ApiResponse = {
      success: false,
      message: "Error while checking message acceptence status"
    };
    return NextResponse.json(response, { status: 500 });
  }

}