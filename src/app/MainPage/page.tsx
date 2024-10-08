"use client";
import React, { useEffect } from "react";
import { Preview } from "./components/Preview";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { FancyBackground } from "./components/fancyBackground";

const MainPage = () => {
  const router = useRouter();
  const { address } = useAccount();

  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address]);

  return (
    <div className="relative w-full h-screen"> {/* Ensure the parent div is relative */}
      <div className="absolute inset-0 z-0 -top-28">  {/* Place FancyBackground behind */}
        <FancyBackground />
      </div>
      <div className="relative z-10 top-60"> {/* Ensure Preview is above FancyBackground */}
        <Preview />
      </div>
    </div>
  );
};

export default MainPage;