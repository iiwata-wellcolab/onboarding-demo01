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

// 退職済み従業員データのインポート
async function importTerminatedEmployees() {
  const terminatedEmployees = [];
  
  return new Promise((resolve, reject) => {
    createReadStream(join(__dirname, '../temp/step17i_with_full_names_rev3.csv'))
      .pipe(csv())
      .on('data', (row) => {
        // statusが"terminated"のレコードのみを抽出
        if (row.status === 'terminated') {
          terminatedEmployees.push(row);
        }
      })
      .on('end', async () => {
        console.log(`${terminatedEmployees.length} 件の退職済み従業員データを読み込みました`);
        
        // バッチ処理でFirestoreにデータを書き込む
        const batchSize = 500;
        let batch = db.batch();
        let count = 0;
        let updatedCount = 0;
        let newCount = 0;
        
        for (const emp of terminatedEmployees) {
          const docRef = db.collection('employees').doc(emp.emp_no);
          
          // ドキュメントが存在するか確認
          const docSnapshot = await docRef.get();
          
          // 日付フィールドをFirestoreのTimestampに変換
          const joinDate = emp.join_date ? admin.firestore.Timestamp.fromDate(new Date(emp.join_date)) : null;
          const birthDate = emp.birth_date ? admin.firestore.Timestamp.fromDate(new Date(emp.birth_date)) : null;
          const terminationDate = emp.termination_date ? admin.firestore.Timestamp.fromDate(new Date(emp.termination_date)) : null;
          
          const employeeData = {
            emp_no: emp.emp_no,
            birth_date: birthDate,
            join_date: joinDate,
            join_type: emp.join_type,
            nationality: emp.nationality,
            status: emp.status,
            termination_date: terminationDate,
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
            middle_name_local: emp.middle_name_local,
            middle_name_alphabet: emp.middle_name_alphabet,
            full_name_local: emp.full_name_local,
            full_name_alphabet: emp.full_name_alphabet,
            // 検索用に小文字のフルネームも保存
            full_name_alphabet_lower: emp.full_name_alphabet ? emp.full_name_alphabet.toLowerCase() : null,
            // インポート日時を記録
            imported_at: admin.firestore.FieldValue.serverTimestamp()
          };
          
          if (docSnapshot.exists) {
            // 既存のドキュメントを更新
            batch.update(docRef, employeeData);
            updatedCount++;
          } else {
            // 新規ドキュメントを作成
            batch.set(docRef, employeeData);
            newCount++;
          }
          
          count++;
          
          if (count >= batchSize) {
            await batch.commit();
            batch = db.batch();
            count = 0;
            console.log(`${batchSize} 件の退職済み従業員データをインポートしました`);
          }
        }
        
        if (count > 0) {
          await batch.commit();
          console.log(`残り ${count} 件の退職済み従業員データをインポートしました`);
        }
        
        console.log(`処理完了: ${newCount} 件の新規登録、${updatedCount} 件の更新`);
        
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
    console.log('退職済み従業員データのインポートを開始します...');
    await importTerminatedEmployees();
    console.log('退職済み従業員データのインポートが完了しました');
    
    process.exit(0);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
