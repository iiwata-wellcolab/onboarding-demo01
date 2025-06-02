import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyAQOd279aMHUi_Kf_XrYMdGwLpxTkgBCyM",
  authDomain: "iiwata-onboarding-demo01.firebaseapp.com",
  projectId: "iiwata-onboarding-demo01",
  storageBucket: "iiwata-onboarding-demo01.appspot.com",
  messagingSenderId: "1049615887164",
  appId: "1:1049615887164:web:9e2a2d9c8e3d9a9b8a9b8a"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    
    for (const record of records) {
      try {
        const divisionCode = record.division_code;
        const divisionNameLocal = record.division_name_local;
        
        if (!divisionCode) {
          console.warn('部門コードが空のレコードをスキップします');
          continue;
        }
        
        // Firestoreにデータを書き込む
        await setDoc(doc(db, 'organizations', divisionCode), {
          division_code: divisionCode,
          division_name_local: divisionNameLocal,
          updated_at: new Date().toISOString()
        });
        
        successCount++;
        console.log(`インポート成功: ${divisionCode} - ${divisionNameLocal}`);
      } catch (err) {
        errorCount++;
        console.error(`レコードのインポートに失敗しました: ${record.division_code}`, err);
      }
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
