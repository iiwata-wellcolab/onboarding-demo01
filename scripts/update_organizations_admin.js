import fs from 'fs';
import { parse } from 'csv-parse/sync';
import admin from 'firebase-admin';

// Firebaseの初期化
admin.initializeApp({
  projectId: 'iiwata-onboarding-demo01',
});

const db = admin.firestore();

// CSVファイルを読み込む
async function importOrganizations() {
  try {
    console.log('組織データのインポートを開始します...');
    
    // CSVファイルを読み込む
    const csvFilePath = '/home/runner/workspace/temp/org_master.csv';
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');
    
    // BOMを除去してCSVをパースする
    let cleanContent = fileContent;
    if (fileContent.charCodeAt(0) === 0xFEFF) {
      cleanContent = fileContent.slice(1);
      console.log('BOMを除去しました');
    }
    
    const records = parse(cleanContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log(`${records.length}件の組織データを読み込みました`);
    
    // Firestoreにデータをアップロード
    let successCount = 0;
    let errorCount = 0;
    
    // バッチ処理を使用して効率的に書き込む
    const batchSize = 500; // Firestoreの制限は500
    let batch = db.batch();
    let batchCount = 0;
    
    for (const record of records) {
      try {
        const divisionCode = record.division_code;
        const divisionNameLocal = record.division_name_local;
        
        if (!divisionCode) {
          console.warn('部門コードが空のレコードをスキップします');
          continue;
        }
        
        // バッチに追加
        const docRef = db.collection('organizations').doc(divisionCode);
        batch.set(docRef, {
          division_code: divisionCode,
          division_name_local: divisionNameLocal,
          updated_at: new Date().toISOString()
        });
        
        batchCount++;
        
        // バッチサイズに達したらコミット
        if (batchCount >= batchSize) {
          await batch.commit();
          console.log(`${batchCount}件のレコードをバッチコミットしました`);
          batch = db.batch();
          batchCount = 0;
        }
        
        successCount++;
        console.log(`インポート準備: ${divisionCode} - ${divisionNameLocal}`);
      } catch (err) {
        errorCount++;
        console.error(`レコードの処理に失敗しました: ${record.division_code}`, err);
      }
    }
    
    // 残りのバッチをコミット
    if (batchCount > 0) {
      await batch.commit();
      console.log(`残り${batchCount}件のレコードをバッチコミットしました`);
    }
    
    console.log('インポート完了');
    console.log(`成功: ${successCount}件`);
    console.log(`失敗: ${errorCount}件`);
    
    process.exit(0);
  } catch (err) {
    console.error('インポート処理でエラーが発生しました:', err);
    process.exit(1);
  }
}

// スクリプトを実行
importOrganizations().catch(err => {
  console.error('スクリプト実行エラー:', err);
  process.exit(1);
});
