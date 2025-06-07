import { motion } from 'framer-motion';
import Terminal from '../../Components/terminal';
import IconWrapper from '../../Components/IconWrapper';
import './hero.css';

import {
  EnvelopeIcon,
  HomeIcon,
  DevicePhoneMobileIcon,
  CubeIcon,
  RectangleStackIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';

interface Link {
  label: 'GitHub' | 'LinkedIn' | 'Email';
  url: string;
}
interface SocialLinksProps {
  links: Link[];
}

const icons = {
  core: IconWrapper(CubeIcon),
  ui: IconWrapper(RectangleStackIcon),
  cli: IconWrapper(CommandLineIcon),
};

const bio: {
  name: string;
  title: string;
  description: string;
  links: Link[];
} = {
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
    description:
      'Core utilities and shared functionality for the @adenta ecosystem',
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


const SocialLinks = ({ links }: SocialLinksProps) => {
  const iconMap: Record<Link['label'], React.ElementType> = {
    GitHub: HomeIcon,
    LinkedIn: DevicePhoneMobileIcon,
    Email: EnvelopeIcon,
  };

  return (
    <div className="portfolio-links">
      {links.map((link) => {
        const Icon = iconMap[link.label];
        return (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {Icon && (
              <Icon
                width={22}
                height={22}
                style={{ verticalAlign: 'middle', marginRight: 6 }}
              />
            )}
            {link.label}
          </a>
        );
      })}
    </div>
  );
};

export default function Hero() {
  return (
    <motion.div
      className="portfolio-hero"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="portfolio-hero-content">
        <div className="portfolio-hello">— Hello</div>
        <h1 className="portfolio-name">
          I'm <span style={{ color: 'var(--color-primary)' }}>{bio.name}</span>
        </h1>
        <div className="portfolio-title">{bio.title}</div>
        <div className="portfolio-description">{bio.description}</div>
        <SocialLinks links={bio.links} />
        <button className="portfolio-learn-btn">Learn more</button>
        {/* Projects Tabs Section */}
        <Terminal tabProjects={tabProjects} />
      </div>
      <div className="portfolio-avatar">
        {/* 3D PNG assets with subtle animations */}
        <div className="electrons">
          <motion.img
            src="assets/python.png"
            alt="Python Icon"
            className="portfolio-asset asset-python"
            initial={{ x: -20 }}
            animate={{ x: [-20, 40, -20] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.img
            src="assets/typescript.png"
            alt="TypeScript"
            className="portfolio-asset asset-typescript"
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: [0, -18, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.img
            src="assets/rust.png"
            alt="Rust"
            className="portfolio-asset asset-rust"
            initial={{ y: 0 }}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div className="circular-mask">
          <motion.img
            //src="assets/avatar-3D.png"
            src="assets/bandw.jpeg"
            alt="avatar"
            height={'100%'}
            initial={{ y: 0, scale: 1 }}
            animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
