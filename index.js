#!/usr/bin/env node

// const admin = require("firebase-admin");

// const serviceAccount = require("./service_accounts/zoho-portal-service-account-credentials.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

import * as admin from 'firebase-admin';
import * as csv from 'csvtojson';
import * as fs from 'fs-extra';
import * as args from "commander";
import * as credentials from "./service_accounts/zoho-portal-service-account-credentials.json";

args
    .version('0.0.1')
    .option('-s, --src <path>', 'Source file path')
    .option('-c, --collection <path>', 'Collection path in database')
    .option('-i, --id [id]', 'Field to use for Document ID')
    .parse(process.argv);

