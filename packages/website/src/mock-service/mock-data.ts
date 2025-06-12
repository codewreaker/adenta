// Import your static data (or define it here)
const bio = {
  name: 'Israel Agyeman-Prempeh',
  title: 'Full Stack Developer',
  description:
    'I am a passionate developer with experience in building scalable web applications, modern UI libraries, and developer tooling. I love working with monorepos, automation, and delivering delightful user experiences.',
  links: [
    { label: 'GitHub', url: 'https://github.com/your-github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/your-linkedin' },
    { label: 'Email', url: 'mailto:your@email.com' },
    { label: 'Instagram', url: 'https://instagram.com/your-instagram' },
  ],
};

const tabProjects = [
  {
    name: '@adenta/core',
    description:
      'Core utilities and shared functionality for the @adenta ecosystem',
    path: '/core',
    key: 'core',
  },
  {
    name: '@adenta/ui',
    description: 'A beautiful and modern UI component library',
    path: '/ui',
    key: 'ui',
  },
  {
    name: '@adenta/cli',
    description: 'Command line tools for @adenta projects',
    path: '/cli',
    key: 'cli',
  },
];

const experienceData = [
  {
    period: '2024 — PRESENT',
    title: 'Senior Frontend Engineer, Accessibility',
    company: 'Klaviyo',
    description:
      "Build and maintain critical components used to construct Klaviyo's frontend, across the whole product. Work closely with cross-functional teams, including developers, designers, and product managers, to implement and advocate for best practices in web accessibility.",
    techStack: ['JavaScript', 'TypeScript', 'React', 'Storybook'],
    subtitles: [],
  },
  {
    period: '2022 — 2024',
    title: 'Senior Frontend Engineer',
    company: 'Upstatement',
    description:
      'Build, style, and ship high-quality websites, design systems, mobile apps, and digital experiences for a diverse array of projects for clients including Harvard Business School, Everytown for Gun Safety, Pratt Institute, Koala Health, Vanderbilt University, The 19th News, and more. Provide leadership within engineering department through close collaboration, knowledge shares, and mentorship.',
    techStack: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'WordPress'],
    subtitles: ['Lead Engineer', 'Engineer'],
  },
];

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