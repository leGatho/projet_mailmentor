// Configuration de l'agent IA pour la génération de réponses aux mails
const AGENT_ID = 'ag:a8432394:20250409:mailmentoragent:4b1241d7';

/**
 * Fonction qui envoie le texte d'un mail à l'agent IA et récupère la réponse générée
 * @param {string} emailText - Le texte du mail reçu
 * @returns {Promise<string>} - La réponse générée par l'agent
 */
export async function generateEmailResponse(emailText) {
  try {
    // Préparation des données pour l'API
    const payload = {
      agent_id: AGENT_ID,
      input: {
        message: `Voici un email reçu, rédige une réponse professionnelle : ${emailText}`,
      },
    };

    // Appel à l'API de La Plateforme
    const response = await fetch('https://api.laplateforme.io/v1/agents/invoke', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_LAPLATEFORME_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    return data.output || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error('Erreur lors de la génération de la réponse:', error);
    return "Une erreur s'est produite lors de la génération de la réponse.";
  }
} 