export default function IntroductionPage() {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Introduction</h1>
        <p className="mb-4">
          Welcome to our Nextra-like documentation site built with Next.js 15 and Tailwind CSS.
          This site demonstrates how to create a documentation website with a sidebar for navigation
          and a search functionality.
        </p>
        <h2 className="text-2xl font-semibold mb-2">Features</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Next.js 15 with App Router</li>
          <li>TypeScript for type safety</li>
          <li>Tailwind CSS for styling</li>
          <li>Responsive sidebar navigation</li>
          <li>Search functionality</li>
        </ul>
        <p>
          Explore the sidebar to navigate through different sections of the documentation.
          Use the search bar at the top to find specific topics quickly.
        </p>
      </div>
    )
  }