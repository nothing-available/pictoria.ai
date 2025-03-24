import { z } from "zod";

// Define enums for aspect ratio and output format
const AspectRatioEnum = z.enum([
  "1:1",
  "16:9",
  "9:16",
  "21:9",
  "9:21",
  "3:2",
  "2:3",
  "4:5",
  "5:4",
  "3:4",
  "4:3",
]);
const OutputFormatEnum = z.enum(["jpg", "png", "webp"]);

export const imageGenerationFormSchema = z.object({
  model: z.string({
    required_error: "Model is required",
  }),
  prompt: z.string({
    required_error: "Prompt is required",
  }),
  guidances: z.number({
    required_error: "Guidances Scale is required",
  }),
  num_outputs: z
    .number()
    .min(1, { message: "Number of outputs must be at least 1" })
    .max(4, { message: "Number of outputs must be less than or equal to 4" }),
  aspect_ratio: AspectRatioEnum, // Use the enum here
  output_format: OutputFormatEnum, // Use the enum here
  output_quality: z
    .number()
    .min(1, { message: "Output Quality must be at least 1" })
    .max(100, { message: "Output Quality must be less than or equal to 100" }),
  num_inference_steps: z
    .number()
    .min(1, { message: "Number of Inference Steps must be at least 1" })
    .max(50, {
      message: "Number of Inference Steps must be less than or equal to 50",
    }),
});
