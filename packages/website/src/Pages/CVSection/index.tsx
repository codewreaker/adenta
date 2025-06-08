"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import "./CVSection.css"

export interface CVSectionProps {
  className?: string
}

const CVSection: React.FC<CVSectionProps> = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.3, rootMargin: "-50px" },
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el
  }

  const isVisible = (id: string) => visibleSections.has(id)

  return (
    <div id='cv' className={`cv-container gradient-bg`}>
      <div className="cv-paper">

        {/* Professional Summary */}
        <section
          id="cv-summary"
          ref={setSectionRef("cv-summary")}
          className={`cv-section ${isVisible("cv-summary") ? "visible" : ""}`}
        >
          <h3 className="section-title">Professional Summary</h3>
          <div className="section-content">
            <p>
              Passionate Full Stack Developer with 5+ years of experience building scalable web applications and modern
              UI libraries. Expertise in React, Node.js, TypeScript, and cloud technologies. Proven track record of
              delivering high-quality solutions and leading development teams to success.
            </p>
          </div>
        </section>

        {/* Technical Skills */}
        <section
          id="cv-skills"
          ref={setSectionRef("cv-skills")}
          className={`cv-section ${isVisible("cv-skills") ? "visible" : ""}`}
        >
          <h3 className="section-title">Technical Skills</h3>
          <div className="section-content">
            <div className="skills-grid">
              <div className="skill-category">
                <h4>Frontend</h4>
                <div className="skill-tags">
                  <span className="skill-tag">React</span>
                  <span className="skill-tag">TypeScript</span>
                  <span className="skill-tag">Next.js</span>
                  <span className="skill-tag">Vue.js</span>
                  <span className="skill-tag">CSS3</span>
                  <span className="skill-tag">Tailwind</span>
                </div>
              </div>
              <div className="skill-category">
                <h4>Backend</h4>
                <div className="skill-tags">
                  <span className="skill-tag">Node.js</span>
                  <span className="skill-tag">Python</span>
                  <span className="skill-tag">Express</span>
                  <span className="skill-tag">FastAPI</span>
                  <span className="skill-tag">PostgreSQL</span>
                  <span className="skill-tag">MongoDB</span>
                </div>
              </div>
              <div className="skill-category">
                <h4>DevOps & Tools</h4>
                <div className="skill-tags">
                  <span className="skill-tag">AWS</span>
                  <span className="skill-tag">Docker</span>
                  <span className="skill-tag">Kubernetes</span>
                  <span className="skill-tag">CI/CD</span>
                  <span className="skill-tag">Git</span>
                  <span className="skill-tag">Linux</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Experience */}
        <section
          id="cv-experience"
          ref={setSectionRef("cv-experience")}
          className={`cv-section ${isVisible("cv-experience") ? "visible" : ""}`}
        >
          <h3 className="section-title">Professional Experience</h3>
          <div className="section-content">
            <div className="experience-item">
              <div className="experience-header">
                <h4 className="job-title">Senior Full Stack Developer</h4>
                <span className="company">TechCorp Inc.</span>
                <span className="duration">2022 - Present</span>
              </div>
              <ul className="achievements">
                <li>Led development of microservices architecture serving 1M+ users</li>
                <li>Improved application performance by 40% through code optimization</li>
                <li>Mentored 5 junior developers and established coding standards</li>
                <li>Implemented CI/CD pipelines reducing deployment time by 60%</li>
              </ul>
            </div>

            <div className="experience-item">
              <div className="experience-header">
                <h4 className="job-title">Full Stack Developer</h4>
                <span className="company">StartupXYZ</span>
                <span className="duration">2020 - 2022</span>
              </div>
              <ul className="achievements">
                <li>Built responsive web applications using React and Node.js</li>
                <li>Designed and implemented RESTful APIs and GraphQL endpoints</li>
                <li>Collaborated with UX/UI designers to create intuitive user interfaces</li>
                <li>Integrated third-party services and payment processing systems</li>
              </ul>
            </div>

            <div className="experience-item">
              <div className="experience-header">
                <h4 className="job-title">Frontend Developer</h4>
                <span className="company">WebSolutions Ltd.</span>
                <span className="duration">2019 - 2020</span>
              </div>
              <ul className="achievements">
                <li>Developed interactive web applications using modern JavaScript frameworks</li>
                <li>Optimized website performance and improved SEO rankings</li>
                <li>Collaborated with cross-functional teams in Agile environment</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education */}
        <section
          id="cv-education"
          ref={setSectionRef("cv-education")}
          className={`cv-section ${isVisible("cv-education") ? "visible" : ""}`}
        >
          <h3 className="section-title">Education</h3>
          <div className="section-content">
            <div className="education-item">
              <h4 className="degree">Bachelor of Science in Computer Science</h4>
              <span className="school">University of California, Berkeley</span>
              <span className="graduation">2019</span>
              <p className="education-details">
                Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems, Computer
                Networks
              </p>
            </div>
          </div>
        </section>


        {/* Certifications */}
        <section
          id="cv-certifications"
          ref={setSectionRef("cv-certifications")}
          className={`cv-section ${isVisible("cv-certifications") ? "visible" : ""}`}
        >
          <h3 className="section-title">Certifications</h3>
          <div className="section-content">
            <div className="certification-grid">
              <div className="certification-item">
                <h4>AWS Certified Solutions Architect</h4>
                <span className="cert-date">2023</span>
              </div>
              <div className="certification-item">
                <h4>Google Cloud Professional Developer</h4>
                <span className="cert-date">2022</span>
              </div>
              <div className="certification-item">
                <h4>MongoDB Certified Developer</h4>
                <span className="cert-date">2021</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default CVSection
