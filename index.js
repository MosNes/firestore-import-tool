const admin = require("firebase-admin");

const serviceAccount = require("./service_accounts/zoho-portal-service-account-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

