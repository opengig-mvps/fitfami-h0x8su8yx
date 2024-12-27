'use client' ;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Share, Image, Camera, VideoIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEffect } from "react";
import { gsap } from "gsap";

const LandingPage = () => {
  useEffect(() => {
    gsap.from(".animate-fade", { opacity: 0, duration: 1, y: -50, stagger: 0.2 });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-300 via-red-300 to-pink-300">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 animate-fade">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-white">
                    Discover & Share Delicious Recipes
                  </h1>
                  <p className="max-w-[600px] text-lg text-white md:text-xl">
                    Join a community of food lovers and share your culinary creations with the world.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-red-500 shadow transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    Get Started
                  </Button>
                  <Button className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white hover:text-red-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    Learn More
                  </Button>
                </div>
              </div>
              <img
                src="https://placehold.co/600x400.png"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 animate-fade">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-red-500">Trending Recipes</h2>
                <p className="max-w-[900px] text-lg text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore popular recipes shared by our community.
                </p>
              </div>
              <Carousel className="w-full max-w-5xl">
                <CarouselContent>
                  <CarouselItem>
                    <Card className="flex flex-col items-start p-6">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://placehold.co/600x400.png"
                          alt="Recipe"
                          className="rounded-md object-cover"
                        />
                      </AspectRatio>
                      <CardHeader>
                        <CardTitle>Spaghetti Carbonara</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">
                          A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                  <CarouselItem>
                    <Card className="flex flex-col items-start p-6">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://placehold.co/600x400.png"
                          alt="Recipe"
                          className="rounded-md object-cover"
                        />
                      </AspectRatio>
                      <CardHeader>
                        <CardTitle>Avocado Toast</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">
                          A simple and healthy breakfast option topped with fresh avocado slices.
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                  <CarouselItem>
                    <Card className="flex flex-col items-start p-6">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://placehold.co/600x400.png"
                          alt="Recipe"
                          className="rounded-md object-cover"
                        />
                      </AspectRatio>
                      <CardHeader>
                        <CardTitle>Chocolate Cake</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">
                          A rich and moist chocolate cake perfect for any occasion.
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-pink-300 via-red-300 to-yellow-300">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 animate-fade">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Join Our Community</h2>
                <p className="max-w-[900px] text-lg text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Connect with fellow food enthusiasts and share your love for cooking.
                </p>
              </div>
              <div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                <Card className="flex flex-col items-center space-y-4 p-6 bg-white shadow-lg rounded-lg">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-center">
                    <p className="text-lg font-bold text-red-500">Alex Brown</p>
                    <p className="text-sm text-gray-700">"I love sharing my recipes and discovering new dishes!"</p>
                  </div>
                </Card>
                <Card className="flex flex-col items-center space-y-4 p-6 bg-white shadow-lg rounded-lg">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" />
                    <AvatarFallback>CD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-center">
                    <p className="text-lg font-bold text-red-500">Cathy Doe</p>
                    <p className="text-sm text-gray-700">"A great platform to connect with food lovers worldwide!"</p>
                  </div>
                </Card>
                <Card className="flex flex-col items-center space-y-4 p-6 bg-white shadow-lg rounded-lg">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" />
                    <AvatarFallback>EF</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-center">
                    <p className="text-lg font-bold text-red-500">Ella Fitzgerald</p>
                    <p className="text-sm text-gray-700">"A wonderful community for sharing culinary experiences."</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-red-500 p-6 md:py-12 w-full">
        <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm text-white">
          <div className="grid gap-1">
            <h3 className="font-semibold">Product</h3>
            <a href="#">Features</a>
            <a href="#">Community</a>
            <a href="#">Pricing</a>
            <a href="#">Support</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Company</h3>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Resources</h3>
            <a href="#">Documentation</a>
            <a href="#">Help Center</a>
            <a href="#">Community</a>
            <a href="#">Templates</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Legal</h3>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;