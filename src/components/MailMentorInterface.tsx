import React, { useState } from "react";

/**
 * Interface pour la réponse de l'API de Mistral
 */
interface ApiResponse {
  id?: string;
  object?: string;
  choices?: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      tool_calls: any;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
}

/**
 * Composant permettant à un utilisateur de coller un email reçu et d'obtenir une réponse générée par IA
 */
const MailMentorInterface: React.FC = () => {
  // États pour gérer les données et le comportement du composant
  const [emailInput, setEmailInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  /**
   * Fonction pour appeler l'API et générer une réponse
   */
  const handleGenerateResponse = async () => {
    // Validation de base
    if (!emailInput.trim()) {
      setError("Veuillez entrer le contenu d'un email.");
      return;
    }

    // Réinitialiser les états
    setLoading(true);
    setError("");
    setResponse("");

    try {
      // Récupération de la clé API depuis les variables d'environnement
      const apiKey = import.meta.env.VITE_LAPLATEFORME_API_KEY;
      
      if (!apiKey) {
        throw new Error("La clé API n'est pas configurée");
      }

      // Préparation du payload selon la spécification de l'API Mistral
      const payload = {
        agent_id: "ag:a8432394:20250409:mailmentoragent:4b1241d7",
        messages: [
          {
            role: "user", 
            content: `Voici un email reçu, rédige une réponse professionnelle : ${emailInput}`
          }
        ]
      };

      // Appel à l'API Mistral avec la clé API
      const res = await fetch("https://api.mistral.ai/v1/agents/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
      });

      // Vérification de la réponse HTTP
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur API (${res.status}): ${errorText}`);
      }

      // Parsing de la réponse JSON
      const data: ApiResponse = await res.json();
      
      // Traitement de la réponse
      if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
        setResponse(data.choices[0].message.content);
      } else {
        setError("La réponse de l'API ne contient pas de texte généré.");
      }
    } catch (err) {
      // Gestion des erreurs
      console.error("Erreur lors de l'appel à l'agent:", err);
      setError(err instanceof Error ? err.message : "Une erreur inconnue s'est produite");
    } finally {
      // Toujours désactiver le chargement à la fin
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl">
      <h1 className="text-5xl font-bold mb-8 text-center">
        <span className="animated-gradient-text">MailMentor</span>
      </h1>
      
      {/* Zone de saisie de l'email */}
      <div className="mb-6">
        <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-2">
          Email reçu
        </label>
        <textarea
          id="email-input"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
          rows={8}
          placeholder="Collez ici le contenu de l'email reçu..."
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Bouton pour générer la réponse */}
      <div className="mb-6">
        <button
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          onClick={handleGenerateResponse}
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
            "Générer une réponse"
          }
        </button>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="font-medium">Erreur:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Affichage de la réponse générée */}
      {response && (
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Réponse générée</h2>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="whitespace-pre-wrap text-gray-700 text-left">{response}</p>
          </div>
          <button
            className="mt-3 px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(response);
              alert("Réponse copiée dans le presse-papier!");
            }}
          >
            Copier la réponse
          </button>
        </div>
      )}
    </div>
  );
};

export default MailMentorInterface; 