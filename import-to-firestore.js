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
const empCollection = db.collection('employees');

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

// Function to import employee data
async function importEmployees(filePath) {
  console.log(`Importing employees from ${filePath}...`);
  try {
    const employees = await parseCSV(filePath);
    console.log(`Found ${employees.length} employees`);
    
    let batch = db.batch();
    let count = 0;
    let activeCount = 0;
    
    for (const emp of employees) {
      // Only import active employees
      if (emp.status === 'active') {
        activeCount++;
        const docRef = empCollection.doc(emp.emp_no);
        batch.set(docRef, {
          emp_no: emp.emp_no,
          birth_date: emp.birth_date,
          join_date: emp.join_date,
          join_type: emp.join_type,
          nationality: emp.nationality,
          status: emp.status,
          division_code: emp.division_code,
          position: emp.position,
          supervisor_emp_id: emp.supervisor_emp_id,
          concurrent_flag: parseInt(emp.concurrent_flag) || 0,
          gender: emp.gender,
          office: emp.office,
          employment_type: emp.employment_type,
          last_name_local: emp.last_name_local,
          last_name_alphabet: emp.last_name_alphabet,
          last_name_kana: emp.last_name_kana,
          first_name_local: emp.first_name_local,
          first_name_alphabet: emp.first_name_alphabet,
          first_name_kana: emp.first_name_kana,
          middle_name_local: emp.middle_name_local || '',
          middle_name_alphabet: emp.middle_name_alphabet || '',
          full_name_local: emp.full_name_local,
          full_name_alphabet: emp.full_name_alphabet,
          photo_url: `employee-photos/${emp.emp_no}.png`,
          created_at: admin.firestore.FieldValue.serverTimestamp(),
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        });
        count++;
        
        // Firestore batches are limited to 500 operations
        if (count >= 450) {
          await batch.commit();
          console.log(`Committed batch of ${count} employees`);
          count = 0;
          batch = db.batch(); // Create a new batch
        }
      }
    }
    
    if (count > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${count} employees`);
    }
    
    console.log(`Successfully imported ${activeCount} active employees out of ${employees.length} total employees`);
    return activeCount;
  } catch (error) {
    console.error('Error importing employees:', error);
    throw error;
  }
}

// Main function to run the import
async function main() {
  try {
    console.log('Starting Firestore import...');
    
    // Import organizations
    const orgCount = await importOrganizations('./temp/org_master_updated.csv');
    
    // Import employees
    const empCount = await importEmployees('./temp/step17i_with_full_names_rev3.csv');
    
    console.log(`Import completed successfully!`);
    console.log(`Imported ${orgCount} organizations and ${empCount} active employees`);
    
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
