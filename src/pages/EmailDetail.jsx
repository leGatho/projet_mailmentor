import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';

export default function EmailDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Vérification que l'utilisateur est connecté
    if (!user) {
      navigate('/');
      return;
    }

    async function fetchEmailDetail() {
      setLoading(true);
      setError('');

      try {
        // Récupération de l'email avec l'id spécifié
        const { data, error } = await supabase
          .from('emails')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id) // Vérification que l'email appartient à l'utilisateur
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Cet email n'existe pas ou vous n'avez pas les droits pour y accéder.");
        }

        setEmail(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de l\'email :', err.message);
        setError("Impossible de charger les détails de l'email.");
      } finally {
        setLoading(false);
      }
    }

    fetchEmailDetail();
  }, [id, user, navigate]);

  const handleRetour = () => {
    navigate('/historique');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  // Formatter la date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Copier le contenu
  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Copier la conversation complète
  const copyFullConversation = () => {
    if (!email) return;
    const fullText = `--- EMAIL REÇU ---\n\n${email.input_text}\n\n--- RÉPONSE GÉNÉRÉE ---\n\n${email.generated_reply}`;
    copyToClipboard(fullText);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* En-tête */}
      <header className="bg-white border-b border-gray-200">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <h1 className="text-2xl font-bold text-blue-600">MailMentor - Détail</h1>
          <div className="flex space-x-3">
            <button
              onClick={goToDashboard}
              className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              Accueil
            </button>
            <button
              onClick={handleRetour}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Retour à l'historique
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container px-4 py-8 mx-auto">
        <div className="p-6 bg-white rounded-xl shadow-md">
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

          {!loading && !error && email && (
            <div className="text-left">
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold mb-2">Conversation du {formatDate(email.created_at)}</h2>
                <p className="text-sm text-gray-500">
                  <span className="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email enregistré
                  </span>
                </p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Email reçu</h3>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="whitespace-pre-wrap text-gray-700 text-left">{email.input_text}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Réponse générée</h3>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="whitespace-pre-wrap text-gray-700 text-left">{email.generated_reply}</p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={copyFullConversation}
                >
                  {copySuccess ? 'Copié !' : 'Copier toute la conversation'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 