"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import messages from "@/data/messages.json";



const HomePage = () => {
  return (
    <>
      <main className='flex flex-col justify-center items-center py-12 px-4 md:px-24 min-h-[calc(100vh-252px)] sm:min-h-[calc(100vh-232px)]'>
        <section className='w-full text-center mb-8 md:mb-24'>
          <h1 className='text-3xl md:text-4xl font-bold mb-3 md:mb-4'>Welcome to FeedbackCloak</h1>
          <p className='md:text-lg '>Explore FeedbackCloak - Where your identity remains a secret.</p>
        </section>
        <section>
          <Carousel
            className="w-full max-w-xs"
            plugins={[Autoplay({ delay: 2000 })]}
          >
            <CarouselContent>
              {
                messages.map((message, index) => {
                  return (
                    <CarouselItem key={index} >
                      <div className="p-1">
                        <Card>
                          <CardHeader>
                            <CardTitle className="font-normal text-lg">{message.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex aspect-square items-center justify-center p-3 sm:p-6">
                            <span className="text-2xl md:text-3xl font-semibold">{message.content}</span>
                          </CardContent>
                          <CardFooter>
                            <p>{message.received}</p>
                          </CardFooter>
                        </Card>
                      </div>
                    </CarouselItem>
                  )
                })
              }
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      </main>
    </>
  )
}

export default HomePage

