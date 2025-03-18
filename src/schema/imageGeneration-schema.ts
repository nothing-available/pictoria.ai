import { z } from "zod";

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
    .max(4, { message: "Number of outputs must be less then 4" }),
    
  aspect_ratio: z.string({
    required_error: "Aspect Ratio is required",
  }),

  output_format: z.string({
    required_error: "Output Format is required",
  }),

  output_quality: z
    .number()
    .min(1, { message: "Output Quality must be at least 1" })
    .max(100, { message: "Output Quality must be less or equal to 4" }),

  num_inference_steps: z
    .number()
    .min(1, { message: "Number of Inference Steps must be at least 1" })
    .max(50, { message: "Number of Inference Steps must be less or equal 50" }),
});
