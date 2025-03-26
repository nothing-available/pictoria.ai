'use client';
import Image from "next/image";
import { Tables } from "../../../database.types";
import ImageDailog from "./ImageDailog";
import { useState } from "react";

type ImageProps = {
  url: string | undefined;
} & Tables<"generatedimages">;

interface GalleryProps {
  images: ImageProps[];
}

const GalleryComponent = ({ images }: GalleryProps) => {

  const [selectImage, setSelectImage] = useState<ImageProps | null>(null);

  // console.log(images);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
        NO Images found
      </div>
    );
  }

  return (
    <section className="container mx-auto py-8">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {
          images.map((image, idx) => {
            return (
              <div key={idx}>

                {/* Image container with hover effects */}
                <div className="relative group overflow-hidden cursor-pointer transition-transform rounded-lg"
                  onClick={() => setSelectImage(image)}>

                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/70 rounded-lg flex items-center justify-center">
                    <p className="text-white opacity-0 group-hover:opacity-100 text-lg font-semibold transition-opacity duration-200">
                      View Details
                    </p>
                  </div>

                  <Image
                    src={image.url || ""}
                    alt={image.prompt || ""}
                    width={image.width || 0}
                    height={image.height || 0}
                    className="object-cover rounded"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })
        }
      </div>

      {selectImage && <ImageDailog image={selectImage} onClose={() => setSelectImage(null)} />}

    </section>
  );
};

export default GalleryComponent;