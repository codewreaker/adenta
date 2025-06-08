import { ReactNode, useState } from 'react';
import './terminal.css'; 

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
<div className="terminal">
            {/* Terminal Header */}
            <div className="terminal-header">
                {/* Mac window controls */}
                <span className="window-controls">
                    <span className="window-button window-button-close" />
                    <span className="window-button window-button-minimize" />
                    <span className="window-button window-button-maximize" />
                </span>
                <span className="terminal-user">
                    israel@adenta:~$
                </span>
            </div>
            {/* Terminal Tabs */}
            <div className="terminal-tabs">
                {tabProjects.map((project) => (
                    <button
                        key={project.key}
                        className={`terminal-tab${activeTab === project.key ? ' active' : ''}`}
                        onClick={() => setActiveTab(project.key)}
                        type="button"
                    >
                        {project.icon}
                        <span>{project.name.replace('@adenta/', '')}</span>
                    </button>
                ))}
            </div>
            {/* Terminal Content */}
            <div className="portfolio-tab-content">
                {activeProject ? (
                    <>
                        <div className="project-title">
                            <span>{activeProject.name}</span>
                        </div>
                        <div className="project-description">
                            {activeProject.description}
                        </div>
                        <div className="project-link">
                            <a href={activeProject.path}>
                                Open Project &rarr;
                            </a>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default Terminal;