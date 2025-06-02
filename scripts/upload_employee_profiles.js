import { createReadStream } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import csvParser from 'csv-parser';
import admin from 'firebase-admin';
import { dirname } from 'path';

// サービスアカウントキーのパス
const serviceAccountPath = '/home/runner/workspace/firebase-credentials.json';

// Firebase Admin SDKの初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath)
});

const db = admin.firestore();
const csvFilePath = '/home/runner/workspace/temp/step19_employee_profile_3.csv';

// CSVファイルを読み込む関数
async function uploadProfiles() {
  const results = [];
  
  return new Promise((resolve, reject) => {
    createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`CSVファイルから${results.length}件のレコードを読み込みました。`);
        
        try {
          // バッチ処理の準備
          const batch = db.batch();
          
          // 各レコードをFirestoreに追加
          for (const record of results) {
            const docRef = db.collection('employee_profiles').doc(record.emp_no);
            
            // データの整形（数値型に変換すべきフィールドを変換）
            const profileData = {
              emp_no: record.emp_no,
              age: parseInt(record.age, 10) || 0,
              gender: record.gender,
              nationality: record.nationality,
              office_location: record.office_location,
              years_after_join: parseInt(record.years_after_join, 10) || 0,
              mbti: record.mbti,
              role: record.role,
              profile: record.profile,
              created_at: admin.firestore.FieldValue.serverTimestamp(),
              updated_at: admin.firestore.FieldValue.serverTimestamp()
            };
            
            batch.set(docRef, profileData);
            console.log(`社員番号 ${record.emp_no} のデータをバッチに追加しました。`);
          }
          
          // バッチコミット
          await batch.commit();
          console.log('すべてのデータが正常にFirestoreにアップロードされました。');
          resolve();
        } catch (error) {
          console.error('データのアップロード中にエラーが発生しました:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('CSVファイルの読み込み中にエラーが発生しました:', error);
        reject(error);
      });
  });
}

// 実行
uploadProfiles()
  .then(() => {
    console.log('処理が完了しました。');
    process.exit(0);
  })
  .catch((error) => {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  });
