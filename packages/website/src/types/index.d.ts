// Type Definitions
interface Link {
  label: "GitHub" | "LinkedIn" | "Email" | "Instagram"
  url: string
}

interface BlogPost {
  id: number
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  image: string
  featured?: boolean
}

interface ExperienceItem {
  period: string
  title: string
  company: string
  description: string
  techStack: string[]
  subtitles?: string[]
}
