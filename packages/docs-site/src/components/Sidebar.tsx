'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const sidebarItems = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs/introduction' },
      { title: 'Installation', href: '/docs/installation' },
    ],
  },
  {
    title: 'Basic Features',
    items: [
      { title: 'Pages', href: '/docs/pages' },
      { title: 'Routing', href: '/docs/routing' },
    ],
  },
  {
    title: 'Advanced Features',
    items: [
      { title: 'API Routes', href: '/docs/api-routes' },
      { title: 'Middleware', href: '/docs/middleware' },
    ],
  },
]

export default function Sidebar() {
  const [openSections, setOpenSections] = useState<string[]>([])
  const pathname = usePathname()

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    )
  }

  return (
    <nav className="w-64 bg-gray-100 p-4 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Documentation</h1>
      {sidebarItems.map((section) => (
        <div key={section.title} className="mb-4">
          <button
            type='button'
            onClick={() => toggleSection(section.title)}
            className="flex items-center justify-between w-full text-left font-semibold mb-2"
          >
            {section.title}
            <span>{openSections.includes(section.title) ? '-' : '+'}</span>
          </button>
          {openSections.includes(section.title) && (
            <ul className="ml-4">
              {section.items.map((item) => (
                <li key={item.href} className="mb-2">
                  <Link
                    href={item.href}
                    className={`hover:text-blue-600 ${
                      pathname === item.href ? 'text-blue-600 font-semibold' : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  )
}