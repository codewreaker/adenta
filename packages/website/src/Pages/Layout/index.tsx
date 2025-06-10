import Hero from '../Hero';
import Header from '../Header';
import Footer from '../Footer';
import CVSection from '../CVSection';
import BlogList from '../Blog/BlogList';
import '../../styles.css';
import Projects from '../Projects';
import {MotionGlobalConfig} from 'framer-motion';

MotionGlobalConfig.skipAnimations = true;

export default function Layout() {
  return (
    <div className="layout-root">
      <Header/>
      <main className="layout-content">
        <Hero />
        <Projects />
        <CVSection/>
        <BlogList />
      </main>
      <Footer />
    </div>
  );
}
