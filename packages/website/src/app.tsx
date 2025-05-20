import { motion } from 'framer-motion';

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

const projects = [
  {
    name: '@adenta/core',
    description: 'Core utilities and shared functionality for the @adenta ecosystem',
    path: '/core',
  },
  {
    name: '@adenta/ui',
    description: 'A beautiful and modern UI component library',
    path: '/ui',
  },
  {
    name: '@adenta/cli',
    description: 'Command line tools for @adenta projects',
    path: '/cli',
  },
];

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #fff 100%)', fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,\'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, \'Noto Sans\', sans-serif' }}>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ maxWidth: 700, margin: '0 auto', padding: '48px 16px 0 16px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{bio.name}</h1>
          <h2 style={{ fontSize: '1.3rem', color: '#6366f1', fontWeight: 600, margin: '8px 0 0 0' }}>{bio.title}</h2>
          <p style={{ color: '#444', fontSize: '1.1rem', margin: '18px 0 0 0' }}>{bio.description}</p>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 18 }}>
            {bio.links.map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 500, borderBottom: '2px solid #6366f1', margin: '0 8px' }}>{link.label}</a>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}
      >
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.04)', padding: 32, marginBottom: 32 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: 24, textAlign: 'center' }}>Projects in this Monorepo</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, justifyContent: 'center' }}>
            {projects.map((project) => (
              <motion.div
                key={project.name}
                whileHover={{ scale: 1.04, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                style={{ background: '#f8fafc', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24, width: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer' }}
              >
                <div style={{ fontSize: 32, color: '#6366f1', marginBottom: 12 }}>📦</div>
                <a href={project.path} style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3730a3', textDecoration: 'none', marginBottom: 6, display: 'inline-block' }}>{project.name}</a>
                <p style={{ color: '#555', fontSize: '0.98rem', textAlign: 'center', margin: 0 }}>{project.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{ maxWidth: 700, margin: '0 auto', padding: '0 16px 48px 16px' }}
      >
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.04)', padding: 32, marginTop: 32 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 18 }}>Nx Quick Start</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 16 }}>
              <b>Build:</b> <code style={{ background: '#f3f4f6', borderRadius: 4, padding: '2px 6px' }}>nx build website</code>
            </li>
            <li style={{ marginBottom: 16 }}>
              <b>Test:</b> <code style={{ background: '#f3f4f6', borderRadius: 4, padding: '2px 6px' }}>nx test website</code>
            </li>
            <li style={{ marginBottom: 16 }}>
              <b>Lint:</b> <code style={{ background: '#f3f4f6', borderRadius: 4, padding: '2px 6px' }}>nx lint website</code>
            </li>
            <li>
              <b>Graph:</b> <code style={{ background: '#f3f4f6', borderRadius: 4, padding: '2px 6px' }}>nx graph</code>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
