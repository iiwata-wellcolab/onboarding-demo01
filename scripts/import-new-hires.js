import { createReadStream, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import csv from 'csv-parser';
import admin from 'firebase-admin';

// ES Modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebaseの初期化
// Import JSON in ES modules
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '../firebase-credentials.json'), 'utf8')
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 新入社員データのインポート
async function importNewHires() {
  const newHires = [];
  
  return new Promise((resolve, reject) => {
    createReadStream(join(__dirname, '../temp/step17i_with_full_names_rev3.csv'))
      .pipe(csv())
      .on('data', (row) => {
        newHires.push(row);
      })
      .on('end', async () => {
        console.log(`${newHires.length} 新入社員データを読み込みました`);
        
        // バッチ処理でFirestoreにデータを書き込む
        const batchSize = 500;
        let batch = db.batch();
        let count = 0;
        
        for (const hire of newHires) {
          // Handle BOM character in CSV header ("﻿emp_no" instead of "emp_no")
          const empNo = hire.emp_no || hire['﻿emp_no'];
          
          // Skip if emp_no is empty or undefined
          if (!empNo || empNo.trim() === '') {
            console.log('警告: 従業員番号が空のレコードをスキップします');
            continue;
          }
          
          const docRef = db.collection('new_hire').doc(empNo);
          
          // 日付フィールドをFirestoreのTimestampに変換
          const joinDate = hire.join_date ? admin.firestore.Timestamp.fromDate(new Date(hire.join_date)) : null;
          
          batch.set(docRef, {
            emp_no: empNo,
            full_name_local: hire.full_name_local,
            div_code: hire.div_code,
            join_date: joinDate,
            mentor_emp_no: hire.mentor_emp_no || null,
            status: hire.status,
            // インポート日時を記録
            imported_at: admin.firestore.FieldValue.serverTimestamp()
          });
          
          count++;
          
          if (count >= batchSize) {
            await batch.commit();
            batch = db.batch();
            count = 0;
            console.log(`${batchSize} 件の新入社員データをインポートしました`);
          }
        }
        
        if (count > 0) {
          await batch.commit();
          console.log(`残り ${count} 件の新入社員データをインポートしました`);
        }
        
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// メイン処理
async function main() {
  try {
    console.log('新入社員データのインポートを開始します...');
    await importNewHires();
    console.log('新入社員データのインポートが完了しました');
    
    process.exit(0);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
