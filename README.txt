
# WEB APP STEPS
# SETUP: 
    firebase login
    firebase init // Select hosting, and make sure the public path is called web-build (not public)
    // answer yes to question - configure as single page app (rewrite all urls to /index.html)

# DEPLOY: WEB APP
expo build:web  
npm run deploy-hosting 

# How to deploy the mobile app