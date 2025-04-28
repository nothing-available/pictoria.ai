import { z } from "zod";

// Constants for validation
const ACCEPT_ZIP_FILES = [
  "application/zip",
  "application/x-zip-compressed",
  "application/x-compressed",
  "application/octet-stream", // Sometimes zip files use this
] as const;

const MAX_FILE_SIZE_MB = 45;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

export const modelTrainingSchema = z.object({
  modelName: z
    .string()
    .min(1, "Model name is required")
    .max(50, "Model name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_\- ]+$/,
      "Only letters, numbers, spaces, hyphens and underscores allowed"
    ),

  gender: z.enum(["man", "women"], {
    required_error: "Gender selection is required",
    invalid_type_error: "Gender must be either 'man' or 'women'",
  }),
  
  zipfile: z
    .any()
    .refine((files) => files?.[0] instanceof File, "Please select a valid file")
    .refine(
      (files) =>
        files?.[0]?.type && ACCEPT_ZIP_FILES.includes(files?.[0]?.type),
      "Please select a valid zip file"
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "File size should be less than 45MB"
    ),
});
