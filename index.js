var admin = require("firebase-admin");

var serviceAccount = require("./service_accounts/zoho-portal-service-account-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

