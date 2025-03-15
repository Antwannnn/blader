import CryptoJS from 'crypto-js';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.SECRET_KEY!;

export async function POST(request: Request) {
  try {
    const { encryptedData, isHistory } = await request.json();
    const requestNonces = new Set();
    
    if (!encryptedData) {
      console.error('Données manquantes');
      return NextResponse.json({ error: 'Données chiffrées manquantes' }, { status: 400 });
    }

    try {
      const jsonStr = atob(encryptedData);
      const obj = JSON.parse(jsonStr);
      
      if (!obj.data || !obj.iv || !obj.hmac) {
        console.error('Structure des données invalide');
        return NextResponse.json({ error: 'Format de données invalide' }, { status: 400 });
      }
      
      const calculatedHmac = CryptoJS.HmacSHA256(obj.data, SECRET_KEY).toString(CryptoJS.enc.Hex);
      
      if (calculatedHmac !== obj.hmac) {
        console.error('HMAC invalide');
        return NextResponse.json({ error: 'Signature HMAC invalide' }, { status: 400 });
      }
      
      const decrypted = CryptoJS.AES.decrypt(
        obj.data,
        SECRET_KEY,
        { iv: CryptoJS.enc.Hex.parse(obj.iv) }
      );
      
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedText) {
        console.error('Déchiffrement a produit un texte vide');
        return NextResponse.json({ error: 'Échec du déchiffrement' }, { status: 400 });
      }
      
      const decryptedData = JSON.parse(decryptedText);
      
      if (decryptedData._nonce && requestNonces.has(decryptedData._nonce)) {
        return NextResponse.json({ 
          error: 'Résultats déjà utilisés',
          valid: false,
          data: null
        }, { status: 400 });
      }
      
      
      if (decryptedData._nonce) {
        requestNonces.add(decryptedData._nonce);
      }
      
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