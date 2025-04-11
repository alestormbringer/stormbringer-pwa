const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'storm-53d63'
});

const db = admin.firestore();

async function listCampaigns() {
  try {
    const snapshot = await db.collection('campaigns').get();
    console.log('Campagne trovate:', snapshot.size);
    
    snapshot.forEach(doc => {
      console.log('\nID:', doc.id);
      console.log('Dati:', JSON.stringify(doc.data(), null, 2));
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Errore:', error);
    process.exit(1);
  }
}

listCampaigns(); 