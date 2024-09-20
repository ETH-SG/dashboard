import React from 'react'
import Link from 'next/link' // Import Next.js Link for navigation

const Navbar = () => {
  return (
    <div className="navbar bg-transparent shadow-md shadow-slate-400 h-16 z-30">
      <div className="flex place-items-start p-8">
        <Link href="/">
          <p className="btn btn-ghost text-xl text-white bold">
            ReversiFi
          </p>
        </Link>
      </div>
    </div>
  )
}

export default Navbar