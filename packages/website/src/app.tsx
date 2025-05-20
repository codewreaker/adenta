import { motion } from 'framer-motion';
import './app.css';

// Heroicons SVGs (outline style)
const icons = {
  core: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ff6a1a" width={32} height={32} style={{marginBottom: 8}}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
    </svg>
  ),
  ui: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ff6a1a" width={32} height={32} style={{marginBottom: 8}}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
    </svg>
  ),
  cli: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ff6a1a" width={32} height={32} style={{marginBottom: 8}}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 17v-2a2 2 0 012-2h12a2 2 0 012 2v2M8 13V7a4 4 0 118 0v6" />
    </svg>
  ),
};

const bio = {
  name: 'Israel Agyeman-Prempeh',
  title: 'Full Stack Developer',
  description:
    'I am a passionate developer with experience in building scalable web applications, modern UI libraries, and developer tooling. I love working with monorepos, automation, and delivering delightful user experiences.',
  links: [
    { label: 'GitHub', url: 'https://github.com/your-github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/your-linkedin' },
    { label: 'Email', url: 'mailto:your@email.com' },
  ],
};

const socialLinks = [
  { icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={28} height={28}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.591 7.591a2.25 2.25 0 01-3.182 0L3.909 8.584A2.25 2.25 0 013.25 6.993V6.75" />
      </svg>
    ), label: 'Email', url: 'mailto:your@email.com' },
  { icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={28} height={28}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v7.5A2.25 2.25 0 006.75 19.5h2.25m9-9.75v7.5a2.25 2.25 0 01-2.25 2.25h-2.25m-6.75 0h6.75" />
      </svg>
    ), label: 'GitHub', url: 'https://github.com/your-github' },
  { icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={28} height={28}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75A2.25 2.25 0 0118.75 6v12a2.25 2.25 0 01-2.25 2.25h-9A2.25 2.25 0 015.25 18V6A2.25 2.25 0 017.5 3.75h9z" />
      </svg>
    ), label: 'LinkedIn', url: 'https://linkedin.com/in/your-linkedin' },
];

import { useState } from 'react';

const tabProjects = [
  {
    name: '@adenta/core',
    description: 'Core utilities and shared functionality for the @adenta ecosystem',
    path: '/core',
    icon: icons.core,
    key: 'core',
  },
  {
    name: '@adenta/ui',
    description: 'A beautiful and modern UI component library',
    path: '/ui',
    icon: icons.ui,
    key: 'ui',
  },
  {
    name: '@adenta/cli',
    description: 'Command line tools for @adenta projects',
    path: '/cli',
    icon: icons.cli,
    key: 'cli',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(tabProjects[0].key);
  const activeProject = tabProjects.find(p => p.key === activeTab);

  return (
    <div className="portfolio-root">
      {/* Sidebar Social Icons */}
      <div className="portfolio-sidebar">
        {socialLinks.map((link) => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label}>
            {link.icon}
          </a>
        ))}
      </div>

      {/* Hero Section */}
      <motion.div
        className="portfolio-hero"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="portfolio-hero-content">
          <div className="portfolio-hello">— Hello</div>
          <h1 className="portfolio-name">I'm <span style={{ color: '#ff6a1a' }}>{bio.name}</span></h1>
          <div className="portfolio-title">{bio.title}</div>
          <div className="portfolio-description">{bio.description}</div>
          <div className="portfolio-links">
            {bio.links.map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
            ))}
          </div>
          <button className="portfolio-learn-btn">Learn more</button>
        </div>
        <div className="portfolio-avatar">
          <span className="portfolio-avatar-emoji" role="img" aria-label="avatar">🧑‍💻</span>
        </div>
      </motion.div>

      {/* Projects Tabs Section */}
      <motion.div
        className="portfolio-section"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <div className="portfolio-section-card">
          <h2 className="portfolio-section-title">Projects in this Monorepo</h2>
          <div className="portfolio-tabs">
            {tabProjects.map((project) => (
              <button
                key={project.key}
                className={`portfolio-tab${activeTab === project.key ? ' active' : ''}`}
                onClick={() => setActiveTab(project.key)}
                type="button"
              >
                {project.icon}
                <span>{project.name.replace('@adenta/', '')}</span>
              </button>
            ))}
          </div>
          <div className="portfolio-tab-content">
            {activeProject ? (
              <>
                <a href={activeProject.path} className="portfolio-project-title" style={{ fontSize: '1.3rem', marginBottom: 8, color: '#ff6a1a' }}>{activeProject.name}</a>
                <p className="portfolio-project-desc" style={{ fontSize: '1.08rem', marginTop: 8 }}>{activeProject.description}</p>
              </>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Nx Quick Start Section */}
      <motion.div
        className="portfolio-section"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <div className="portfolio-section-card">
          <h2 className="portfolio-section-title" style={{ fontSize: '1.5rem' }}>Nx Quick Start</h2>
          <ul className="portfolio-nx-list">
            <li><b>Build:</b> <code>nx build website</code></li>
            <li><b>Test:</b> <code>nx test website</code></li>
            <li><b>Lint:</b> <code>nx lint website</code></li>
            <li><b>Graph:</b> <code>nx graph</code></li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
