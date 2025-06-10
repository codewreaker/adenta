import {
  CubeIcon,
  RectangleStackIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

import Terminal from '../../Components/Terminal';
import IconWrapper from '../../Components/IconWrapper';
import GeometricCard from '../../Components/GeometricCard';
import './projects.css';

const icons = {
  core: IconWrapper(CubeIcon),
  ui: IconWrapper(RectangleStackIcon),
  cli: IconWrapper(CommandLineIcon),
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

export default function Projects() {
  return (
    <motion.div
      id="projects"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="portfolio-projects gradient-bg"
    >
      <GeometricCard customStyle={{ width: 360 }} />
      <Terminal tabProjects={tabProjects} />
    </motion.div>
  );
}
