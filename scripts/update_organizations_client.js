import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  writeBatch,
  query,
  getDocs,
  limit
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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
const auth = getAuth(app);

// CSVファイルを読み込む
async function importOrganizations() {
  try {
    console.log('組織データのインポートを開始します...');
    
    // ユーザー認証（管理者アカウントのメールアドレスとパスワードを入力）
    // 注意: 実際のアプリケーションでは、環境変数などを使って安全に管理してください
    const email = 'admin@example.com';  // 管理者アカウントのメールアドレス
    const password = 'password123';     // 管理者アカウントのパスワード
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('認証成功: 管理者としてログインしました');
    } catch (authError) {
      console.error('認証エラー:', authError);
      console.log('認証なしで続行します（権限エラーが発生する可能性があります）');
    }
    
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
    
    // 現在の組織データを取得して比較
    const organizationsRef = collection(db, 'organizations');
    const q = query(organizationsRef, limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('組織データが存在しません。新規作成します。');
    } else {
      console.log('既存の組織データが見つかりました。更新を行います。');
    }
    
    // Firestoreにデータをアップロード
    let successCount = 0;
    let errorCount = 0;
    
    // バッチ処理を使用して効率的に書き込む
    const batchSize = 500; // Firestoreの制限は500
    let batch = writeBatch(db);
    let batchCount = 0;
    let batchNumber = 1;
    
    for (const record of records) {
      try {
        const divisionCode = record.division_code;
        const divisionNameLocal = record.division_name_local;
        
        if (!divisionCode) {
          console.warn('部門コードが空のレコードをスキップします');
          continue;
        }
        
        // バッチに追加
        const docRef = doc(db, 'organizations', divisionCode);
        batch.set(docRef, {
          division_code: divisionCode,
          division_name_local: divisionNameLocal,
          updated_at: new Date().toISOString()
        });
        
        batchCount++;
        
        // バッチサイズに達したらコミット
        if (batchCount >= 20) { // 小さいバッチサイズで実行
          try {
            await batch.commit();
            console.log(`バッチ ${batchNumber}: ${batchCount}件のレコードをコミットしました`);
            successCount += batchCount;
          } catch (batchError) {
            console.error(`バッチ ${batchNumber} コミットエラー:`, batchError);
            errorCount += batchCount;
          }
          
          batch = writeBatch(db);
          batchCount = 0;
          batchNumber++;
        }
        
        console.log(`処理: ${divisionCode} - ${divisionNameLocal}`);
      } catch (err) {
        errorCount++;
        console.error(`レコードの処理に失敗しました: ${record.division_code}`, err);
      }
    }
    
    // 残りのバッチをコミット
    if (batchCount > 0) {
      try {
        await batch.commit();
        console.log(`最終バッチ: 残り${batchCount}件のレコードをコミットしました`);
        successCount += batchCount;
      } catch (batchError) {
        console.error('最終バッチコミットエラー:', batchError);
        errorCount += batchCount;
      }
    }
    
    console.log('インポート完了');
    console.log(`成功: ${successCount}件`);
    console.log(`失敗: ${errorCount}件`);
    
    // 個別のドキュメント更新を試みる
    if (successCount === 0) {
      console.log('バッチ処理が失敗したため、個別のドキュメント更新を試みます...');
      
      for (const record of records) {
        try {
          const divisionCode = record.division_code;
          const divisionNameLocal = record.division_name_local;
          
          if (!divisionCode) {
            continue;
          }
          
          await setDoc(doc(db, 'organizations', divisionCode), {
            division_code: divisionCode,
            division_name_local: divisionNameLocal,
            updated_at: new Date().toISOString()
          });
          
          console.log(`個別更新成功: ${divisionCode} - ${divisionNameLocal}`);
          successCount++;
        } catch (err) {
          console.error(`個別更新失敗: ${record.division_code}`, err);
          errorCount++;
        }
      }
      
      console.log('個別更新完了');
      console.log(`成功: ${successCount}件`);
      console.log(`失敗: ${errorCount}件`);
    }
    
    console.log('処理を終了します');
  } catch (err) {
    console.error('インポート処理でエラーが発生しました:', err);
  }
}

// スクリプトを実行
importOrganizations().catch(err => {
  console.error('スクリプト実行エラー:', err);
});
