const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '../storm-53d63-firebase-adminsdk-fbsvc-eb19a20cc0.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function fetchCollections() {
  try {
    const collections = await db.listCollections();
    const data = {};

    for (const collection of collections) {
      const snapshot = await collection.get();
      data[collection.id] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    fs.writeFileSync('firestore-data.json', JSON.stringify(data, null, 2));
    console.log('Dati esportati con successo in firestore-data.json');
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  } finally {
    admin.app().delete();
  }
}

fetchCollections(); 