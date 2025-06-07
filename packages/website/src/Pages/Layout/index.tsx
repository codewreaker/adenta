import Hero from '../Hero';
import Header from '../Header';
import './styles.css';

export default function Layout() {
  return (
    <div className="layout-root">
      <Header/>
      <main className="layout-content">
        <Hero />
      </main>
      <footer className="layout-footer">
        <p>&copy; {new Date().getFullYear()} Adenta</p>
      </footer>
    </div>
  );
}
