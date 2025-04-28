import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const WEB_HOOK_URL =
  process.env.SITE_URL ?? "https://bce8-2401-4900-1c69-2f52-cb77-dbec-31de-f214.ngrok-free.app";

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
    const fileName = input.fileKey.replace("training-data/", "");
    const { data: fileUrl } = await supabaseAdmin.storage
      .from("training-data")
      .createSignedUrl(fileName, 3600);

    if (!fileUrl?.signedUrl) {
      throw new Error("Failed to get the file url");
    }

    // const hardware = await replicate.hardware.list()
    // console.log(hardware);

    // make model
    const modelId = `${user.id}_${Date.now()}_${input.modelName
      .toLowerCase()
      .replaceAll(" ", "_")}`;

    await replicate.models.create("imcaffiene", modelId, {
      visibility: "private",
      hardware: "gpu-a100-large",
    });

    // start training
    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "c6e78d2501e8088876e99ef21e4460d0dc121af7a4b786b9a4c2d75c620e300d",
      {
        destination: `imcaffiene/${modelId}`,
        input: {
          steps: 1200,
          resolution: "1024",
          input_images: fileUrl.signedUrl,
          trigger_word: "smtkur",
        },
        webhook: `${WEB_HOOK_URL}/api/webhooks/training?userId=${user.id}&modelName=${encodeURIComponent(input.modelName)}&fileName=${encodeURIComponent(fileName)}`,
        webhook_events_filter: ["completed"],
      }
    );

    //add model value in the databse
    await supabaseAdmin.from("models").insert({
      model_id: modelId,
      user_id: user.id,
      model_name: input.modelName,
      gender: input.gender,
      training_status: training.status,
      trigger_word: "smtkur",
      training_steps: 1200,
      training_id: training.id,
    });
    // console.log("Training started:", training);

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
