import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Validate environment variable
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error(
        "REPLICATE_API_TOKEN environment variable not configured"
      );
    }

    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    // Parse and validate form data
    const formData = await request.formData();
    const input = {
      fileKey: formData.get("fileKey") as string,
      modelName: formData.get("modelName") as string,
      gender: formData.get("gender") as string,
    };

    // Validate required fields
    if (!input.fileKey || !input.modelName) {
      return NextResponse.json(
        { error: "Missing required fields (fileKey or modelName)" },
        { status: 400 }
      );
    }

    // Log input (consider using a proper logger in production)
    console.log("Processing request for user:", user.id, "Input:", input);

    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
      
    console.error("API Route Error:", error);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
