/**
 * Utilitaire pour tester l'intégration avec l'API Mistral
 */

/**
 * Envoie une requête à l'API Mistral via le proxy configuré
 * @param {string} message - Le message à envoyer à l'agent
 * @returns {Promise<string>} - La réponse de l'agent
 */
export async function testMistralAgent(message) {
  try {
    // Préparation du payload selon la spécification de l'API Mistral
    const payload = {
      agent_id: "ag:a8432394:20250409:mailmentoragent:4b1241d7",
      messages: [
        {
          role: "user", 
          content: message
        }
      ]
    };

    console.log("Envoi de la requête à Mistral avec le payload:", payload);

    // Appel à l'API via le proxy Vite
    const response = await fetch("https://api.mistral.ai/v1/chat/completions/agents/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur API (${response.status}):`, errorText);
      throw new Error(`Erreur API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Réponse complète de Mistral:", data);

    if (data.content) {
      return data.content;
    } else {
      console.error("Réponse sans contenu:", data);
      return "Erreur: Réponse sans contenu";
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à Mistral:", error);
    return `Erreur: ${error.message}`;
  }
}

/**
 * Vérifie que la configuration du proxy et de l'API est correcte
 * @returns {Promise<boolean>} - true si tout est correctement configuré
 */
export async function verifyMistralConfig() {
  try {
    // Test simple pour vérifier que le proxy et l'authentification fonctionnent
    const testMessage = "Génère une phrase courte pour tester la configuration.";
    const response = await testMistralAgent(testMessage);
    
    return !response.startsWith("Erreur:");
  } catch (error) {
    console.error("Erreur de configuration:", error);
    return false;
  }
} 