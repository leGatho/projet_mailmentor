import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import logoMailMentor from '../assets/Logo MailMentor.png';

export default function Historique() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérification que l'utilisateur est connecté
    if (!user) {
      navigate('/');
      return;
    }

    // Fonction pour récupérer les emails
    async function fetchEmails() {
      setLoading(true);
      setError('');

      try {
        // Récupération des emails de l'utilisateur connecté
        const { data, error } = await supabase
          .from('emails')
          .select('*')
          .eq('user_id', user.id) // On filtre par l'ID de l'utilisateur connecté
          .order('created_at', { ascending: false }); // Tri par date décroissante

        if (error) {
          throw error;
        }

        setEmails(data || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des emails :', err.message);
        setError('Impossible de charger votre historique. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    }

    fetchEmails();
  }, [user, navigate]);

  // Fonction pour extraire le thème d'un email
  const extractTheme = (text) => {
    // Extraire les premiers mots pour créer un thème
    const words = text.split(' ').filter(word => word.length > 0);
    const firstWords = words.slice(0, 4).join(' ');
    
    // Limiter à 30 caractères
    if (firstWords.length > 30) {
      return firstWords.substring(0, 30) + '...';
    }
    return firstWords;
  };

  // Fonction pour retourner au dashboard
  const handleRetour = () => {
    navigate('/dashboard');
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
            <h1 className="text-2xl font-bold text-blue-600">MailMentor - Historique</h1>
          </div>
          <button
            onClick={handleRetour}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Accueil
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container px-4 py-8 mx-auto">
        <div className="p-6 bg-white rounded-xl">
          <h2 className="text-xl font-semibold mb-6 text-left">Historique de vos emails</h2>

          {loading && (
            <div className="flex justify-center py-10">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded mb-6">
              <p className="font-medium">Erreur:</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && emails.length === 0 && (
            <p className="text-left py-8 text-gray-500">Vous n'avez pas encore d'historique d'emails.</p>
          )}

          {!loading && !error && emails.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emails.map((email) => (
                <div 
                  key={email.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/detail/${email.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-800 text-left">
                      {extractTheme(email.input_text)}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(email.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{new Date(email.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 