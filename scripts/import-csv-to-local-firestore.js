const fs = require('fs');
const csv = require('csv-parser');
const admin = require('firebase-admin');
const path = require('path');

// Firebaseエミュレータに接続するための初期化
admin.initializeApp({
  projectId: 'demo-project' // プロジェクトIDは任意の値でOK（ローカルエミュレータ用）
});

// Firestoreエミュレータに接続
const db = admin.firestore();
db.settings({
  host: 'localhost:8080',
  ssl: false
});

// 組織データのインポート
async function importOrganizations() {
  const organizations = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../temp/org_master.csv'))
      .pipe(csv())
      .on('data', (row) => {
        organizations.push(row);
      })
      .on('end', async () => {
        console.log(`${organizations.length} 組織データを読み込みました`);
        
        // バッチ処理でFirestoreにデータを書き込む
        const batchSize = 500;
        let batch = db.batch();
        let count = 0;
        
        for (const org of organizations) {
          const docRef = db.collection('organizations').doc(org.division_code);
          
          // 親部門の特定（簡易的なロジック - 必要に応じて調整）
          let parentDivision = null;
          if (org.division_code.includes('-')) {
            const parts = org.division_code.split('-');
            if (parts.length > 2) {
              // 例: COR-D01-S01 の親は COR-D01
              parentDivision = parts.slice(0, 2).join('-');
            } else {
              // 例: COR-D01 の親は COR
              parentDivision = parts[0];
            }
          }
          
          batch.set(docRef, {
            division_code: org.division_code,
            division_name_local: org.division_name_local,
            parent_division: parentDivision
          });
          
          count++;
          
          if (count >= batchSize) {
            await batch.commit();
            batch = db.batch();
            count = 0;
            console.log(`${batchSize} 件の組織データをインポートしました`);
          }
        }
        
        if (count > 0) {
          await batch.commit();
          console.log(`残り ${count} 件の組織データをインポートしました`);
        }
        
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// 従業員データのインポート
async function importEmployees() {
  const employees = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../temp/step17i_with_full_names_rev3.csv'))
      .pipe(csv())
      .on('data', (row) => {
        employees.push(row);
      })
      .on('end', async () => {
        console.log(`${employees.length} 従業員データを読み込みました`);
        
        // バッチ処理でFirestoreにデータを書き込む
        const batchSize = 500;
        let batch = db.batch();
        let count = 0;
        
        for (const emp of employees) {
          const docRef = db.collection('employees').doc(emp.emp_no);
          
          // 日付フィールドをFirestoreのTimestampに変換
          const joinDate = emp.join_date ? admin.firestore.Timestamp.fromDate(new Date(emp.join_date)) : null;
          const birthDate = emp.birth_date ? admin.firestore.Timestamp.fromDate(new Date(emp.birth_date)) : null;
          const terminationDate = emp.termination_date ? admin.firestore.Timestamp.fromDate(new Date(emp.termination_date)) : null;
          
          batch.set(docRef, {
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
            full_name_alphabet_lower: emp.full_name_alphabet ? emp.full_name_alphabet.toLowerCase() : null
          });
          
          count++;
          
          if (count >= batchSize) {
            await batch.commit();
            batch = db.batch();
            count = 0;
            console.log(`${batchSize} 件の従業員データをインポートしました`);
          }
        }
        
        if (count > 0) {
          await batch.commit();
          console.log(`残り ${count} 件の従業員データをインポートしました`);
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
    console.log('組織データのインポートを開始します...');
    await importOrganizations();
    console.log('組織データのインポートが完了しました');
    
    console.log('従業員データのインポートを開始します...');
    await importEmployees();
    console.log('従業員データのインポートが完了しました');
    
    console.log('すべてのデータのインポートが完了しました');
    process.exit(0);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
