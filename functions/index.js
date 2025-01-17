const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.database();
const fs = admin.firestore();

//const nodemailer = require("nodemailer");
// Deploy command
// firebase login
// firebase init firestore
// [ go to functions directory]
// [ install dependencies in functions directory e.g. npm install nodemailer]
// firebase deploy --only functions:messagePushNotifications
// firebase deploy --only functions:emailNotifications
// firebase deploy --only functions:inviteNotifications
// firebase deploy --only functions:messagePushNotifications,functions:emailNotifications,functions:inviteNotifications
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
      console.log("(pushNotifications) ilya calling fetch: " + JSON.stringify(pushMessage));
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
          "(pushNotifications) ilya done calling fetch: response: " + JSON.stringify(response)
        );
      });
    });
  });

exports.inviteNotifications = functions.firestore
  .document("/invites/{inviteId}")
  .onCreate(async (snap, context) => {
    const inviteId = context.params.inviteId;
    const invite = snap.data();
    console.log("inviteId: (" + inviteId + "): " + JSON.stringify(invite));
    const fromUid = invite.fromUid;
    const groupId = invite.groupId;

    const fromUserRef = db.ref("users/" + fromUid);
    fromUserRef.once("value").then(async (fromUserSnapshot) => {
      const fromUser = fromUserSnapshot.val();
      console.log(
        "fromUser: " +
          JSON.stringify(fromUser) +
          ", email: " +
          fromUser["email"] +
          ", email: " +
          fromUser.email
      );
      const fromUserDisplayName =
        fromUser.displayName != null ? fromUser.displayName : fromUser.email.split("@")[0];
      const groupRef = db.ref("groups/" + groupId);
      groupRef.once("value").then(async (groupSnapshot) => {
        const group = groupSnapshot.val();
        console.log("group: " + JSON.stringify(group));
        //const firestore = admin.firestore()
        const toUid =
          invite.toUid != null && invite.toUid.indexOf("_uid_") == 0
            ? invite.toUid.substring(5)
            : null;

        let toEmail =
          invite.toUid != null && invite.toUid.indexOf("_email_") == 0
            ? invite.toUid.substring(7)
            : null;
        console.log("toUid parsed: (" + toUid + ")");

        if (toUid != null) {
          console.log("adding push notificatoin");
          console.log("calling adddoc");
          const pushNotificationsRef = fs.collection("push_notifications");
          pushNotificationsRef.add({
            uid: toUid,
            title: fromUserDisplayName + " invited you to a group",
            body: "Invitation to group " + group.name,
            data: "{}",
          });

          const toUserRef = db.ref("users/" + toUid);
          console.log("getting toUser");
          const toUserSnapshot = await toUserRef.once("value");
          const toUser = toUserSnapshot.val();
          console.log("got to user: " + JSON.stringify(toUser));
          toEmail = toUser.email;
          console.log("got toUser email: " + toEmail);
        }
        console.log("Calling sendNotification");
        const subject = fromUserDisplayName + " invited you to a group";
        //const body = fromUserDisplayName + " invited you to join " + group.name;
        const body = `
          <html>
            <body>
              <p>
              ${fromUserDisplayName} invited you join "${group.name}" on InTheLoop.
              </p>
              <p>
                <a href="https://tizzly.com" style="color: #FFFFFF; background-color: #008CBA;padding: 8px 20px;text-decoration:none;font-weight:bold;border-radius:5px;">View Invite</a>
              </p>
              <p>
                InTheLoop let's parents connect around their kids activities: Schools, sports, and others.
              </p>
            </body>
          </html>
        `;
        sendEmailNotification(toEmail, subject, body);
      });
    });

    return {
      status: "success",
    };
  });

exports.messagePushNotifications = functions.firestore
  .document("/groups/{groupId}/messages/{messageId}")
  .onCreate((snap, context) => {
    const groupId = context.params.groupId;
    const message = snap.data();
    const messageId = snap.id;
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

    // get all the group memberships for the group that the message came from
    const groupRef = db.ref("group_memberships").orderByChild("groupId").equalTo(groupId);
    groupRef
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          const groupMemberships = snapshot.val();
          for (const groupMembership of Object.values(groupMemberships)) {
            const uid = groupMembership["uid"];
            console.log("processing group membership: " + JSON.stringify(groupMembership));
            const lastViewedMessageTimestampMillis = groupMembership["lastViewedMessageTimestamp"];
            console.log(
              "lastViewedMessageTimestamp: " + JSON.stringify(lastViewedMessageTimestampMillis)
            );
            const messageTimestamp = message.timestamp;
            // const messageTimestamp = message.timestamp.ToString();
            console.log("message.timestamp2" + messageTimestamp.toMillis());
            // const messageTimestamp = 0;

            // TODO: this timestamp is not in the right format so convert
            if (
              lastViewedMessageTimestampMillis == null ||
              messageTimestamp.toMillis() > lastViewedMessageTimestampMillis
            ) {
              console.log("ilya listening for user: " + uid);
              const userRef = db.ref("users/" + uid);
              userRef.once("value").then((userSnapshot) => {
                // Do the push notification here
                const user = userSnapshot.val();
                const pushToken = user["pushToken"];
                const groupName =
                  message.notificationInfo != null ? message.notificationInfo.groupName : null;
                const fromName =
                  message.notificationInfo != null ? message.notificationInfo.fromName : null;
                const pushMessage = {
                  to: pushToken,
                  sound: "default",
                  title: groupName == null ? "New message" : groupName,
                  body: fromName == null ? "" : "New message from " + fromName,
                  data: { groupId, message, messageId },
                };
                console.log(
                  "(messagePushNotifications) ilya calling fetch: " + JSON.stringify(pushMessage)
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
                    "(messagePushNotifications)ilya done calling fetch: response: " +
                      JSON.stringify(response)
                  );
                });
              });
            } else {
              console.log(
                "not sending push notification because messageTimestamp " +
                  messageTimestamp.toMillis() +
                  " (" +
                  new Date(messageTimestamp.toMillis()) +
                  ") " +
                  " is after lastViewedMessageTime " +
                  lastViewedMessageTimestampMillis +
                  " (" +
                  new Date(lastViewedMessageTimestampMillis) +
                  ")"
              );
            }
          }
        } else {
          console.log("ilyagroupsnapshot2: No data available");
        }
      })
      .catch((error) => {
        console.error("ilya error: " + error);
        console.error("ilya error stack: " + JSON.stringify(error.stack));
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

exports.chatMessagePushNotifications = functions.firestore
  .document("/chats/{chatId}/messages/{messageId}")
  .onCreate(async (snap, context) => {
    const chatId = context.params.chatId;
    const message = snap.data();
    const messageId = snap.id;
    console.log("ilya_chat_message:" + JSON.stringify(message));
    console.log(
      "ilyalog chat message detected created: " +
        snap.id +
        ", chatId: " +
        chatId +
        ", data():" +
        JSON.stringify(snap.data())
    );
    const fetch = require("node-fetch");

    const chatSnapshot = await db.ref("chats/" + chatId).once("value");
    const chat = chatSnapshot.val();
    const participants = (chat?.participants ?? []).filter((p) => p !== message.uid);
    for (const participantUid of participants) {
      const userRef = db.ref("users/" + participantUid);
      const userSnapshot = await userRef.once("value");
      const user = userSnapshot.val();
      const pushToken = user["pushToken"];
      const fromName = message.notificationInfo != null ? message.notificationInfo.fromName : null;
      const pushMessage = {
        to: pushToken,
        sound: "default",
        title: fromName,
        body: message.text,
        data: { chatId, message, messageId },
      };
      console.log("(messagePushNotifications) ilya calling fetch: " + JSON.stringify(pushMessage));
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
          "(messagePushNotifications)ilya done calling fetch: response: " + JSON.stringify(response)
        );
      });
    }
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
    const mg = require("nodemailer-mailgun-transport");
    /*
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
    */
    /*
    var transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "postmaster@sandboxda7dbd833769483cbe4d9cf320ba0a43.mailgun.org",
        pass: "4451585d1d1e9268c7fc992d60ec67bb",
      },
    });
    */

    const auth = {
      auth: {
        api_key: "key-94ef4322b606854fdae0bcfb3db3b7b5",
        domain: "ilya.bz",
      },
    };
    const transporter = nodemailer.createTransport(mg(auth));

    /*
    const mailOptions = {
      //from: "ilyaskuratovsky@gmail.com",
      from: "postmaster@sandboxda7dbd833769483cbe4d9cf320ba0a43.mailgun.org",
      to: notification.to,
      subject: notification.subject,
      html: notification.body,
    };
    */
    const mailOptions = {
      //from: "ilyaskuratovsky@gmail.com",
      from: "notifications@ilya.bz",
      to: notification.to,
      subject: notification.subject,
      html: notification.body,
    };

    transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log("Error!: " + error);
        return;
      } else {
        console.log("Sent!: " + JSON.stringify(mailOptions) + "/" + JSON.stringify(data));
      }
    });

    return {
      status: "success",
    };
  });

function sendEmailNotification(toEmail, subject, body) {
  const emailNotificationsRef = fs.collection("email_notifications");
  //const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const emailNotification = {
    to: toEmail,
    subject: subject,
    body,
    //created: timestamp,
  };
  console.log(
    "starting adding record for email notifications: " + JSON.stringify(emailNotification)
  );
  emailNotificationsRef.add(emailNotification);
  console.log("added record for email notifications: " + JSON.stringify(emailNotification));
}
