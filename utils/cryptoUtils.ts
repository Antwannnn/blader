
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

export async function decryptGameData(encryptedData: string): Promise<any> {
  try {
    const response = await fetch('/api/crypto/decrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ encryptedData }),
    });
    
    if (!response.ok) {
      throw new Error('Échec du déchiffrement');
    }
    
    const result = await response.json();
    
    if (!result.valid && result.data === null) {
      console.warn(result.warning || 'Données invalides');
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error('Erreur lors du déchiffrement:', error);
    return null;
  }
}

// Fonction pour vérifier si les données semblent valides
export function validateGameResults(results: any): boolean {
  if (!results) return false;
  
  // Vérifier les limites raisonnables pour empêcher les valeurs improbables
  if (results.finalWpm > 300) return false;
  if (results.finalAccuracy > 100) return false;
  
  return true;
}