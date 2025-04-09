import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Webhook received");

  try {
    const body = await req.json();
    console.log("Webhook body:", body);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.log("Error parsing webhook body:", error);
    return NextResponse.json(
      { error: "Error parsing webhook body" },
      { status: 500 }
    );
  }
}
