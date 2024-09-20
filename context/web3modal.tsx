'use client'

import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers' // Updated import
import { mainnet, arbitrum } from '@reown/appkit/networks'
import Link from 'next/link'

// 1. Get projectId at https://cloud.reown.com
const projectId = '1b38382de5df0af627ac53c6ae591a16'

// 2. Set Ethers adapters
const ethers5Adapter = new EthersAdapter()

// 3. Create a metadata object
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 4. Create the AppKit instance
createAppKit({
  adapters: [ethers5Adapter],
  metadata: metadata,
  networks: [mainnet, arbitrum],
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export const AppKit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="navbar bg-transparent shadow-md shadow-slate-400 h-16 z-30">
      <div className="flex place-items-start p-8">
        <Link href="/">
          <p className="btn btn-ghost text-xl text-white bold">
            ReversiFi
          </p>
        </Link>
      </div>
      <w3m-button />
      {children} {/* Render children here */}
    </div>
  )
}