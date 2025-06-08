import Hero from '../Hero';
import Header from '../Header';
import Footer from '../Footer';
import './styles.css';
import Projects from '../Projects';

export default function Layout() {
  return (
    <div className="layout-root">
      <Header/>
      <main className="layout-content">
        <Hero />
        <Projects />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
