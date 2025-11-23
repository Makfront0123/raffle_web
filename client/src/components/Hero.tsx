"use client";

import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";


const heroSlides = [
    {
        src: "/images/carousel01.png",
        alt: "Moto azul deportiva",
    },
    {
        src: "/images/carousel01.png",
        alt: "Moto roja deportiva",
    },
    {
        src: "/images/carousel01.png",
        alt: "Moto negra deportiva",
    },
];

const Hero = () => {
    return (
        <header className="w-full min-h-[90vh] relative ">
            <div className="  bg-white flex items-center justify-center w-full h-full overflow-hidden">
                <Carousel className="w-full rounded-lg overflow-hidden shadow-md  ">
                    <CarouselContent>
                        {heroSlides.map((slide, index) => (
                            <CarouselItem key={index} className="flex justify-center">
                                <img
                                    src={slide.src}
                                    alt={slide.alt}
                                    className="object-center h-full w-full hover:scale-105 transition-all duration-500"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                </Carousel>
            </div>
        </header>
    );
};

export default Hero;


