import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page d'authentification
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // Sinon, afficher le contenu protégé
  return children;
} 