
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
3. Make note of the build url: Successfully built standalone app: https://expo.dev/artifacts/183d522d-5217-4b57-b8d3-42ef1f74b14a
4. eas submit --platform ios
    Select to choose option to enter url
    Enter url from above
3. To make available in testflight: go to AppStore connect:
    go to TestFlight tab (app should be available after 5-10 mins)
    go to the app and click 'Manage' to select no encryption.