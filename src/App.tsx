import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { LeaderboardRefreshProvider } from './contexts/LeaderboardRefreshContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import Investigations from './components/Investigations';
import InvestigationPage from './components/InvestigationPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

const Layout: React.FC<{ children: React.ReactNode; isInvestigationsPage: boolean; isHomePage: boolean; isInvestigationPage?: boolean }> = ({ children, isInvestigationsPage, isHomePage, isInvestigationPage = false }) => (
  <div className={`layout ${isHomePage ? 'home-background' : ''} ${isInvestigationsPage ? 'investigations-background' : ''}`}>
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

  return (
    <div className="App">
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
              <Layout isInvestigationsPage={false} isHomePage={false}>
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
    </div>
  );
};

export default App;
