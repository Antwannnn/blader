const SERVER_KEY = process.env.CRYPTO_SECRET;

export async function encryptGameData(data: any): Promise<string> {
  try {
    const response = await fetch('/api/crypto/encrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Échec du chiffrement');
    }
    
    const result = await response.json();
    return result.encryptedData;
  } catch (error) {
    console.error('Erreur lors du chiffrement:', error);
    return '';
  }
}

export const decryptGameData = async (encryptedData: string) => {
  try {
    // Utiliser URL complète avec origine
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/crypto/decrypt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ encryptedData }),
    });

    if (!response.ok) {
      throw new Error(`Déchiffrement échoué avec le statut: ${response.status}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors du déchiffrement:', error);
    return null;
  }
};

// Fonction pour vérifier si les données semblent valides
export function validateGameResults(results: any): boolean {
  if (!results) return false;
  
  // Vérifier les limites raisonnables pour empêcher les valeurs improbables
  if (results.finalWpm > 300) return false;
  if (results.finalAccuracy > 100) return false;
  
  return true;
}