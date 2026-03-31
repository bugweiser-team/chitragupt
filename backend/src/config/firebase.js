const admin = require('firebase-admin');
require('dotenv').config();

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:    process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey:   (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, '\n'),
        clientEmail:  process.env.FIREBASE_CLIENT_EMAIL,
        clientId:     process.env.FIREBASE_CLIENT_ID,
      }),
    });
    console.log('[Firebase] Admin SDK initialized');
  } catch (error) {
    console.warn('[Firebase] Setup skipped: Check your .env FIREBASE_PRIVATE_KEY is valid.');
  }
}

module.exports = admin;
