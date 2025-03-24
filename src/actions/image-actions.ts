/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { z } from "zod";
import Repicate from "replicate";
import { imageGenerationFormSchema } from "@/schema/imageGeneration-schema";
import { createClient } from "@/lib/supabase/server";
import { Database } from "../../database.types";
import { imageMeta } from "image-meta";
import { randomUUID } from "node:crypto";
import { config } from "node:process";

interface ImageResponse {
  error: null | string;
  success: boolean;
  data: unknown | null;
}

const replicate = new Repicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false,
});

export async function generateImageAction(
  input: z.infer<typeof imageGenerationFormSchema>
): Promise<ImageResponse> {
  const modelInput = {
    prompt: input.prompt,
    go_fast: true,
    guidance: input.guidances,
    megapixels: "1",
    num_outputs: input.num_outputs,
    aspect_ratio: input.aspect_ratio,
    output_format: input.output_format,
    output_quality: input.output_quality,
    prompt_strength: 0.8,
    num_inference_steps: input.num_inference_steps,
  };

  try {
    const output = await replicate.run(input.model as `${string}/${string}`, {
      input: modelInput,
    });
    console.log(output);

    return {
      error: null,
      success: true,
      data: output,
    };
  } catch (error) {
    return {
      error: "Failed to generate image",
      success: false,
      data: null,
    };
  }
}

export async function imgUrlToBlob(url: string) {
  const response = fetch(url);
  const blob = (await response).blob();
  return (await blob).arrayBuffer();
}

type storeImageInput = {
  url: string;
} & Database["public"]["Tables"]["generated_images"]["Insert"];

export async function storeImage(data: storeImageInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "unauthorized",
      success: false,
      data: null,
    };
  }

  const uploadResults = [];

  for (const img of data) {
    const arrayBuffer = await imgUrlToBlob(img.url);
    const { width, height, type } = imageMeta(new Uint8Array(arrayBuffer));

    const fileName = `image_${randomUUID()}.${type}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: storageError } = await supabase.storage
      .from("generated-image")
      .upload(filePath, arrayBuffer, {
        contentType: `image/${type}`,
        cacheControl: "3600",
        upsert: false,
      });

    if (storageError) {
      continue;
    }

    await supabase.from('generated-image').insert
  }
}
