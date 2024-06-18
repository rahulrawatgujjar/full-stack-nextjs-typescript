import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";


export async function DELETE(request: NextRequest, { params }: { params: { messageid: string } }) {
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

  const messageId = params.messageid;

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      const response: ApiResponse = {
        success: false,
        message: "Message not found or already deleted"
      }
      return NextResponse.json(response, { status: 400 });
    } else {
      const response: ApiResponse = {
        success: true,
        message: "Message deleted successfully"
      }
      return NextResponse.json(response, { status: 200 });
    }

  } catch (error) {
    // console.log("Error in deleting message", error);
    const response: ApiResponse = {
      success: false,
      message: "Error in deleting message"
    };
    return NextResponse.json(response, { status: 500 });
  }
}