import { NextResponse } from "next/server";
import Replicate from "replicate";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-temp/EmailTemplate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {

  try {
    const body = await req.json();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? "";
    const modelName = url.searchParams.get("modelName") ?? "";
    const fileName = url.searchParams.get("fileName") ?? "";

    // to validate the webhook
    const id = req.headers.get("webhook-id") ?? "";
    const timestamp = req.headers.get("webhook-timestamp") ?? "";
    const webhookSignature = req.headers.get("webhook-signature") ?? "";

    const signedContent = `${id}.${timestamp}.${JSON.stringify(body)}`;
    const secret = await replicate.webhooks.default.secret.get();
    const secretBytes = Buffer.from(secret.key.split("_")[1], "base64");
    const signature = crypto
      .createHmac("sha256", secretBytes)
      .update(signedContent)
      .digest("base64");
    console.log("signature", signature);

    const expectedSignature = webhookSignature
      .split("")
      .map((sig) => sig.split(",")[1]);
    const isValid = expectedSignature.some(
      (expectedSignature) => expectedSignature === signature
    );

    if (!isValid) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    //get user data
    const { data: user, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError || !user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const userEmail = user.user.email ?? "";
    const userName = user.user.user_metadata.full_name ?? "";

    if (body.status === "succeeded") {
      // send email to user
      await resend.emails.send({
        from: "Pictoria.ai <smtkur31@gmail.com>",
        to: [userEmail],
        subject: "Your model is ready",
        react: await EmailTemplate({
          userName,
          message: "Your model is ready. You can now use it for training.",
        }),
      });

      //update the supabase model table
      await supabaseAdmin
        .from("models")
        .update({
          training_status: body.status,
          training_time: body.metrics?.total_time ?? null,
          version: body.output?.version.split(":")[1] ?? null,
        })
        .eq("user_id", userId)
        .eq("model_name", modelName);
    } else {
      //handle the failed and cancel status
      await resend.emails.send({
        from: "Pictoria.ai <onboarding@resend.dev>",
        to: [userEmail],
        subject: `Your model is {body.status}`,
        react: await EmailTemplate({
          userName,
          message: `Your model ${modelName} is ${body.status}. Please check the logs for more details.`,
        }),
      });

      //update the supabase model table
      await supabaseAdmin
        .from("models")
        .update({
          training_status: body.status,
        })
        .eq("user_id", userId)
        .eq("model_name", modelName);
    }

    await supabaseAdmin.storage.from("training_data").remove([`${fileName}`]);

    console.log("Webhook processed successfully", body);
    return NextResponse.json("ok", { status: 200 });
  } catch (error) {
    console.log("Error parsing webhook body:", error);
    return NextResponse.json(
      { error: "Error parsing webhook body" },
      { status: 500 }
    );
  }
}
