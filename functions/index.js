const functions = require("firebase-functions");
 const admin = require("firebase-admin");
 admin.initializeApp();
 const db = admin.database();

 // Deploy command
 // firebase deploy --only functions:messagePushNotifications

 // // Create and Deploy Your First Cloud Functions
 // // https://firebase.google.com/docs/functions/write-firebase-functions
 //
 // exports.helloWorld = functions.https.onRequest((request, response) => {
 //   functions.logger.info("Hello logs!", {structuredData: true});
 //   response.send("Hello from Firebase!");
 // });

 exports.messagePushNotifications = functions.firestore
     .document("/groups/{groupId}/messages/{messageId}")
     .onCreate((snap, context) => {
       const groupId = context.params.groupId;
       const message = snap.data();
       console.log("ilyamessage:" + JSON.stringify(message));
       console.log(
           "ilyalog message detected created: " +
         snap.id +
         ", groupId: " +
         groupId +
         ", data():" +
         JSON.stringify(snap.data())
       );
       const fetch = require("node-fetch");
       const groupRef = db.ref("group_memberships")
           .orderByChild("groupId")
           .equalTo(groupId);
       groupRef.once("value").then((snapshot) => {
         if (snapshot.exists()) {
           const groupMemberships = snapshot.val();
           for (const groupMembership
             of Object.values(groupMemberships)) {
             const uid = groupMembership["uid"];
             console.log("processing group membership: " +
               JSON.stringify(groupMembership));
             const lastViewedMessageTimestampStr =
                groupMembership["lastViewedMessageTimestamp"];
             // console.log(
             //     "lastViewedMessageTimestamp: " + lastViewedMessageTimestamp
             // );
             const lastViewedMessageTimestamp =
             lastViewedMessageTimestampStr != null ?
               admin.firestore.Timestamp.fromMillis(
                   lastViewedMessageTimestampStr
               ) : null;
             console.log(
                 "lastViewedMessageTimestamp: " +
                 (lastViewedMessageTimestamp != null ?
                   lastViewedMessageTimestamp.toDate() : "xnullx")
             );
             const messageTimestamp = message.timestamp;
             // const messageTimestamp = message.timestamp.ToString();
             console.log("message.timestamp2" + messageTimestamp.toDate());
             // const messageTimestamp = 0;

             // TODO: this timestamp is not in the right format so convert
             if (
               lastViewedMessageTimestamp == null ||
               (messageTimestamp.toDate().getTime() >
               lastViewedMessageTimestamp.toDate().getTime())
             ) {
               console.log("ilya listening for user: " + uid);
               const userRef = db.ref("users/" + uid);
               userRef.once("value").then((userSnapshot) => {
                 // Do the push notification here
                 const user = userSnapshot.val();
                 const pushToken = user["pushToken"];
                 const groupName =
                   message.notificationInfo != null ?
                     message.notificationInfo.groupName :
                     null;
                 const fromName =
                   message.notificationInfo != null ?
                     message.notificationInfo.fromName :
                     null;
                 const pushMessage = {
                   to: pushToken,
                   sound: "default",
                   title: groupName == null ? "New message" : groupName,
                   body: fromName == null ? "" : "New message from " + fromName,
                   data: {groupId, message},
                 };
                 console.log(
                     "ilya calling fetch: " + JSON.stringify(pushMessage)
                 );
                 fetch("https://exp.host/--/api/v2/push/send", {
                   method: "POST",
                   headers: {
                     "Accept": "application/json",
                     "Accept-encoding": "gzip, deflate",
                     "Content-Type": "application/json",
                   },
                   body: JSON.stringify(pushMessage),
                 }).then((response) => {
                   console.log(
                       "ilya done calling fetch: response: " +
                       JSON.stringify(response)
                   );
                 });
               });
             }
           }
         } else {
           console.log("ilyagroupsnapshot2: No data available");
         }
       }).catch((error) => {
         console.error("ilyagroupsnapshot3: " + error);
       });

       /*
       const message = {
         to: expoPushToken,
         sound: "default",
         title: "[group name here]",
         body: "New message from !",
         data: {someData: "goes here"},
       };

       fetch("https://exp.host/--/api/v2/push/send", {
         method: "POST",
         headers: {
           "Accept": "application/json",
           "Accept-encoding": "gzip, deflate",
           "Content-Type": "application/json",
         },
         body: JSON.stringify(message),
       });
       */
       return {
         status: "success",
       };
     });