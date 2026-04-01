import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { LeaderboardRefreshProvider } from './contexts/LeaderboardRefreshContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './App.scss';

const LandingPage = lazy(() => import('./components/LandingPage'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const Privacy = lazy(() => import('./components/Privacy'));
const Terms = lazy(() => import('./components/Terms'));
const Profile = lazy(() => import('./components/Profile'));
const AdminDashboardPage = lazy(() => import('./components/administration/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./components/administration/AdminUsersPage'));
const AdminInvestigationsPage = lazy(() => import('./components/administration/AdminInvestigationsPage'));
const AdminSettingsPage = lazy(() => import('./components/administration/AdminSettingsPage'));
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

const Layout: React.FC<{ children: React.ReactNode; isInvestigationsPage: boolean; isHomePage: boolean; isInvestigationPage?: boolean; isProfilePage?: boolean; isAboutPage?: boolean; isContactPage?: boolean; isPrivacyPage?: boolean; isTermsPage?: boolean }> = ({ children, isInvestigationsPage, isHomePage, isInvestigationPage = false, isProfilePage = false, isAboutPage = false, isContactPage = false, isPrivacyPage = false, isTermsPage = false }) => (
  <div className={`layout ${isHomePage ? 'home-background' : ''} ${isInvestigationsPage ? 'investigations-background' : ''} ${isProfilePage ? 'profile-background' : ''} ${isAboutPage ? 'about-background' : ''} ${isContactPage ? 'contact-background' : ''} ${isPrivacyPage ? 'privacy-background' : ''} ${isTermsPage ? 'terms-background' : ''}`}>
    <Navbar />
    <main style={{ paddingTop: isHomePage || isInvestigationPage || isAboutPage ? '0' : '90px', paddingBottom: isHomePage || isInvestigationPage || isAboutPage ? '0' : '100px', flex: 1 }}>
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
  const isHomePage = location.pathname === '/home';
  const isInvestigationPage = location.pathname.startsWith('/investigation/');
  const isProfilePage = location.pathname === '/profile';
  const isAboutPage = location.pathname === '/about';
  const isContactPage = location.pathname === '/contact';
  const isPrivacyPage = location.pathname === '/privacy';
  const isTermsPage = location.pathname === '/terms';

  return (
    <div className="App">
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
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
            path="/about"
            element={
              <Layout isInvestigationsPage={false} isHomePage={false} isAboutPage={isAboutPage}>
                <About />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Layout isInvestigationsPage={false} isHomePage={false} isContactPage={isContactPage}>
                  <Contact />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <Layout isInvestigationsPage={false} isHomePage={false} isPrivacyPage={isPrivacyPage}>
                <Privacy />
              </Layout>
            }
          />
          <Route
            path="/terms"
            element={
              <Layout isInvestigationsPage={false} isHomePage={false} isTermsPage={isTermsPage}>
                <Terms />
              </Layout>
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
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout isInvestigationsPage={false} isHomePage={false}>
                  <AdminDashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout isInvestigationsPage={false} isHomePage={false}>
                  <AdminUsersPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/investigations"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout isInvestigationsPage={false} isHomePage={false}>
                  <AdminInvestigationsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout isInvestigationsPage={false} isHomePage={false}>
                  <AdminSettingsPage />
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