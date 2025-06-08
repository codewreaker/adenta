import React from 'react';
import './footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="terminal-footer gradient-bg">
            <div className="footer-content">
                <div className="footer-left">
                    <span className="terminal-prompt">israel@adenta:~$</span>
                    <span className="terminal-text">echo "Made with ❤️ by Israel" © {currentYear}</span>
                </div>
                <div className="footer-right">
                    <div className="social-links">
                        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="social-link">
                            GitHub
                        </a>
                        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="social-link">
                            LinkedIn
                        </a>
                        <a href="mailto:your.email@example.com" className="social-link">
                            Email
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
