const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Firebaseの初期化
// サービスアカウントキーのパスを指定（Firebase Consoleからダウンロードしたもの）
// 注意: このファイルはGitにコミットしないでください
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'iiwata-onboarding-demo01.appspot.com'
});

const bucket = admin.storage().bucket();

// 従業員データの読み込み（JSONファイルから）
const loadEmployeeData = async () => {
  try {
    const data = require('../temp/firestore-data.json');
    if (data && data.employees) {
      return data.employees;
    }
    throw new Error('従業員データが見つかりません');
  } catch (error) {
    console.error('従業員データの読み込みエラー:', error);
    throw error;
  }
};

// 指定されたディレクトリ内のPNGファイルを再帰的に検索
const findPngFiles = async (directory) => {
  const files = await readdir(directory);
  const results = [];

  for (const file of files) {
    const filePath = path.join(directory, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      // サブディレクトリを再帰的に検索
      const subResults = await findPngFiles(filePath);
      results.push(...subResults);
    } else if (path.extname(file).toLowerCase() === '.png') {
      // PNGファイルを結果に追加
      results.push(filePath);
    }
  }

  return results;
};

// メイン処理
const uploadPhotos = async (photoDirectory) => {
  try {
    console.log(`写真フォルダ: ${photoDirectory}`);
    
    // 従業員データの読み込み
    const employeeData = await loadEmployeeData();
    console.log(`${Object.keys(employeeData).length} 人の従業員データを読み込みました`);
    
    // PNGファイルの検索
    const pngFiles = await findPngFiles(photoDirectory);
    console.log(`${pngFiles.length} 個のPNGファイルが見つかりました`);
    
    let validCount = 0;
    let invalidCount = 0;
    let uploadedCount = 0;
    let errorCount = 0;
    
    // 各ファイルを処理
    for (const filePath of pngFiles) {
      const fileName = path.basename(filePath);
      const empNo = fileName.split('.')[0];
      
      // 従業員データが存在するか確認
      if (employeeData[empNo]) {
        validCount++;
        
        try {
          // Firebase Storageにアップロード
          await bucket.upload(filePath, {
            destination: `employee-photos/${fileName}`,
            metadata: {
              contentType: 'image/png',
              metadata: {
                employeeId: empNo,
                employeeName: employeeData[empNo].full_name_local || ''
              }
            }
          });
          
          uploadedCount++;
          console.log(`✅ アップロード成功: ${fileName} (${uploadedCount}/${validCount})`);
        } catch (error) {
          errorCount++;
          console.error(`❌ アップロードエラー: ${fileName}`, error);
        }
      } else {
        invalidCount++;
        console.warn(`⚠️ 従業員データなし: ${fileName}`);
      }
    }
    
    console.log('\n===== アップロード結果 =====');
    console.log(`総ファイル数: ${pngFiles.length}`);
    console.log(`有効ファイル数: ${validCount}`);
    console.log(`無効ファイル数: ${invalidCount}`);
    console.log(`アップロード成功: ${uploadedCount}`);
    console.log(`アップロードエラー: ${errorCount}`);
    
  } catch (error) {
    console.error('処理エラー:', error);
  } finally {
    // Firebaseアプリを終了
    admin.app().delete();
  }
};

// コマンドライン引数からフォルダパスを取得
const photoDirectory = process.argv[2];

if (!photoDirectory) {
  console.error('使用方法: node batch-upload-photos.js <写真フォルダのパス>');
  process.exit(1);
}

// 処理を実行
uploadPhotos(photoDirectory);
