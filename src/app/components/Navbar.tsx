import React from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="m-5 flex relative justify-between z-30">
      <div>
        <Link href="/">
        <Image 
          src="/ReversiFi.png"
          alt="ReversiFi"
          width={50}
          height={50}
        />
        </Link>
      </div>
      <w3m-button />
     
    </div>
    // <div className="navbar bg-transparent shadow-md shadow-slate-400 h-16 z-30">
    //   <div className="flex place-items-start p-8">
    //     <Link href="/">
    //       <p className="btn btn-ghost text-xl text-white bold">
    //         ReversiFi
    //       </p>
    //     </Link>
    //   </div>
     // <w3m-network-button />
    // </div>
  );
};

export default Navbar;
