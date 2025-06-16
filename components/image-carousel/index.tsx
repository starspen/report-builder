import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

interface BasicCarouselProps {
  images: string[];
}

const BasicCarousel = ({ images }: BasicCarouselProps) => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  return (
    <Carousel
      className="mx-auto w-full max-w-xs"
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div>
              <Image
                src={image}
                alt="image"
                width={200}
                height={200}
                className="h-full w-full cursor-pointer object-cover object-center transition-all duration-300 hover:scale-105"
                onClick={() => {
                  window.open(image, "_blank");
                }}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 top-32 -translate-y-1/2 opacity-60 hover:opacity-100" color="default"/>
      <CarouselNext className="absolute right-2 top-32 -translate-y-1/2 opacity-60 hover:opacity-100" color="default"/>
    </Carousel>
  );
};

export default BasicCarousel;
