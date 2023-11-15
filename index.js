#!/usr/bin/env node

// const admin = require("firebase-admin");

// const serviceAccount = require("./service_accounts/zoho-portal-service-account-credentials.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

import * as admin from 'firebase-admin';
import * as csv from 'csvtojson';
import * as fs from 'fs-extra';

//create instance of Command
import { Command } from "commander";
const args = new Command();

// allow use of require for JSON files
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method

// import service account credentials from JSON file
const credentials = require("./service_accounts/zoho-portal-service-account-credentials.json");

// initialize firebase app with service account credentials
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

// initialize firestore database
const db = admin.firestore();

// configure available command line arguments
args
    .version('0.0.1')
    .option('-s, --src <path>', 'Source file path')
    .option('-c, --collection <path>', 'Collection path in database')
    .option('-i, --id [id]', 'Field to use for Document ID')
    .parse(process.argv);

