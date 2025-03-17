import User from "@models/User";
import dbConnect from "@utils/dbConnect";
import { NextResponse } from "next/server";
import { cache } from "react";

export const POST = cache(async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await dbConnect();
    const { badges } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { badges: badges },
      { new: true }
    );

    return NextResponse.json(
      { message: "Badges updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update badges" },
      { status: 500 }
    );
  }
}); 