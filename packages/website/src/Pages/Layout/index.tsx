import Hero from '../Hero';
import Header from '../Header';
import Footer from '../Footer';
import CVSection from '../CVSection';
import './styles.css';
import Projects from '../Projects';

export default function Layout() {
  return (
    <div className="layout-root">
      <Header/>
      <main className="layout-content">
        <Hero />
        <Projects />
        <CVSection/>
      </main>
      <Footer />
    </div>
  );
}
