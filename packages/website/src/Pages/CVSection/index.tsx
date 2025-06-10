'use client';

import type React from 'react';
import { useState } from 'react';
import { scrollToSection } from '../../utils/scrollToSection';
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
                  onClick={scrollToSection('about', setActiveSection)}
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
                  onClick={scrollToSection('experience', setActiveSection)}
                >
                  <span className="nav-indicator"></span>
                  <span className="nav-text">EXPERIENCE</span>
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${
                    activeSection === 'cvprojects' ? 'active' : ''
                  }`}
                  onClick={scrollToSection('cvprojects', setActiveSection)}
                >
                  <span className="nav-indicator"></span>
                  <span className="nav-text">PROJECTS</span>
                </button>
              </li>
            </ul>
          </nav>
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

        <section id="cvprojects" className="content-section">
          <p>Coming soon...</p>
        </section>
      </div>
    </div>
  );
};

export default CVInteractive;
