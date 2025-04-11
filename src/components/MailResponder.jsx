// Ce composant affiche un champ de texte pour coller un email, et génère une réponse IA via l'agent Mistral hébergé sur La Plateforme

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthProvider";

export default function MailResponder() {
  const [emailInput, setEmailInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tableExists, setTableExists] = useState(false);
  const { user } = useAuth();

  // Vérifier si la table emails existe
  useEffect(() => {
    async function checkEmailsTable() {
      try {
        const { data, error } = await supabase
          .from('emails')
          .select('id')
          .limit(1);
        
        if (error) {
          console.warn("La table emails n'existe probablement pas:", error.message);
          setTableExists(false);
        } else {
          setTableExists(true);
        }
      } catch (err) {
        console.warn("Erreur lors de la vérification de la table emails:", err.message);
        setTableExists(false);
      }
    }

    if (user) {
      checkEmailsTable();
    }
  }, [user]);

  const handleGenerateResponse = async () => {
    if (!emailInput.trim()) {
      setError("Veuillez entrer le contenu d'un email.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    // Récupération de la clé API
    const apiKey = import.meta.env.VITE_LAPLATEFORME_API_KEY || "";
    console.log(`Clé API (masquée): ${apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "non définie"}`);

    if (!apiKey) {
      setError("La clé API n'est pas configurée");
      setLoading(false);
      return;
    }

    try {
      // Préparation du payload pour l'API Mistral selon la documentation de La Plateforme
      const payload = {
        agent_id: "ag:a8432394:20250409:mailmentoragent:4b1241d7",
        messages: [
          {
            role: "user", 
            content: `Voici un email reçu, rédige une réponse professionnelle : ${emailInput}`
          }
        ]
      };
      
      console.log("Payload de la requête:", JSON.stringify(payload));

      // Appel API avec la structure correcte pour les agents Mistral
      const res = await fetch("https://api.mistral.ai/v1/agents/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
      });

      // Vérifier le statut de la réponse
      if (!res.ok) {
        const errText = await res.text();
        console.error(`Erreur API (${res.status}):`, errText);
        throw new Error(`Erreur API: ${res.status} - ${errText}`);
      }

      const data = await res.json();
      console.log("Réponse API:", data);

      if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
        const generatedResponse = data.choices[0].message.content;
        setResponse(generatedResponse);
        
        // Enregistrement silencieux dans la base de données si l'utilisateur est connecté et si la table existe
        if (user && tableExists) {
          await saveEmailToDatabase(emailInput, generatedResponse);
        } else if (user && !tableExists) {
          console.log("La table emails n'existe pas, impossible de sauvegarder l'email");
        }
      } else {
        console.error("Réponse API sans contenu:", data);
        setError("Aucune réponse générée par l'agent.");
      }
    } catch (err) {
      console.error("Erreur complète:", err);
      setError(`Erreur lors de l'appel à l'agent: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour enregistrer l'email dans la base de données
  const saveEmailToDatabase = async (emailInput, generatedReply) => {
    if (!tableExists) {
      console.warn("La table emails n'existe pas, création impossible");
      return;
    }

    try {
      // Insertion d'un email dans Supabase
      const { error: insertError } = await supabase.from('emails').insert([
        {
          input_text: emailInput,
          generated_reply: generatedReply,
          user_id: user.id, // On associe l'email à l'ID de l'utilisateur connecté
        },
      ]);

      if (insertError) {
        console.error("Erreur d'insertion :", insertError.message);
        throw insertError;
      } else {
        console.log("Email enregistré avec succès !");
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err?.message || "Erreur inconnue");
      // On n'affiche pas d'erreur à l'utilisateur pour ne pas perturber l'expérience
      // puisque la génération a fonctionné
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl">
      <h1 className="text-5xl font-bold mb-8 text-center">
        <span className="animated-gradient-text">MailMentor</span>
      </h1>
      
      <div className="mb-6">
        <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-2">
          Email reçu
        </label>
        <textarea
          id="email-input"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
          rows={8}
          placeholder="Collez ici l'email reçu..."
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <div className="mb-6">
        <button
          onClick={handleGenerateResponse}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          disabled={loading || !emailInput.trim()}
        >
          {loading ? 
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Génération en cours...
            </span> : 
            "Générer la réponse"
          }
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="font-medium">Erreur:</p>
          <p>{error}</p>
        </div>
      )}
      
      {response && (
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Réponse générée</h2>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="whitespace-pre-wrap text-gray-700 text-left">{response}</p>
          </div>
          <div className="flex space-x-3 mt-3">
            <button
              className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(response);
                alert("Réponse copiée dans le presse-papier!");
              }}
            >
              Copier la réponse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}