const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

exports.main = async (req, res) => {
  try {
    const tourSnapshot = await db.collection('tours').get();
    const tours = [];
    tourSnapshot.forEach((doc) => {
      tours.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    res.status(200).json(tours);
  } catch (e) {
    res.status(500).send(e);
  }
};
