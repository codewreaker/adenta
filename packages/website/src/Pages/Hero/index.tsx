import { motion } from 'framer-motion';

import './hero.css';

import {
  EnvelopeIcon,
  HomeIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

interface Link {
  label: 'GitHub' | 'LinkedIn' | 'Email';
  url: string;
}
interface SocialLinksProps {
  links: Link[];
}


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
    <div className="portfolio-hero">
      <div className="portfolio-intro">
        <div className="portfolio-hello">
          — Hello <span style={{ color: 'var(--color-text)' }}>I'm</span>
        </div>
        <h1 className="portfolio-name">{bio.name}</h1>
      </div>

      <motion.div
        className="portfolio-hero-content gradient-bg"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="portfolio-hero-main">
          <div className="portfolio-title">{bio.title}</div>
          <div className="portfolio-description">{bio.description}</div>
          <SocialLinks links={bio.links} />
          <button className="portfolio-learn-btn" onClick={()=>window.location.href="#projects"}>Projects</button>
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
    </div>
  );
}
