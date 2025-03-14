import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CryptoJS from 'crypto-js';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.SECRET_KEY!;

const usedNonces = new Set();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const session = await getServerSession(authOptions);
    
    const nonce = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
    
    usedNonces.add(nonce);
    
    const enhancedData = {
      ...data,
      _nonce: nonce,
      _timestamp: Date.now(),
      _userId: session?.user?.id || null
    };
    
    const jsonData = JSON.stringify(enhancedData);
    
    const iv = CryptoJS.lib.WordArray.random(16);
    
    const encrypted = CryptoJS.AES.encrypt(jsonData, SECRET_KEY, {
      iv: iv
    });
    
    const hmac = CryptoJS.HmacSHA256(encrypted.toString(), SECRET_KEY);
    
    const result = {
      iv: iv.toString(CryptoJS.enc.Hex),
      data: encrypted.toString(),
      hmac: hmac.toString(CryptoJS.enc.Hex),
      timestamp: Date.now()
    };
    
    return NextResponse.json({ encryptedData: btoa(JSON.stringify(result)) });
  } catch (error) {
    console.error('Erreur lors du chiffrement:', error);
    return NextResponse.json({ error: 'Erreur de chiffrement' }, { status: 500 });
  }
}