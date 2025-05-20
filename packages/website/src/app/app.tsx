import { BeakerIcon, CodeBracketIcon, CommandLineIcon, CubeIcon } from '@heroicons/react/24/outline';

const projects = [
  {
    name: '@adenta/core',
    description: 'Core utilities and shared functionality for the @adenta ecosystem',
    icon: <BeakerIcon className="h-6 w-6" />,
    path: '/core'
  },
  {
    name: '@adenta/ui',
    description: 'A beautiful and modern UI component library',
    icon: <CubeIcon className="h-6 w-6" />,
    path: '/ui'
  },
  {
    name: '@adenta/cli',
    description: 'Command line tools for @adenta projects',
    icon: <CommandLineIcon className="h-6 w-6" />,
    path: '/cli'
  }
];

export function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <CodeBracketIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Welcome to @adenta
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            A modern monorepo for building awesome applications
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.name}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                    {project.icon}
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <a href={project.path} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {project.name}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {project.description}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
