// Import your static data (or define it here)
const bio = {
  name: 'Israel Agyeman-Prempeh',
  title: 'Full Stack Developer',
  description:
    'I am a passionate developer with experience in building scalable web applications, modern UI libraries, and developer tooling. I love working with monorepos, automation, and delivering delightful user experiences.',
  links: [
    { label: 'GitHub', url: 'https://github.com/codewreaker' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/israelprempeh' },
    { label: 'Email', url: 'mailto:developer.prempeh@gmail.com' },
    { label: 'Instagram', url: 'https://instagram.com/israel.prempeh' },
  ],
};

const githubMono = 'https://github.com/codewreaker/adenta/tree/main/packages';

const tabProjects = [
  {
    name: '@adenta/core',
    description:
      'Core utilities and shared functionality for the @adenta ecosystem',
    path: `${githubMono}/core`,
    key: 'core',
  },
  {
    name: '@adenta/ui',
    description: 'A beautiful and modern UI component library',
    path: `${githubMono}/ui`,
    key: 'ui',
  },
  {
    name: '@adenta/cli',
    description: 'Command line tools for @adenta projects',
    path: `${githubMono}/cli`,
    key: 'cli',
  },
  {
    name: '@adenta/cms',
    description: 'A ready to go CMS built on payloadcms',
    path: `${githubMono}/cms`,
    key: 'cms',
  },
];

const experienceData = {
  education: [
    {
      period: '2012-2016',
      title: 'BSc. Computer Science',
      school: 'Ashesi University College, Berekuso',
      description: 'BSc. Computer Science',
      fields: ['Computer Science', 'Algorithms', 'Data Structures', 'Discrete Math'],
      subtitles: ['3.58/4.0 (Cum Laude)'],
    },
  ],
  experience: [
    {
      period: 'July 2023 — PRESENT',
      title: 'Associate Director',
      company: 'RBC Capital Markets, London',
      description:`
  • Global UI Lead driving the development and maintenance of RBC Capital Markets’ core UI libraries, all widely adopted across the organization, and architecting a roadmap to modernize UI libraries.
  
  • Implemented high-quality CLI tools for building, testing, templating, and module federation, leveraging Rspack, Nx, and SWC to abstract complex configurations and accelerated development.
  
  • Overhauled dependency management using Nx, streamled CI/CD pipelines with Docker and integrating firm-wide DevOps strategies via GitHub Actions and Jenkins for semanticversioning compliance.
  
  • Built a Dev portal to reduce the barrier of entry to from idea to prototype with developer experience at thefore-front
      `,
      techStack: ['Nx', 'RsPack', 'SWC', 'TypeScript', 'Docker', 'MUI', 'AG Grid', 'Apache ECharts'],
      subtitles: ['Senior Software Engineer Core UI'],
    },
    
    {
      period: 'July 2022 — July 2023',
      title: 'Vice President - Rates Flow Technology',
      company: 'Bank of America, London',
      description:`
  •  Designed, architected, and implemented performant UI handling thousands of live-ticking data used bytraders and middle-office, using efficient paradigms in JavaScript; web workers, WebSockets and Typescript
  
  •  UI Lead on unified trading and trade-blotter application used by sales and traders. Work included RFQterminals with live risk and market data
  
  •  Spearheaded UI reconstruction of legacy python application, leading a team of engineers
  
  •  Handled releases SDLC and CI/CD pipelines as an additional role while managing releases and interfacingwith senior leadership on state of production
      `,
      techStack: ['React', 'TypeScript', 'Python', 'Node.js', 'Cassandra', 'WebSockets', 'Web Workers'],
      subtitles: ['Senior Software Engineer'],
    },
    {
      period: 'July 2016 — July 2022',
      title: 'Assistant Vice President - Rates Flow Technology',
      company: 'Bank of America, London',
      description:`
  •  Led the transformation of a legacy supervisory tool by rebuilding its UI from Python to a modern, React-based application.
  
  •  Designed and developed intuitive UI/UX wireframes and implemented robust RESTful and WebSocket APIs using Tornado.
  
  •  The revamped application’s success drove its global adoption, consolidating all supervisory tools into a unified platform and establishing it as the bank’s primary supervisory solution.
      `,
      techStack: ['React', 'TypeScript', 'Python', 'Tornado', 'WebSockets', 'Web Workers'],
      subtitles: ['Software Engineer'],
    },
  ]
};

const blogPosts = [
  {
    id: 1,
    title: 'Building Scalable React Applications with TypeScript',
    excerpt:
      "Learn how to structure large React applications using TypeScript for better maintainability and developer experience. We'll explore advanced patterns, type safety, and architectural decisions that make a difference in production applications.",
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'React',
    image: './assets/placeholder.svg?height=300&width=600',
    featured: true,
  },
  {
    id: 2,
    title: 'Modern CSS Techniques for Better Performance',
    excerpt:
      "Explore advanced CSS features and optimization techniques that can significantly improve your website's performance and user experience.",
    date: '2024-01-12',
    readTime: '6 min read',
    category: 'CSS',
    image: './assets/placeholder.svg?height=200&width=400',
  },
  {
    id: 3,
    title: "Next.js 14: What's New and How to Migrate",
    excerpt:
      'A comprehensive guide to the latest features in Next.js 14 and step-by-step migration instructions for existing projects.',
    date: '2024-01-10',
    readTime: '12 min read',
    category: 'Next.js',
    image: './assets/placeholder.svg?height=200&width=400',
  },
  {
    id: 4,
    title: 'Mastering Git Workflows for Team Development',
    excerpt:
      'Best practices for Git workflows that improve collaboration and code quality in development teams.',
    date: '2024-01-08',
    readTime: '10 min read',
    category: 'DevOps',
    image: './assets/placeholder.svg?height=200&width=400',
  },
  {
    id: 5,
    title: 'Understanding JavaScript Closures and Scope',
    excerpt:
      "Deep dive into JavaScript closures, lexical scope, and how they affect your code's behavior and performance.",
    date: '2024-01-05',
    readTime: '7 min read',
    category: 'JavaScript',
    image: './assets/placeholder.svg?height=200&width=400',
  },
  {
    id: 6,
    title: 'Database Design Patterns for Modern Applications',
    excerpt:
      'Essential database design patterns and best practices for building robust and scalable applications.',
    date: '2024-01-03',
    readTime: '15 min read',
    category: 'Database',
    image: './assets/placeholder.svg?height=200&width=400',
  },
  {
    id: 7,
    title: 'API Security Best Practices',
    excerpt:
      'Comprehensive guide to securing your APIs with authentication, authorization, and other security measures.',
    date: '2024-01-01',
    readTime: '9 min read',
    category: 'Security',
    image: './assets/placeholder.svg?height=200&width=400',
  },
];

export {
    bio,
    tabProjects,
    experienceData,
    blogPosts
}