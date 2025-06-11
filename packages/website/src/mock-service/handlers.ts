import { http, HttpResponse } from 'msw'

// Import your static data (or define it here)
const bio = {
  name: "Israel Agyeman-Prempeh",
  title: "Full Stack Developer",
  description:
    "I am a passionate developer with experience in building scalable web applications, modern UI libraries, and developer tooling. I love working with monorepos, automation, and delivering delightful user experiences.",
  links: [
    { label: "GitHub", url: "https://github.com/your-github" },
    { label: "LinkedIn", url: "https://linkedin.com/in/your-linkedin" },
    { label: "Email", url: "mailto:your@email.com" },
    { label: "Instagram", url: "https://instagram.com/your-instagram" },
  ],
}

const tabProjects = [
  {
    name: "@adenta/core",
    description: "Core utilities and shared functionality for the @adenta ecosystem",
    path: "/core",
    key: "core",
  },
  {
    name: "@adenta/ui",
    description: "A beautiful and modern UI component library",
    path: "/ui",
    key: "ui",
  },
  {
    name: "@adenta/cli",
    description: "Command line tools for @adenta projects",
    path: "/cli",
    key: "cli",
  },
]

const experienceData = [
  {
    period: "2024 — PRESENT",
    title: "Senior Frontend Engineer, Accessibility",
    company: "Klaviyo",
    description:
      "Build and maintain critical components used to construct Klaviyo's frontend, across the whole product. Work closely with cross-functional teams, including developers, designers, and product managers, to implement and advocate for best practices in web accessibility.",
    techStack: ["JavaScript", "TypeScript", "React", "Storybook"],
    subtitles: [],
  },
  {
    period: "2022 — 2024",
    title: "Senior Frontend Engineer",
    company: "Upstatement",
    description:
      "Build, style, and ship high-quality websites, design systems, mobile apps, and digital experiences for a diverse array of projects for clients including Harvard Business School, Everytown for Gun Safety, Pratt Institute, Koala Health, Vanderbilt University, The 19th News, and more. Provide leadership within engineering department through close collaboration, knowledge shares, and mentorship.",
    techStack: ["JavaScript", "TypeScript", "React", "Node.js", "WordPress"],
    subtitles: ["Lead Engineer", "Engineer"],
  },
]

const blogPosts = [
  {
    id: 1,
    title: "Building Scalable React Applications with TypeScript",
    excerpt:
      "Learn how to structure large React applications using TypeScript for better maintainability and developer experience. We'll explore advanced patterns, type safety, and architectural decisions that make a difference in production applications.",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "React",
    image: "./assets/placeholder.svg?height=300&width=600",
    featured: true,
  },
  {
    id: 2,
    title: "Modern CSS Techniques for Better Performance",
    excerpt:
      "Explore advanced CSS features and optimization techniques that can significantly improve your website's performance and user experience.",
    date: "2024-01-12",
    readTime: "6 min read",
    category: "CSS",
    image: "./assets/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    title: "Next.js 14: What's New and How to Migrate",
    excerpt:
      "A comprehensive guide to the latest features in Next.js 14 and step-by-step migration instructions for existing projects.",
    date: "2024-01-10",
    readTime: "12 min read",
    category: "Next.js",
    image: "./assets/placeholder.svg?height=200&width=400",
  },
  {
    id: 4,
    title: "Mastering Git Workflows for Team Development",
    excerpt: "Best practices for Git workflows that improve collaboration and code quality in development teams.",
    date: "2024-01-08",
    readTime: "10 min read",
    category: "DevOps",
    image: "./assets/placeholder.svg?height=200&width=400",
  },
  {
    id: 5,
    title: "Understanding JavaScript Closures and Scope",
    excerpt:
      "Deep dive into JavaScript closures, lexical scope, and how they affect your code's behavior and performance.",
    date: "2024-01-05",
    readTime: "7 min read",
    category: "JavaScript",
    image: "./assets/placeholder.svg?height=200&width=400",
  },
  {
    id: 6,
    title: "Database Design Patterns for Modern Applications",
    excerpt: "Essential database design patterns and best practices for building robust and scalable applications.",
    date: "2024-01-03",
    readTime: "15 min read",
    category: "Database",
    image: "./assets/placeholder.svg?height=200&width=400",
  },
  {
    id: 7,
    title: "API Security Best Practices",
    excerpt:
      "Comprehensive guide to securing your APIs with authentication, authorization, and other security measures.",
    date: "2024-01-01",
    readTime: "9 min read",
    category: "Security",
    image: "./assets/placeholder.svg?height=200&width=400",
  },
]

// MSW Handlers
export const handlers = [
  // Get bio/profile information
  http.get('/api/bio', () => {
    return HttpResponse.json({
      success: true,
      data: bio,
    })
  }),

  // Get tab projects
  http.get('/api/projects', () => {
    return HttpResponse.json({
      success: true,
      data: tabProjects,
    })
  }),

  // Get single project by key
  http.get('/api/projects/:key', ({ params }) => {
    const { key } = params
    const project = tabProjects.find(p => p.key === key)
    
    if (!project) {
      return HttpResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      success: true,
      data: project,
    })
  }),

  // Get experience/work history
  http.get('/api/experience', () => {
    return HttpResponse.json({
      success: true,
      data: experienceData,
    })
  }),

  // Get all blog posts
  http.get('/api/blog', ({ request }) => {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const featured = url.searchParams.get('featured')
    const limit = url.searchParams.get('limit')

    let filteredPosts = [...blogPosts]

    // Filter by category
    if (category) {
      filteredPosts = filteredPosts.filter(
        post => post.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Filter by featured status
    if (featured === 'true') {
      filteredPosts = filteredPosts.filter(post => post.featured === true)
    }

    // Limit results
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredPosts = filteredPosts.slice(0, limitNum)
      }
    }

    return HttpResponse.json({
      success: true,
      data: filteredPosts,
      meta: {
        total: blogPosts.length,
        filtered: filteredPosts.length,
        categories: [...new Set(blogPosts.map(post => post.category))],
      },
    })
  }),

  // Get single blog post by ID
  http.get('/api/blog/:id', ({ params }) => {
    const { id } = params;
    const postId = parseInt(id as string, 10);
    const post = blogPosts.find(p => p.id === postId)
    
    if (!post) {
      return HttpResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      success: true,
      data: post,
    })
  }),

  // Get blog categories
  http.get('/api/blog/categories', () => {
    const categories = [...new Set(blogPosts.map(post => post.category))]
    return HttpResponse.json({
      success: true,
      data: categories,
    })
  }),

  // Get featured blog posts
  http.get('/api/blog/featured', () => {
    const featuredPosts = blogPosts.filter(post => post.featured === true)
    return HttpResponse.json({
      success: true,
      data: featuredPosts,
    })
  }),

  // Get portfolio summary/stats
  http.get('/api/stats', () => {
    const stats = {
      totalProjects: tabProjects.length,
      totalBlogPosts: blogPosts.length,
      totalExperience: experienceData.length,
      categories: [...new Set(blogPosts.map(post => post.category))].length,
      techStack: [...new Set(experienceData.flatMap(exp => exp.techStack))],
    }

    return HttpResponse.json({
      success: true,
      data: stats,
    })
  }),
]