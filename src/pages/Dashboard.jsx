import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import MailResponder from '../components/MailResponder';
import logoMailMentor from '../assets/Logo MailMentor.png';

export default function Dashboard() {
  const navigate = useNavigate();

  // Fonction pour se déconnecter
  async function handleSignOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error.message);
    }
  }

  // Fonction pour naviguer vers l'historique
  const goToHistory = () => {
    navigate('/historique');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* En-tête */}
      <header className="bg-white border-b border-gray-200">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <div className="flex items-center">
            <img 
              src={logoMailMentor} 
              alt="Logo MailMentor" 
              className="h-8 mr-2" 
            />
            <h1 className="text-2xl font-bold text-blue-600">MailMentor</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={goToHistory}
              className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              Historique
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container px-4 py-8 mx-auto">
        <MailResponder />
      </main>
    </div>
  );
} 