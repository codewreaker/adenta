'use client';

import type React from 'react';
import { useState } from 'react';
import './cvinteractive.css';

export const experienceData = [
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
  }
];

type ExperienceItemProps = {
  period: string;
  title: string;
  company: string;
  description: string;
  techStack: string[];
  subtitles?: string[];
};

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  period,
  title,
  company,
  description,
  techStack,
  subtitles,
}) => (
  <div className="experience-item">
    <div className="experience-header">
      <div className="experience-period">{period}</div>
      <div className="experience-details">
        <h3 className="experience-title">
          {title} · {company}
          <svg
            className="external-link"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15,3 21,3 21,9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </h3>
        {subtitles?.map((subtitle, index) => (
          <div key={index} className="experience-subtitle">
            {subtitle}
          </div>
        ))}
        <p className="experience-description">{description}</p>
        <div className="tech-stack">
          {techStack.map((tech, index) => (
            <span key={index} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CVInteractive: React.FC = () => {
  const [activeSection, setActiveSection] = useState('about');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Usage example:

  return (
    <div id="cv" className="cv-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="header-section">
            <h1 className="name">Curriculum Vitae</h1>
            <h2 className="title">Front End Engineer</h2>
            <p className="subtitle">
              In the past, I've had the opportunity to develop software across a
              variety of settings — from{' '}
              <span className="highlight">advertising agencies</span> and{' '}
              <span className="highlight">large corporations</span> to{' '}
              <span className="highlight">start-ups</span> and
              <span className="highlight"> small digital product studios</span>.
              Additionally, I also released a{' '}
              <span className="highlight">comprehensive video course</span> a
              few years ago, guiding learners through building a web app with
              the Spotify API.
            </p>
          </div>

          <nav className="navigation">
            <ul>
              <li>
                <button
                  className={`nav-link ${
                    activeSection === 'about' ? 'active' : ''
                  }`}
                  onClick={() => scrollToSection('about')}
                >
                  <span className="nav-indicator"></span>
                  <span className="nav-text">ABOUT</span>
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${
                    activeSection === 'experience' ? 'active' : ''
                  }`}
                  onClick={() => scrollToSection('experience')}
                >
                  <span className="nav-indicator"></span>
                  <span className="nav-text">EXPERIENCE</span>
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${
                    activeSection === 'projects' ? 'active' : ''
                  }`}
                  onClick={() => scrollToSection('projects')}
                >
                  <span className="nav-indicator"></span>
                  <span className="nav-text">PROJECTS</span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="social-links">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://goodreads.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Goodreads"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.3 17.5c-1.2 0-2.7-.8-2.7-2.1 0-1.1.7-1.5 1.6-1.9.9-.4 2.2-.6 3.1-.6v-.4c0-.8-.4-1.4-1.4-1.4-.8 0-1.5.4-1.7 1.2l-1.9-.2c.2-1.5 1.7-2.6 3.6-2.6 2.2 0 3.3 1.2 3.3 3.1v5.8h-1.8v-1.2c-.6.9-1.5 1.4-2.1 1.4zm.1-1.4c.8 0 1.6-.6 1.6-1.5v-.8c-.6 0-1.7.1-2.3.4-.4.2-.7.5-.7.9 0 .6.6 1 1.4 1zM8.4 5.6c-2.1 0-3.8 1.7-3.8 3.8s1.7 3.8 3.8 3.8 3.8-1.7 3.8-3.8-1.7-3.8-3.8-3.8zm0 6c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <section id="experience" className="content-section">
          {experienceData.map((item, index) => (
            <ExperienceItem
              key={index}
              period={item.period}
              title={item.title}
              company={item.company}
              description={item.description}
              techStack={item.techStack}
              subtitles={item.subtitles}
            />
          ))}
        </section>

        <section id="projects" className="content-section">
          <p>Coming soon...</p>
        </section>
      </div>
    </div>
  );
};

export default CVInteractive;
