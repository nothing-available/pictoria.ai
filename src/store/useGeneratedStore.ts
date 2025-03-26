import { imageGenerationFormSchema } from "@/schema/imageGeneration-schema";
import { create } from "zustand";
import { z } from "zod";
import { generateImageAction, storeImage } from "@/actions/image-actions";
import { toast } from "sonner";

interface GenerateState {
  loading: boolean;
  images: Array<{ url: string }>;
  error: string | null;
  generateImage: (
    value: z.infer<typeof imageGenerationFormSchema>
  ) => Promise<void>;
}

const useGenerateStore = create<GenerateState>((set) => ({
  loading: false,
  images: [],
  error: null,

  generateImage: async (values: z.infer<typeof imageGenerationFormSchema>) => {
    set({ loading: true, error: null });

    const toastId = toast.loading("Generating image...");

    try {
      const { data, error, success } = await generateImageAction(values);
      if (!success) {
        set({ error: error, loading: false });
        return;
      }

      const dataWithUrl = data.map((url: string) => {
        return { url, ...values };
      });

      set({ images: dataWithUrl, loading: false });
      toast.success("Image generated successfully", { id: toastId });

      await storeImage(dataWithUrl);
      toast.success("Image saved successfully", { id: toastId });
    
    } catch (error) {
      console.error(error);
      set({
        error: "Failed to generate image. Please try again",
        loading: false,
      });
    }
  },
}));

export default useGenerateStore;
