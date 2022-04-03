const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.database();

//const nodemailer = require("nodemailer");
// Deploy command
// firebase login
// firebase init firestore
// [ go to functions directory]
// [ install dependencies in functions directory e.g. npm install nodemailer]
// firebase deploy --only functions:messagePushNotifications
// firebase deploy --only functions:emailNotifications

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.pushNotifications = functions.firestore
  .document("/push_notifications/{pushNotificationId}")
  .onCreate((snap, context) => {
    const pushNotificationId = context.params.pushNotificationId;
    console.log("Push notication: " + pushNotificationId);
    const pushNotification = snap.data();
    const uid = pushNotification.uid;

    const userRef = db.ref("users/" + uid);
    userRef.once("value").then((userSnapshot) => {
      const fetch = require("node-fetch");
      // Do the push notification here
      const user = userSnapshot.val();
      const pushToken = user["pushToken"];
      let data = {};
      try {
        data = JSON.parse(pushNotification.data);
      } catch (e) {
        console.log(e);
      }
      const pushMessage = {
        to: pushToken,
        sound: "default",
        title: pushNotification.title,
        body: pushNotification.body,
        data: data,
      };
      console.log(
        "ilya calling fetch: " + JSON.stringify(pushMessage)
      );
      fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
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
  });

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
    const groupRef = db
      .ref("group_memberships")
      .orderByChild("groupId")
      .equalTo(groupId);
    groupRef
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          const groupMemberships = snapshot.val();
          for (const groupMembership of Object.values(groupMemberships)) {
            const uid = groupMembership["uid"];
            console.log(
              "processing group membership: " + JSON.stringify(groupMembership)
            );
            const lastViewedMessageTimestampStr =
              groupMembership["lastViewedMessageTimestamp"];
            // console.log(
            //     "lastViewedMessageTimestamp: " + lastViewedMessageTimestamp
            // );
            const lastViewedMessageTimestamp =
              lastViewedMessageTimestampStr != null
                ? admin.firestore.Timestamp.fromMillis(
                    lastViewedMessageTimestampStr
                  )
                : null;
            console.log(
              "lastViewedMessageTimestamp: " +
                (lastViewedMessageTimestamp != null
                  ? lastViewedMessageTimestamp.toDate()
                  : "xnullx")
            );
            const messageTimestamp = message.timestamp;
            // const messageTimestamp = message.timestamp.ToString();
            console.log("message.timestamp2" + messageTimestamp.toDate());
            // const messageTimestamp = 0;

            // TODO: this timestamp is not in the right format so convert
            if (
              lastViewedMessageTimestamp == null ||
              messageTimestamp.toDate().getTime() >
                lastViewedMessageTimestamp.toDate().getTime()
            ) {
              console.log("ilya listening for user: " + uid);
              const userRef = db.ref("users/" + uid);
              userRef.once("value").then((userSnapshot) => {
                // Do the push notification here
                const user = userSnapshot.val();
                const pushToken = user["pushToken"];
                const groupName =
                  message.notificationInfo != null
                    ? message.notificationInfo.groupName
                    : null;
                const fromName =
                  message.notificationInfo != null
                    ? message.notificationInfo.fromName
                    : null;
                const pushMessage = {
                  to: pushToken,
                  sound: "default",
                  title: groupName == null ? "New message" : groupName,
                  body: fromName == null ? "" : "New message from " + fromName,
                  data: { groupId, message },
                };
                console.log(
                  "ilya calling fetch: " + JSON.stringify(pushMessage)
                );
                fetch("https://exp.host/--/api/v2/push/send", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
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
      })
      .catch((error) => {
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

exports.emailNotifications = functions.firestore
  .document("/email_notifications/{notificationId}")
  .onCreate((snap, context) => {
    const notificationId = context.params.notificationId;
    const notification = snap.data();
    console.log("ilyanotification: (" + notificationId + ")" + JSON.stringify(notification));
    const nodemailer = require("nodemailer");
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "ilyaskuratovsky@gmail.com",
        pass: "swwG2ktk",
      },
    });
    const mailOptions = {
      from: "ilyaskuratovsky@gmail.com",
      to: notification.to,
      subject: notification.subject,
      html: notification.body,
    };

    transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("Sent!: " + JSON.stringify(data));
    });

    return {
      status: "success",
    };
  });
