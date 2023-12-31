#!/usr/bin/env node

import admin from 'firebase-admin';
import * as fs from 'fs-extra';

//create instance of Command
import { Command } from "commander";

// allow use of require for JSON files
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method

const csv = require('csvtojson');

// import service account credentials from JSON file
const credentials = require("./service_accounts/zoho-portal-service-account-credentials.json");

// initialize firebase app with service account credentials
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

// initialize firestore database
const db = admin.firestore();

const program = new Command();

// configure available command line arguments
program
    .version('0.0.1')
    .option('-s, --src <path>', 'Source file path')
    .option('-c, --collection <path>', 'Collection path in database')
    .option('-i, --id [id]', 'Field to use for Document ID')
    .parse(process.argv);

// get command line arguments
const args = program.opts();

// main migration function
async function migrate() {
    try {
        // gets collection path from command line arguments
        const colPath = args.collection;

        // gets file from command line arguments
        const file = args.src;

        // exit if missing necessary data
        if (!colPath || !file) return Promise.reject('Missing required arguments');

        const colRef = db.collection(colPath);
        const batch = db.batch();

        let data;

        // if file is a JSON file, use the fs.readJSON method
        if (file.includes('.json')) {
            data = await fs.readJSON(file);
        }

        if (file.includes('.csv')) {
            console.log('Detected CSV File');
            data = await readCSV(file);
        }

        // loop through each item in the data array
        for (const item of data) {

            // if user specified a custom ID, stringify and use that, otherwise generate a new auto ID in firestore
            const id = args.id ? items[args.id].toString() : colRef.doc().id;

            //create the reference to the new doc using the id
            const docRef = colRef.doc(id);

            // add the item to the batch
            batch.set(docRef, item);

        }

        // commit the batch
        await batch.commit();

        console.log('Firestore updated. Migration was a success!');
    }
    catch (err) {
        console.log('Migration Failed!', err);
    }
}

// function to read CSV files
async function readCSV(path) {

    console.log('Reading CSV File')
    
    try {
        const jsonArray = await csv().fromFile(path);
        console.log(`CSV read complete. ${jsonArray.length} lines parsed.`)
        return jsonArray;

    } catch(err) {
        console.log('Error reading CSV file:', err);
    }
    
}

// Run function
migrate();