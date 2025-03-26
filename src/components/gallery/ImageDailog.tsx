import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tables } from "../../../database.types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { DeleteImage } from "./DeleteImage";



interface ImageDailogProps {
  image: { url: string | undefined; } & Tables<"generatedimages">,
  onClose: () => void;
}

function ImageDailog({ image, onClose }: ImageDailogProps) {

  //download image
  const handleDownload = async () => {
    try {
      // Type guard ensures `image.url` is string
      if (!image?.url || typeof image.url !== 'string') {
        toast.error("No image available to download");
        return;
      }

      const toastId = toast.loading("Starting download...");

      const response = await fetch(image.url);
      if (!response.ok) throw new Error(`Failed to fetch image`);

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `generated-image-${Date.now()}.${image?.output_format}`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      toast.success("Download started!", { id: toastId });

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        link.parentNode?.removeChild(link);
      }, 100);
    } catch (error) {
      toast.error("Download failed. Please try again.");
      console.error(error);
    }
  };


  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="max-w-full sm:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle className="text-2xl w-full">Image Details</SheetTitle>

          <ScrollArea className="flex flex-col h-[100vh]">
            <div className="relative w-fit h-fit">
              <Image
                src={image.url || ""}
                alt={image.prompt || ""}
                width={image.width || 0}
                height={image.height || 0}
                className="w-full h-auto flex mb-3 rounded" />

              <div className="flex gap-4 absolute bottom-4 right-4">
                <Button className="w-fit" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>

                <DeleteImage
                  imageId={image.id.toString()}
                  className="w-fit"
                  onDelete={onClose}
                  imageName={image.image_name || "Unnamed Image"} />
              </div>
            </div>

            <hr className="inline-block w-full border-primary/30 mb-2" />

            <p className="text-primary/90  w-full flex flex-col">
              <span className="text-primary text-xl font-semibold">
                Prompt
              </span>
              {image.prompt}
            </p>

            <hr className="inline-block w-full border-primary/30 mb-2" />

            <div className="flex flex-wrap gap-3 mb-32">
              <Badge variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
                <span className="text-primary uppercase mr-2 font-semibold">Model Id:</span>
                {image.model}
              </Badge>

              <Badge variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
                <span className="text-primary uppercase mr-2 font-semibold">Aspect Ratio:</span>
                {image.aspect_ratio}
              </Badge>

              <Badge variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
                <span className="text-primary uppercase mr-2 font-semibold">Dimension:</span>
                {image.width}x{image.height}
              </Badge>

              <Badge variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
                <span className="text-primary uppercase mr-2 font-semibold">Guidance:</span>
                {image.guidance}
              </Badge>

              <Badge variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
                <span className="text-primary uppercase mr-2 font-semibold">Inference steps:</span>
                {image.num_inference_steps}
              </Badge>

              <Badge variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
                <span className="text-primary uppercase mr-2 font-semibold">Output format:</span>
                {image.output_format}
              </Badge>

              <Badge variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
                <span className="text-primary uppercase mr-2 font-semibold">Created At:</span>
                {new Date(image.created_at).toLocaleDateString()}
              </Badge>
            </div>

            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default ImageDailog;