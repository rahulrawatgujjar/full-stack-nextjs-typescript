import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";


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

  // const userId = user._id;
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: { _id: userId }
      },
      {
        $unwind: "$messages"
      },
      {
        $sort: { "messages.createdAt": -1 }
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } }
      }
    ]);

    if (!user || user.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "User not found"
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: true,
      message: "Messages found successfully",
      messages: user[0].messages
    };
    return NextResponse.json(response, { status: 200 });



  } catch (error) {
    // console.log("Error in getting messages", error);
    const response: ApiResponse = {
      success: false,
      message: "Error in getting messages"
    };
    return NextResponse.json(response, { status: 500 });

  }
}