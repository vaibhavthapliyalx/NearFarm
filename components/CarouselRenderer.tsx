/**
 * @fileoverview This file contains the CarouselRenderer component.
 */

// Imports.
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { classMerge } from "@/lib/utilityfunctions";

// Interface for the CarouselRenderer component props.
interface IProps {
  images: string[],
  imageWidth: number,
  imageHeight: number,
  className?: string,
}

/**
 * This function renders the CarouselRenderer component.
 * 
 * @param {string[]} images The list of image urls to display in the carousel.
 * @param {number} imageWidth The width of the image.
 * @param {number} imageHeight The height of the image.
 * @param {string} className The class name to apply to the carousel.
 * @returns The rendered CarouselRenderer component.
 */
export default function CarouselRenderer({images, className, imageHeight, imageWidth}:IProps) {
  // Autoplay plugin for the carousel.
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  /*************** Render Function *************/
  return (
    <Carousel
      plugins={[plugin.current]}
      className={classMerge("w-full max-w-md",className)}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="">
        {images.map((image, index) => (
          <CarouselItem key={index} className="p-4">
            <div className="p-1">
              <Image 
                src={image} 
                alt={`Carousel item ${index + 1}`}
                width={imageWidth}
                height={imageHeight}
                className={className}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className={imageWidth < 400 || images.length <=1 ? "hidden" : ""}>
        <CarouselPrevious className="hidden  lg:flex lg:flex-1 lg:items-center " />
        <CarouselNext className="hidden lg:flex lg:flex-1 lg:items-center "/>
      </div>
    </Carousel>
  )
}
