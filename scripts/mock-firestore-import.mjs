import fs from 'fs';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirnameの代替（ESモジュール用）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// モックFirestoreデータベース
const mockDb = {
  organizations: {},
  employees: {},
  
  // ドキュメント追加メソッド
  addDocument(collection, id, data) {
    if (!this[collection]) {
      this[collection] = {};
    }
    this[collection][id] = data;
    return Promise.resolve();
  },
  
  // コレクション内のドキュメント数を取得
  getCollectionSize(collection) {
    return Object.keys(this[collection] || {}).length;
  },
  
  // データをJSONファイルに保存
  saveToFile(filePath) {
    const data = {
      organizations: this.organizations,
      employees: this.employees
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return Promise.resolve();
  }
};

// 組織データのインポート
async function importOrganizations() {
  const organizations = [];
  
  return new Promise((resolve, reject) => {
    createReadStream(path.join(__dirname, '../temp/org_master.csv'))
      .pipe(csv())
      .on('data', (row) => {
        organizations.push(row);
      })
      .on('end', async () => {
        console.log(`${organizations.length} 組織データを読み込みました`);
        
        let count = 0;
        
        for (const org of organizations) {
          // 親部門の特定（簡易的なロジック - 必要に応じて調整）
          let parentDivision = null;
          if (org && org.division_code && typeof org.division_code === 'string' && org.division_code.includes('-')) {
            const parts = org.division_code.split('-');
            if (parts.length > 2) {
              // 例: COR-D01-S01 の親は COR-D01
              parentDivision = parts.slice(0, 2).join('-');
            } else {
              // 例: COR-D01 の親は COR
              parentDivision = parts[0];
            }
          }
          
          await mockDb.addDocument('organizations', org.division_code, {
            division_code: org.division_code,
            division_name_local: org.division_name_local,
            parent_division: parentDivision
          });
          
          count++;
          
          if (count % 100 === 0) {
            console.log(`${count} 件の組織データをインポートしました`);
          }
        }
        
        console.log(`合計 ${count} 件の組織データをインポートしました`);
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
    createReadStream(path.join(__dirname, '../temp/step17i_with_full_names_rev3.csv'))
      .pipe(csv())
      .on('data', (row) => {
        employees.push(row);
      })
      .on('end', async () => {
        console.log(`${employees.length} 従業員データを読み込みました`);
        
        let count = 0;
        
        for (const emp of employees) {
          // 日付フィールドをISOString形式に変換
          const joinDate = emp.join_date ? new Date(emp.join_date).toISOString() : null;
          const birthDate = emp.birth_date ? new Date(emp.birth_date).toISOString() : null;
          const terminationDate = emp.termination_date ? new Date(emp.termination_date).toISOString() : null;
          
          await mockDb.addDocument('employees', emp.emp_no, {
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
          
          if (count % 100 === 0) {
            console.log(`${count} 件の従業員データをインポートしました`);
          }
        }
        
        console.log(`合計 ${count} 件の従業員データをインポートしました`);
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
    
    // インポートしたデータの統計情報
    const orgCount = mockDb.getCollectionSize('organizations');
    const empCount = mockDb.getCollectionSize('employees');
    console.log(`インポート統計: ${orgCount} 組織, ${empCount} 従業員`);
    
    // データをJSONファイルに保存
    const outputPath = path.join(__dirname, '../temp/firestore-data.json');
    await mockDb.saveToFile(outputPath);
    console.log(`インポートデータを ${outputPath} に保存しました`);
    
    console.log('すべてのデータのインポートが完了しました');
    process.exit(0);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
