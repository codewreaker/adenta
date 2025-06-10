import Header from '../Header';
import Footer from '../Footer';
import Home from '../Home';
import '../../styles.css';
import {MotionGlobalConfig} from 'framer-motion';

MotionGlobalConfig.skipAnimations = false;

export default function Layout() {
  return (
    <div className="layout-root">
      <Header/>
      <main className="layout-content">
        <Home/>
      </main>
      <Footer />
    </div>
  );
}
