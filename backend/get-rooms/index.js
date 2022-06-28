const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

exports.main = async (req, res) => {
  try {
    const roomSnapshot = await db.collection('rooms').get();
    const rooms = [];
    roomSnapshot.forEach((doc) => {
      rooms.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    res.status(200).json(rooms);
  } catch (e) {
    res.status(500).send(e);
  }
};
