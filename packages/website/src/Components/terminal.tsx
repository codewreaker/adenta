import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';



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
    tabProjects = [],
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
                width: '100%', // 630 * 0.8
                borderRadius: 10, // 12 * 0.8
                margin: '3% auto',
                boxShadow:
                    '0 5px 26px 0 rgba(0,0,0,0.10), 0 1px 5px 0 rgba(0,0,0,0.08)',
                background: '#18181b',
                border: '1px solid #232329',
                overflow: 'hidden',
                fontFamily: 'monospace',
                transform: 'scale(0.8)',
                transformOrigin: 'top center'
            }}
        >
            {/* Terminal Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 29, // 36 * 0.8
                    background: '#232329',
                    borderBottom: '1px solid #232329',
                    padding: '0 13px', // 16 * 0.8
                    gap: 6, // 8 * 0.8
                    userSelect: 'none',
                }}
            >
                {/* Mac window controls */}
                <span style={{ display: 'flex', gap: 5, marginRight: 10 }}>
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#ff5f56',
                            border: '1px solid #e0443e',
                        }}
                    />
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#ffbd2e',
                            border: '1px solid #dea123',
                        }}
                    />
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#27c93f',
                            border: '1px solid #13a10e',
                        }}
                    />
                </span>
                <span style={{ color: '#fff', fontSize: 11, opacity: 0.7 }}>
                    israel@adenta:~$
                </span>
            </div>
            {/* Terminal Tabs */}
            <div
                style={{
                    display: 'flex',
                    background: '#18181b',
                    borderBottom: '1px solid #232329',
                    padding: '2px 6px 0px 6px',
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
                            borderRadius: '4px 4px 0 0',
                            padding: '6px 10px 5px 6px',
                            fontSize: 12,
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
                    minHeight: 72,
                    padding: '16px 16px 13px 16px',
                    fontSize: 13,
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
                        <div style={{
                            color: '#bdbdbd',
                            fontSize: 14,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '95%'
                        }}>
                            {activeProject.description}
                        </div>
                        <div style={{ marginTop: 14 }}>
                            <a
                                href={activeProject.path}
                                style={{
                                    color: '#ff6a1a',
                                    textDecoration: 'underline',
                                    fontSize: 11,
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