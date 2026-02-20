'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AdminDashboardPage.css';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();   
    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <div className="admin-dashboard">
            <h1>Tableau de bord administrateur SQLock Holmes</h1>
            <p>Bienvenue sur le tableau de bord administrateur. Ici, vous pouvez gérer les utilisateurs, les enquêtes et les paramètres du système.</p>
            <div className="admin-actions">
                <button onClick={() => navigate('/admin/users')}>Gérer les utilisateurs</button>
                <button onClick={() => navigate('/admin/investigations')}>Gérer les enquêtes</button>
                <button onClick={() => navigate('/admin/settings')}>Paramètres du système</button>
            </div>
        </div>
    );
};

export default AdminDashboardPage;