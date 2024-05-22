const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore(
    {
        databaseId: 'cancer-ml',
    }
);

async function getData() {
    const snapshot = await firestore.collection('prediction').get();
    const data = snapshot.docs.map(doc => doc.data());
    return data;
}

module.exports = getData;