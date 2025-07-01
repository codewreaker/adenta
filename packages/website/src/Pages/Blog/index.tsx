import React, { useEffect, useState } from 'react';
import { portfolioAPI } from '../../mock-service/api.js';
import { formatDate } from '../../utils/formatDate.js';
import { createGenerator } from '@adenta/mdx-blog-gen';
import { useLiveQuery } from '@tanstack/react-db'
import '../Home/home.css';

// Define BlogPost type (replace with import if available)
type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  category?: string;
  date?: string;
  readTime?: string;
  featured?: boolean;
};

const gen = createGenerator({
  // GitHub repository configuration
  remote: {
    owner: 'codewreaker',           // GitHub username or organization
    repo: 'docs',        // Repository name containing your .md/.mdx files
    branch: 'main',                   // Branch to pull from (optional, defaults to 'main')
    docsPath: 'blogs',                // Path to your markdown files in the repo (optional)
    //token: process.env.GITHUB_TOKEN   // GitHub token for private repos (optional)
  },
  // Build options
  buildOptions: {
    minify: true,
    sourceMaps: false,
    publicPath: '/',
    mdx: {
      development: false,
      remarkPlugins: [],
      rehypePlugins: []
    }
  }
});

// BlogList component logic from Home
const BlogList: React.FC<{ data: BlogPost[] }> = ({ data }) => {
  const featuredPost = data.find((post) => post.featured) || data[0];
  const allPosts = data.filter((post) => post.id !== featuredPost.id);
  const collection = gen.collection;

  const { data: mdxBlog } = useLiveQuery(query =>
    query.from({ collection })
  )


  useEffect(()=>{
    gen.load()
  },[]);

  console.log(mdxBlog[0]?.content);
  return (
    <div id="blog" className="blog-container">
      <div className="blog-header">
        <h1 className="blog-title">Blog</h1>
        <p className="blog-subtitle">
          Thoughts on development, design, and technology. Sharing insights from
          building scalable web applications, working with modern frameworks,
          and navigating the ever-evolving landscape of frontend engineering.
        </p>
      </div>
      <div className="blog-content">
        <article className="featured-post">
          <div className="featured-badge">Latest</div>
          <div className="featured-image">
            <img
              src={featuredPost?.image || './assets/placeholder.svg'}
              alt={featuredPost?.title}
            />
          </div>
          <div className="featured-content">
            <div className="post-meta">
              <span className="category">{featuredPost?.category}</span>
              <span className="date">
                {formatDate(featuredPost?.date || new Date().toISOString())}
              </span>
              <span className="read-time">{featuredPost?.readTime}</span>
            </div>
            <h2 className="featured-title">{featuredPost?.title}</h2>
            <p className="featured-excerpt">{featuredPost?.excerpt}</p>
            <button className="portfolio-btn">Read Article</button>
          </div>
        </article>
        <div className="related-posts">
          <div className="related-grid">
            <div className="featured-badge">Latest</div>
            {allPosts.map((post: BlogPost) => (
              <article key={post.id} className="related-post">
                <div className="related-image">
                  <img
                    src={post.image || './assets/placeholder.svg'}
                    alt={post.title}
                  />
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
    </div>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioAPI.getBlogPosts({ limit: 7 }).then(({ data }) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading blog posts...</div>;
  if (!posts.length) return <div>No blog posts found.</div>;

  return <BlogList data={posts} />;
};

export default Blog; 