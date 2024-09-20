import React from "react";
import { BackgroundLines } from "./ui/background-lines";
import { GetStartedButton } from "./GetStartedButton";

export function LandingPage() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 min-h-screen relative z-10">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-5xl md:text-4xl lg:text-7xl font-sans py-8 md:py-10 relative z-20 font-bold tracking-tight">
        ReversiFi
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
        A SDK for you to build a non-custodial wallet with a simple way. 
      </p>
      <GetStartedButton />
    </BackgroundLines>
  );
}