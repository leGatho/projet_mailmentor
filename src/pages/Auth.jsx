import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  // États pour gérer le formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true); // true pour login, false pour signup

  // Fonction de connexion
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Fonction d'inscription
  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      setMessage('Vérifiez votre email pour confirmer votre inscription!');
    } catch (error) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">MailMentor</h1>
          <p className="mt-2 text-gray-600">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez un nouveau compte'}
          </p>
        </div>

        {message && (
          <div className="p-4 text-sm text-blue-700 bg-blue-100 rounded-lg">
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={isLogin ? handleLogin : handleSignUp}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isLogin ? "Vous n'avez pas de compte? Inscrivez-vous" : 'Déjà inscrit? Connectez-vous'}
          </button>
        </div>
      </div>
    </div>
  );
  // Exemple d'une fonction asynchrone pour l'insertion d'email
  async function addEmailToDatabase(emailInput, generatedReply) {
    const userId = localStorage.getItem("user_id"); // Récupère le user_id

    if (!userId) {
      console.error("Utilisateur non connecté !");
      return;
    }

    // Insertion d'un email dans Supabase
    const { error: insertError } = await supabase.from('emails').insert([
      {
        input_text: emailInput,
        generated_reply: generatedReply,
        user_id: userId, // On associe l'email au user_id
      },
    ]);

    if (insertError) {
      console.error("Erreur d'insertion :", insertError.message);
    } else {
      console.log("Email enregistré avec succès !");
    }
  }

  // Utilisation de la fonction asynchrone dans ton code
  addEmailToDatabase(emailInput, data.output);
  
} 