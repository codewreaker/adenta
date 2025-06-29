import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import Header from '../Header';
import Footer from '../Footer';
import '../../styles.css';
import { startMocking } from '../../mock-service/setup';
import { AnimationProvider } from '../../context/AnimationContext';
import { lazy, Suspense, useEffect, useState } from 'react';

const Home = lazy(() => import('../Home'));
const Blog = lazy(() => import('../Blog'));

const adminUrl = 'http://localhost:4201/admin'; // Change to your admin port

function AdminRedirect() {
  useEffect(() => {
    window.location.replace(adminUrl);
  }, []);
  return <div>Redirecting to admin...</div>;
}

const RootComponent = () => (
  <>
    <Header />
    <main className="layout-content">
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </>
);

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: Blog,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminRedirect,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  blogRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

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
    <AnimationProvider>
      <RouterProvider router={router} />
    </AnimationProvider>
  );
}
