'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-[#1B2A6B] tracking-wide">
            DIGG
          </Link>
          
          <button
            className="md:hidden text-[#1B2A6B] text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <ul className={`${
            mobileMenuOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row md:space-x-8 md:space-y-0 space-y-4 absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0`}>
            <li>
              <Link href="/" className="text-gray-700 hover:text-[#F7941D] font-medium transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-700 hover:text-[#F7941D] font-medium transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/#products" className="text-gray-700 hover:text-[#F7941D] font-medium transition-colors">
                Products
              </Link>
            </li>
            <li>
              <Link href="/for-agents" className="text-gray-700 hover:text-[#F7941D] font-medium transition-colors">
                For Agents
              </Link>
            </li>
            <li>
              <Link href="/give" className="text-gray-700 hover:text-[#F7941D] font-medium transition-colors">
                Give
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-700 hover:text-[#F7941D] font-medium transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
