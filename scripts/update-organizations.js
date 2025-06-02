import { createReadStream } from 'fs';
import { stripBomStream } from './strip-bom-stream.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import csv from 'csv-parser';
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// ESM でのファイルパス解決
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// サービスアカウントの読み込み
const serviceAccountPath = join(__dirname, '../firebase-credentials.json');
const serviceAccountJson = JSON.parse(
  await readFile(new URL(serviceAccountPath, import.meta.url), 'utf8')
);

// Firebaseの初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountJson)
});

const db = admin.firestore();

// 組織データのインポート
async function importOrganizations() {
  const organizations = [];
  
  return new Promise((resolve, reject) => {
    createReadStream(join(__dirname, '../temp/org_master.csv'))
      .pipe(stripBomStream())
      .pipe(csv())
      .on('data', (row) => {
        // Skip rows with empty division_code
        if (row.division_code && row.division_code.trim() !== '') {
          organizations.push(row);
        } else {
          console.log('警告: 空の division_code を持つ行をスキップしました');
        }
      })
      .on('end', async () => {
        console.log(`${organizations.length} 組織データを読み込みました`);
        
        // 既存のデータを削除
        console.log('既存の組織データを削除しています...');
        const snapshot = await db.collection('organizations').get();
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`${snapshot.size} 件の既存組織データを削除しました`);
        
        // バッチ処理でFirestoreにデータを書き込む
        const batchSize = 500;
        let writeBatch = db.batch();
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
          
          writeBatch.set(docRef, {
            division_code: org.division_code,
            division_name_local: org.division_name_local,
            parent_division: parentDivision
          });
          
          count++;
          
          if (count >= batchSize) {
            await writeBatch.commit();
            writeBatch = db.batch();
            count = 0;
            console.log(`${batchSize} 件の組織データをインポートしました`);
          }
        }
        
        if (count > 0) {
          await writeBatch.commit();
          console.log(`残り ${count} 件の組織データをインポートしました`);
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
    console.log('組織データの更新を開始します...');
    await importOrganizations();
    console.log('組織データの更新が完了しました');
    
    console.log('すべてのデータの更新が完了しました');
    process.exit(0);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
main();
