'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from 'next/image';
import useGenerateStore from '@/store/useGeneratedStore';

// const image = [
//   {
//     src: '/hero-image/Charismatic Young Man with a Warm Smile and Stylish Tousled Hair.jpeg',
//     alt: 'some alt text',
//   },
//   {
//     src: '/hero-image/Confident Businesswoman on Turquoise Backdrop.jpeg',
//     alt: 'some alt text',
//   },
//   {
//     src: '/hero-image/pexels-iriser-1379640.jpg',
//     alt: 'some alt text',
//   },
//   {
//     src: '/hero-image/Futuristic Helmet Portrait.jpeg',
//     alt: 'some alt text',
//   }
// ];

const GeneratedImage = () => {

  const images = useGenerateStore((state) => state.images);
  const loading = useGenerateStore((state) => state.loading);

  if (images.length === 0) {
    return <Card className='w-full max-w-2xl bg-muted'>
      <CardContent className='flex aspect-square items-center justify-center p-6'>
        <span className='text-2xl'>No image generated</span>
      </CardContent>
    </Card>;
  }
  return (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent>
        {images.map((img, index) => (
          <CarouselItem key={index}>
            <div className="flex relative items-center justify-center rounded-lg overflow-hidden aspect-square">
              <Image src={img.url} alt={"Generate Ai image"} fill className='w-full h-full object-cover' />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );

};

export default GeneratedImage;