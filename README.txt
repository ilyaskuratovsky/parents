
# WEB APP STEPS
# SETUP: 
    firebase login
    firebase init // Select hosting, and make sure the public path is called web-build (not public)
    // answer yes to question - configure as single page app (rewrite all urls to /index.html)

# DEPLOY: WEB APP
expo build:web  
npm run deploy-hosting 

# How to deploy the mobile app (addl documentaation: https://docs.expo.dev/submit/ios/)
1. increment the build number in app.json
2. run: expo build:ios (choose 'archive' when asked)
3. To make available in testflight: go to AppStore connect - go to the app and click 'Manage' to select no encryption.