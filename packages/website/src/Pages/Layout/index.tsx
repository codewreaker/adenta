import { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Home from '../Home';
import '../../styles.css';
import { MotionGlobalConfig } from 'framer-motion';
import { startMocking } from '../../mock-service/setup';

MotionGlobalConfig.skipAnimations = false;

export default function Layout() {
  const [mockingStarted, setMockingStarted] = useState(false);

  useEffect(() => {
    // Start MSW in development
    if (process.env.NODE_ENV === 'development') {
      startMocking().then(() => {
        setMockingStarted(true);
        console.log('MSW mocking started');
      });
    } else {
      setMockingStarted(true);
    }
  }, []);

  if (process.env.NODE_ENV === 'development' && !mockingStarted) {
    return <div>Setting Up MSW...</div>;
  }

  return (
    <div className="layout-root">
      <Header />
      <main className="layout-content">
        <Home />
      </main>
      <Footer />
    </div>
  );
}
