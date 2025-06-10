import type React from "react"
import "./bloglist.css"

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

const BlogList: React.FC = () => {
  // Sample blog data
  const blogPosts: BlogPost[] = [
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

  const featuredPost = blogPosts.find((post) => post.featured) || blogPosts[0]
  const relatedPosts = blogPosts.filter((post) => post.id !== featuredPost.id).slice(0, 3)
  const allPosts = blogPosts.filter((post) => post.id !== featuredPost.id)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div id='blog' className="blog-container">
      <div className="blog-header">
        <h1 className="blog-title">Blog</h1>
        <p className="blog-subtitle">
          Thoughts on development, design, and technology. Sharing insights from building scalable web applications,
          working with modern frameworks, and navigating the ever-evolving landscape of frontend engineering.
        </p>
      </div>

      <div className="blog-content">
        {/* Left Section - Featured Post and Related Posts */}
        <div className="blog-left">
          {/* Featured Post */}
          <article className="featured-post">
            <div className="featured-badge">Latest</div>
            <div className="featured-image">
              <img src={featuredPost.image || "./assets/placeholder.svg"} alt={featuredPost.title} />
            </div>
            <div className="featured-content">
              <div className="post-meta">
                <span className="category">{featuredPost.category}</span>
                <span className="date">{formatDate(featuredPost.date)}</span>
                <span className="read-time">{featuredPost.readTime}</span>
              </div>
              <h2 className="featured-title">{featuredPost.title}</h2>
              <p className="featured-excerpt">{featuredPost.excerpt}</p>
              <button className="read-more-btn">Read Article</button>
            </div>
          </article>

          {/* Related Posts */}
          <div className="related-posts">
            <h3 className="related-title">Recent Articles</h3>
            <div className="related-grid">
              {relatedPosts.map((post) => (
                <article key={post.id} className="related-post">
                  <div className="related-image">
                    <img src={post.image || "./assets/placeholder.svg"} alt={post.title} />
                  </div>
                  <div className="related-content">
                    <div className="post-meta">
                      <span className="category">{post.category}</span>
                      <span className="read-time">{post.readTime}</span>
                    </div>
                    <h4 className="related-post-title">{post.title}</h4>
                    <p className="related-excerpt">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - All Blog Posts */}
        <div className="blog-right">
          <div className="all-posts">
            <h3 className="all-posts-title">All Blog Posts</h3>
            <div className="posts-list">
              {allPosts.map((post) => (
                <article key={post.id} className="post-item">
                  <div className="post-image">
                    <img src={post.image || "./assets/placeholder.svg"} alt={post.title} />
                  </div>
                  <div className="post-content">
                    <div className="post-meta">
                      <span className="category">{post.category}</span>
                      <span className="date">{formatDate(post.date)}</span>
                    </div>
                    <h4 className="post-title">{post.title}</h4>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <div className="post-footer">
                      <span className="read-time">{post.readTime}</span>
                      <button className="read-link">Read</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogList
