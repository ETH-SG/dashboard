"use client";
import React, { useEffect } from "react";
import { Preview } from "./components/Preview";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

const MainPage = () => {
  const router = useRouter();
  const { address } = useAccount();

  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address]);

  return (
    <div>
      <br />
      <Preview />
    </div>
  );
};

export default MainPage;
