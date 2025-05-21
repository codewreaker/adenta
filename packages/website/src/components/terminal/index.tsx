import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { DEBUG_PAUSE } from '../../constants';


// Sample data for demonstration
const sampleTabProjects = [
    {
        key: 'project1',
        name: '@adenta/project1',
        icon: <span role="img" aria-label="folder">📁</span>,
        description: 'This is the first sample project.',
        path: '/projects/project1',
    },
    {
        key: 'project2',
        name: '@adenta/project2',
        icon: <span role="img" aria-label="folder">📁</span>,
        description: 'This is the second sample project.',
        path: '/projects/project2',
    },
];

// Types for props
type TabProject = {
    key: string;
    name: string;
    icon: ReactNode;
    description: string;
    path: string;
};

type TerminalProps = {
    tabProjects?: TabProject[];
    activeTabKey?: string;
    onTabChange?: (key: string) => void;
};

const Terminal = ({
    tabProjects = sampleTabProjects,
    activeTabKey,
    onTabChange,
}: TerminalProps) => {
    // Internal state if not controlled
    const [internalActiveTab, setInternalActiveTab] = useState(tabProjects[0]?.key);

    const activeTab = activeTabKey ?? internalActiveTab;
    const setActiveTab = (key: string) => {
        setInternalActiveTab(key);
        onTabChange?.(key);
    };

    const activeProject = tabProjects.find((p) => p.key === activeTab);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={DEBUG_PAUSE ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={DEBUG_PAUSE ? {} : { duration: 0.7, delay: 0.3 }}
            style={{
                minWidth: 630,
                borderRadius: 12,
                boxShadow:
                    '0 6px 32px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08)',
                background: '#18181b',
                border: '1px solid #232329',
                overflow: 'hidden',
                fontFamily: 'monospace',
            }}
        >
            {/* Terminal Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 36,
                    background: '#232329',
                    borderBottom: '1px solid #232329',
                    padding: '0 16px',
                    gap: 8,
                    userSelect: 'none',
                }}
            >
                {/* Mac window controls */}
                <span style={{ display: 'flex', gap: 6, marginRight: 12 }}>
                    <span
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: '#ff5f56',
                            border: '1px solid #e0443e',
                        }}
                    />
                    <span
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: '#ffbd2e',
                            border: '1px solid #dea123',
                        }}
                    />
                    <span
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: '#27c93f',
                            border: '1px solid #13a10e',
                        }}
                    />
                </span>
                <span style={{ color: '#fff', fontSize: 14, opacity: 0.7 }}>
                    israel@adenta:~$
                </span>
            </div>
            {/* Terminal Tabs */}
            <div
                style={{
                    display: 'flex',
                    background: '#18181b',
                    borderBottom: '1px solid #232329',
                    padding: '0 8px',
                    gap: 2,
                }}
            >
                {tabProjects.map((project) => (
                    <button
                        key={project.key}
                        className={`portfolio-tab${activeTab === project.key ? ' active' : ''}`}
                        onClick={() => setActiveTab(project.key)}
                        type="button"
                        style={{
                            background: activeTab === project.key ? '#232329' : 'transparent',
                            color: activeTab === project.key ? '#ff6a1a' : '#fff',
                            border: 'none',
                            borderRadius: '8px 8px 0 0',
                            padding: '7px 12px 6px 8px',
                            fontSize: 15,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 7,
                            cursor: 'pointer',
                        }}
                    >
                        {project.icon}
                        <span>{project.name.replace('@adenta/', '')}</span>
                    </button>
                ))}
            </div>
            {/* Terminal Content */}
            <div
                className="portfolio-tab-content"
                style={{
                    background: '#18181b',
                    color: '#fff',
                    minHeight: 90,
                    padding: '20px 20px 16px 20px',
                    fontSize: 16,
                    borderRadius: '0 0 12px 12px',
                    borderTop: '1px solid #232329',
                }}
            >
                {activeProject ? (
                    <>
                        <div style={{ marginBottom: 8 }}>
                            <span style={{ color: '#ff6a1a', fontWeight: 600 }}>
                                {activeProject.name}
                            </span>
                        </div>
                        <div style={{ color: '#bdbdbd', fontSize: 15 }}>
                            {activeProject.description}
                        </div>
                        <div style={{ marginTop: 14 }}>
                            <a
                                href={activeProject.path}
                                style={{
                                    color: '#ff6a1a',
                                    textDecoration: 'underline',
                                    fontSize: 14,
                                }}
                            >
                                Open Project &rarr;
                            </a>
                        </div>
                    </>
                ) : null}
            </div>
        </motion.div>
    );
};

export default Terminal;