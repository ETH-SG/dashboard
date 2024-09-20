"use client";
import React from "react";
import Link from "next/link";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export function GetStartedButton() {
  return (
    <div className="m-5 flex justify-center text-center">
        <Link href="/MainPage">
            <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="bg-black text-white flex items-center space-x-2"
            >
                <span>Get Started</span>
            </HoverBorderGradient>
        </Link>
    </div>
  );
}

