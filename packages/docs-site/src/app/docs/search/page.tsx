'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  // In a real application, you would perform an actual search here
  // For this example, we'll just display the search query

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <p className="mb-4">
        Showing results for: <strong>{query}</strong>
      </p>
      <p>
        In a real application, this page would display actual search results.
        You could implement server-side search or use a search library like Algolia.
      </p>
    </div>
  )
}