const express = require("express");
const admin = require("firebase-admin");
const app = express();
const credencials = require("./key.json");
const cron = require('node-cron')
const { getFirestore } = require('firebase-admin/firestore')


app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(credencials),
});

const db = admin.firestore();

cron.schedule('*/30 * * * *', async () => {
  const chatsRef = db.collection('chats');
    const snapshot = await chatsRef.get();
  
    if (snapshot.empty) {
      return res.sendStatus(404);
    }
  
    const docs = [];
    snapshot.forEach(chatDoc => {
      const chatData = chatDoc.data();
      const messages = chatData.messages;
  
      const updatedMessages = messages.map(message => {
        return { ...message, text: null, };
      });
  
       chatDoc.ref.update({ messages: updatedMessages });
  
      docs.push({ messages: updatedMessages });
    });
});


  
  
app.listen(4000, () => console.log("working"));
