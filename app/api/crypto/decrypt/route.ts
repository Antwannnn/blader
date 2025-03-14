import CryptoJS from 'crypto-js';
import { NextResponse } from 'next/server';

// Clé vraiment privée, accessible uniquement côté serveur
const SECRET_KEY = process.env.SECRET_KEY || 'fallback-secret-key-for-development';

export async function POST(request: Request) {
  try {
    const { encryptedData } = await request.json();
    // Créer un Set temporaire pour cette requête uniquement
    const requestNonces = new Set();
    
    if (!encryptedData) {
      console.error('Données manquantes');
      return NextResponse.json({ error: 'Données chiffrées manquantes' }, { status: 400 });
    }

    console.log('encryptedData', encryptedData);
        
    try {
      // Décoder la chaîne base64
      const jsonStr = atob(encryptedData);
      const obj = JSON.parse(jsonStr);
      
      // Vérifier la présence des champs nécessaires
      if (!obj.data || !obj.iv || !obj.hmac) {
        console.error('Structure des données invalide');
        return NextResponse.json({ error: 'Format de données invalide' }, { status: 400 });
      }
      
      // Vérifier la signature HMAC
      const calculatedHmac = CryptoJS.HmacSHA256(obj.data, SECRET_KEY).toString(CryptoJS.enc.Hex);
      
      if (calculatedHmac !== obj.hmac) {
        console.error('HMAC invalide');
        return NextResponse.json({ error: 'Signature HMAC invalide' }, { status: 400 });
      }
      
      // Déchiffrer les données
      const decrypted = CryptoJS.AES.decrypt(
        obj.data,
        SECRET_KEY,
        { iv: CryptoJS.enc.Hex.parse(obj.iv) }
      );
      
      // Convertir le résultat en objet JavaScript
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedText) {
        console.error('Déchiffrement a produit un texte vide');
        return NextResponse.json({ error: 'Échec du déchiffrement' }, { status: 400 });
      }
      
      const decryptedData = JSON.parse(decryptedText);
      
      // Vérifier le nonce si présent
      if (decryptedData._nonce && requestNonces.has(decryptedData._nonce)) {
        return NextResponse.json({ 
          error: 'Résultats déjà utilisés',
          valid: false,
          data: null
        }, { status: 400 });
      }
      
      // Vérifier l'âge des données si timestamp présent
      if (decryptedData._timestamp) {
        const dataAge = Date.now() - decryptedData._timestamp;
        if (dataAge > 5 * 60 * 1000) { // 5 minutes
          return NextResponse.json({ 
            error: 'Données trop anciennes',
            valid: false,
            data: null
          }, { status: 400 });
        }
      }
      
      // Si nonce présent, le marquer comme utilisé pour cette requête uniquement
      if (decryptedData._nonce) {
        requestNonces.add(decryptedData._nonce);
      }
      
      // Nettoyer les métadonnées
      const { _nonce, _timestamp, _userId, ...cleanData } = decryptedData;
      
      return NextResponse.json({ data: cleanData, valid: true });
    } catch (error) {
      console.error('Erreur de parsing/déchiffrement:', error);
      return NextResponse.json({ 
        error: 'Erreur de déchiffrement', 
        message: error instanceof Error ? error.message : 'Unknown error',
        valid: false,
        data: null
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Erreur générale:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

function validateGameResults(results: any): boolean {
  if (!results) return false;
  
  if (results.finalWpm > 300) return false;
  if (results.finalAccuracy > 100) return false;
  
  return true;
}