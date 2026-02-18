import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { LeaderboardRefreshProvider } from './contexts/LeaderboardRefreshContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Home = lazy(() => import('./components/Home'));
const Profile = lazy(() => import('./components/Profile'));
const Investigations = lazy(() => import('./components/Investigations'));
const InvestigationPage = lazy(() => import('./components/InvestigationPage'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh',
    color: '#fff'
  }}>
    <div>Chargement...</div>
  </div>
);

const Layout: React.FC<{ children: React.ReactNode; isInvestigationsPage: boolean; isHomePage: boolean; isInvestigationPage?: boolean; isProfilePage?: boolean }> = ({ children, isInvestigationsPage, isHomePage, isInvestigationPage = false, isProfilePage = false }) => (
  <div className={`layout ${isHomePage ? 'home-background' : ''} ${isInvestigationsPage ? 'investigations-background' : ''} ${isProfilePage ? 'profile-background' : ''}`}>
    <Navbar />
    <main style={{ paddingTop: isHomePage || isInvestigationPage ? '0' : '90px', paddingBottom: isHomePage || isInvestigationPage ? '0' : '100px', flex: 1 }}>
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <LeaderboardRefreshProvider>
        <Router>
          <AppContent />
        </Router>
      </LeaderboardRefreshProvider>
    </AuthProvider>
  );
}

const AppContent: React.FC = () => {
  const location = useLocation();
  const isInvestigationsPage = location.pathname === '/investigations';
  const isHomePage = location.pathname === '/';
  const isInvestigationPage = location.pathname.startsWith('/investigation/');
  const isProfilePage = location.pathname === '/profile';

  return (
    <div className="App">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout isInvestigationsPage={false} isHomePage={isHomePage}>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/investigations"
            element={
              <ProtectedRoute>
                <Layout isInvestigationsPage={isInvestigationsPage} isHomePage={false}>
                  <Investigations />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout isInvestigationsPage={false} isHomePage={false} isProfilePage={isProfilePage}>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/investigation/:id"
            element={
              <ProtectedRoute>
                <Layout isInvestigationsPage={false} isHomePage={false} isInvestigationPage={isInvestigationPage}>
                  <InvestigationPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;