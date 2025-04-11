const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'storm-53d63'
});

const db = admin.firestore();

async function deleteCampaign(campaignId) {
  try {
    await db.collection('campaigns').doc(campaignId).delete();
    console.log(`Campagna ${campaignId} eliminata con successo`);
    process.exit(0);
  } catch (error) {
    console.error('Errore:', error);
    process.exit(1);
  }
}

// Prendi l'ID della campagna dall'argomento della riga di comando
const campaignId = process.argv[2];
if (!campaignId) {
  console.error('Per favore, specifica l\'ID della campagna da eliminare');
  process.exit(1);
}

deleteCampaign(campaignId); 