import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CallBar } from '@/components/layout/CallBar';
import { Cursor } from '@/components/ui/Cursor';
import { Preloader } from '@/components/ui/Preloader';
import { LenisProvider } from '@/lib/lenis';
import { AppReadyProvider } from '@/hooks/useAppReady';
import Home from '@/pages/Home';

const ServicePage = lazy(() => import('@/pages/ServicePage'));
const Mentions = lazy(() => import('@/pages/Mentions'));

function Layout() {
  return (
    <AppReadyProvider>
      <LenisProvider>
        <Preloader />
        <Cursor />
        <div className="grain" aria-hidden="true" />
        <Header />
        <Suspense fallback={<main id="main" className="min-h-screen" />}>
          <Outlet />
        </Suspense>
        <Footer />
        <CallBar />
        <ScrollRestoration />
      </LenisProvider>
    </AppReadyProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/services/:slug', element: <ServicePage /> },
      { path: '/mentions-legales', element: <Mentions /> },
      { path: '*', element: <Home /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
