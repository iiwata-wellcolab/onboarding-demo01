import admin from 'firebase-admin';
import fs from 'fs';
import csvParser from 'csv-parser';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Initialize Firebase Admin SDK with service account credentials
const serviceAccount = require('./firebase-credentials.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const orgCollection = db.collection('organizations');

// Function to remove BOM from CSV data
function removeBOM(str) {
  if (str.charCodeAt(0) === 0xFEFF) {
    return str.slice(1);
  }
  return str;
}

// Function to parse CSV file
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser({
        mapHeaders: ({ header }) => removeBOM(header)
      }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Function to import organization data
async function importOrganizations(filePath) {
  console.log(`Importing organizations from ${filePath}...`);
  try {
    const organizations = await parseCSV(filePath);
    console.log(`Found ${organizations.length} organizations`);
    
    let batch = db.batch();
    let count = 0;
    
    for (const org of organizations) {
      if (!org.division_code) {
        console.warn('Skipping record with empty division_code');
        continue;
      }
      
      const docRef = orgCollection.doc(org.division_code);
      batch.set(docRef, {
        division_code: org.division_code,
        division_name_local: org.division_name_local,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
      count++;
      
      // Firestore batches are limited to 500 operations
      if (count >= 450) {
        await batch.commit();
        console.log(`Committed batch of ${count} organizations`);
        count = 0;
        batch = db.batch(); // Create a new batch
      }
    }
    
    if (count > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${count} organizations`);
    }
    
    console.log(`Successfully imported ${organizations.length} organizations`);
    return organizations.length;
  } catch (error) {
    console.error('Error importing organizations:', error);
    throw error;
  }
}

// Main function to run the import
async function main() {
  try {
    console.log('Starting Firestore import for organizations only...');
    
    // Import organizations from the new CSV file
    const orgCount = await importOrganizations('./temp/org_master.csv');
    
    console.log(`Import completed successfully!`);
    console.log(`Imported ${orgCount} organizations`);
    
    // Close the Firebase connection
    await admin.app().delete();
    console.log('Firebase connection closed');
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Run the import
main();
