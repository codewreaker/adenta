import { useState } from 'react';
import { EnvelopeIcon, HomeIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Terminal from './components/terminal';
const DEBUG_PAUSE = true; // Set to true to pause all framer-motion animations

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
      {/* Hero Section */}
      <motion.div
        className="portfolio-hero"
        initial={{ opacity: 0, y: -40 }}
        animate={DEBUG_PAUSE ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={DEBUG_PAUSE ? {} : { duration: 0.7 }}
      >
        <div className="portfolio-hero-content">
          <div className="portfolio-hello">— Hello</div>
          <h1 className="portfolio-name">I'm <span style={{ color: '#ff6a1a' }}>{bio.name}</span></h1>
          <div className="portfolio-title">{bio.title}</div>
          <div className="portfolio-description">{bio.description}</div>
          <div className="portfolio-links">
        {bio.links.map((link) => {
          let icon = null;
          if (link.label === 'GitHub') icon = <HomeIcon width={22} height={22} style={{verticalAlign: 'middle', marginRight: 6}} />;
          if (link.label === 'LinkedIn') icon = <DevicePhoneMobileIcon width={22} height={22} style={{verticalAlign: 'middle', marginRight: 6}} />;
          if (link.label === 'Email') icon = <EnvelopeIcon width={22} height={22} style={{verticalAlign: 'middle', marginRight: 6}} />;
          return (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">
          {icon}{link.label}
            </a>
          );
        })}
          </div>
          <button className="portfolio-learn-btn">Learn more</button>
        </div>
          <motion.img
          src="assets/avatar-3D.png"
          alt="avatar"
          className="portfolio-asset portfolio-avatar"
          initial={{ y: 0, scale: 1 }}
          animate={DEBUG_PAUSE ? { y: 0, scale: 1 } : { y: [0, -10, 0], scale: [1, 1.05, 1] }}
          transition={DEBUG_PAUSE ? {} : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* 3D PNG assets with subtle animations */}
        <motion.img
          src="assets/cloud_icon.png"
          alt="Cloud"
          className="portfolio-asset portfolio-asset-cloud"
          initial={{ x: -20 }}
          animate={DEBUG_PAUSE ? { x: -20 } : { x: [ -20, 40, -20 ] }}
          transition={DEBUG_PAUSE ? {} : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.img
          src="assets/typescript.png"
          alt="TypeScript"
          className="portfolio-asset portfolio-asset-typescript"
          initial={{ y: 0, rotate: 0 }}
          animate={DEBUG_PAUSE ? { y: 0, rotate: 0 } : { y: [0, -18, 0], rotate: [0, 10, 0] }}
          transition={DEBUG_PAUSE ? {} : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.img
          src="assets/mug.png"
          alt="Mug"
          className="portfolio-asset portfolio-asset-mug"
          initial={{ y: 0 }}
          animate={DEBUG_PAUSE ? { y: 0 } : { y: [0, 12, 0] }}
          transition={DEBUG_PAUSE ? {} : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Projects Tabs Section */}
      <Terminal tabProjects={tabProjects}/>

    </div>
  );
}
