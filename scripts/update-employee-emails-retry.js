import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
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

// 社員メールアドレスデータのインポート
async function updateEmployeeEmails() {
  try {
    // JSONファイルを読み込む
    const emailData = JSON.parse(
      readFileSync(join(__dirname, '../temp/sonoeng_employee_emails.json'), 'utf8')
    );
    
    console.log(`${emailData.length} 件のメールアドレスデータを読み込みました`);
    
    // 前回の処理で失敗したレコード数を記録するための配列
    const previouslyFailedEmpNos = [];
    
    // バッチ処理でFirestoreにデータを書き込む
    const batchSize = 500;
    let batch = db.batch();
    let count = 0;
    let successCount = 0;
    let notFoundCount = 0;
    
    for (const employee of emailData) {
      // 社員番号を文字列に変換（Firestoreのドキュメントキーは文字列）
      const empNo = String(employee.emp_no);
      
      // 社員ドキュメントの参照を取得
      const docRef = db.collection('employees').doc(empNo);
      
      // 社員ドキュメントが存在するか確認
      const docSnapshot = await docRef.get();
      
      if (docSnapshot.exists) {
        // ドキュメントが存在する場合、メールアドレスフィールドを追加/更新
        batch.update(docRef, {
          email_addr: employee.email_addr,
          // 更新日時を記録
          updated_at: admin.firestore.FieldValue.serverTimestamp()
        });
        
        count++;
        successCount++;
        
        // 前回失敗したレコードが今回成功した場合
        if (previouslyFailedEmpNos.includes(empNo)) {
          console.log(`社員番号 ${empNo} のメールアドレスを今回更新しました`);
        }
        
        if (count >= batchSize) {
          await batch.commit();
          batch = db.batch();
          count = 0;
          console.log(`${batchSize} 件の社員メールアドレスを更新しました`);
        }
      } else {
        notFoundCount++;
        console.log(`警告: 社員番号 ${empNo} のドキュメントが見つかりません`);
      }
    }
    
    if (count > 0) {
      await batch.commit();
      console.log(`残り ${count} 件の社員メールアドレスを更新しました`);
    }
    
    console.log(`処理完了: ${successCount} 件更新、${notFoundCount} 件見つからず`);
    
  } catch (error) {
    console.error('エラーが発生しました:', error);
    throw error;
  }
}

// メイン処理
async function main() {
  try {
    console.log('社員メールアドレスの再更新を開始します...');
    await updateEmployeeEmails();
    console.log('社員メールアドレスの再更新が完了しました');
    
    process.exit(0);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
