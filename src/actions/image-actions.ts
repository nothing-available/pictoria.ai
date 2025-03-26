/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { z } from "zod";
import Repicate from "replicate";
import { imageGenerationFormSchema } from "@/schema/imageGeneration-schema";
import { createClient } from "@/lib/supabase/server";
import { Database } from "../../database.types";
import { imageMeta } from "image-meta";
import { randomUUID } from "node:crypto";

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
  const response = await fetch(url);
  const blob = response.blob();
  return (await blob).arrayBuffer();
}

type storeImageInput = {
  url: string;
} & Database["public"]["Tables"]["generatedimages"]["Insert"];

export async function storeImage(data: storeImageInput[]) {
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
      .from("generatedimages")
      .upload(filePath, arrayBuffer, {
        contentType: `image/${type}`,
        cacheControl: "3600",
        upsert: false,
      });

    if (storageError) {
      uploadResults.push({
        fileName,
        error: storageError.message,
        success: false,
        data: null,
      });
      continue;
    }

    const { error: dbError, data: dbData } = await supabase
      .from("generatedimages")
      .insert([
        {
          user_id: user.id,
          model: img.model,
          prompt: img.prompt,
          aspect_ratio: img.aspect_ratio,
          output_format: img.output_format,
          guidance: img.guidance,
          num_inference_steps: img.num_inference_steps,
          image_name: fileName,
          width,
          height,
        },
      ])
      .select();

    if (dbError) {
      uploadResults.push({
        fileName,
        error: dbError.message,
        success: false,
        data: dbData || null,
      });
    }
  }
  // console.log("uploadResult", uploadResults);

  return {
    error: null,
    success: true,
    data: { results: uploadResults },
  };
}

export async function getImage(limit?: number) {
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

  let query = supabase
    .from("generatedimages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return {
      error: error.message || "Failed to fetch images",
      success: false,
      data: null,
    };
  }

  const imagesWithUrl = await Promise.all(
    data.map(
      async (image: Database["public"]["Tables"]["generatedimages"]["Row"]) => {
        const { data } = await supabase.storage
          .from("generatedimages")
          .createSignedUrl(`${user.id}/${image.image_name}`, 3600);

        return {
          ...image,
          url: data?.signedUrl,
        };
      }
    )
  );

  return {
    error: null,
    success: true,
    data: imagesWithUrl || null,
  };
}

export async function deleteImage(id: string, imageName: string) {
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

  const { data, error } = await supabase
    .from("generatedimages")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      error: error.message || "Failed to delete image",
      success: false,
      data: null,
    };
  }

  await supabase.storage
    .from("generatedimages")
    .remove([`${user.id}/${imageName}`]);

  return {
    error: null,
    success: true,
    data: data || null,
  };
}
