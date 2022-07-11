const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();
const pubSubClient = new PubSub();

exports.main = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '1800');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'PUT, POST, GET, DELETE, PATCH, OPTIONS'
  );
  try {
    const subscription = pubSubClient.subscription('meal_order_sub');
    const messageHandler = async (message) => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);
      await db
        .collection('meal_booking')
        .doc(JSON.parse(message.data).order_id)
        .update({ status: 'Received' });
      message.ack();
    };
    subscription.on('message', messageHandler);
    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      return res.status(200).json({
        success: true,
        message: 'Orders Received',
      });
    }, 10 * 1000);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};
