import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { AuthProvider } from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Historique from './pages/Historique';
import EmailDetail from './pages/EmailDetail';
import './App.css';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Configurer un écouteur pour les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Nettoyer l'écouteur lors du démontage du composant
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Route pour l'authentification */}
          <Route 
            path="/" 
            element={session ? <Navigate to="/dashboard" /> : <Auth />} 
          />
          
          {/* Route protégée pour le dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Route protégée pour l'historique */}
          <Route 
            path="/historique" 
            element={
              <ProtectedRoute>
                <Historique />
              </ProtectedRoute>
            } 
          />
          
          {/* Route protégée pour le détail d'un email */}
          <Route 
            path="/detail/:id" 
            element={
              <ProtectedRoute>
                <EmailDetail />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirection pour toutes les autres routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
