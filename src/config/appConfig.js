// アプリケーション全体の設定ファイル

// Firebase Storage関連の設定
export const storageConfig = {
  // 従業員写真のパス設定
  employeePhotos: {
    folderPath: 'employee-photos', // フォルダ名
    fileExtension: 'png',          // ファイル拡張子
    defaultImage: '/images/default_emp_icon.png' // デフォルト画像
  }
};

// その他の設定
export const appConfig = {
  // 日付フォーマット設定
  dateFormat: {
    locale: 'ja-JP',
    options: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  },
  
  // 新入社員関連の設定
  newHire: {
    // 入社後の日数に基づくステータス
    daysThreshold: {
      new: 30,      // 30日以内は「新入社員」
      recent: 90,   // 90日以内は「最近入社」
      established: 180 // 180日以内は「新入社員」として扱う
    }
  }
};

// ヘルパー関数
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  // FirestoreのTimestamp型の場合
  if (timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString(appConfig.dateFormat.locale, appConfig.dateFormat.options);
  }
  
  // 通常の日付型の場合
  return new Date(timestamp).toLocaleDateString(appConfig.dateFormat.locale, appConfig.dateFormat.options);
};

// Firebase Storageの画像URLを生成する関数
export const getStorageImageUrl = (storage, employeeId) => {
  try {
    // バケットURLを取得
    const bucketUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/`;
    const encodedPath = `${storageConfig.employeePhotos.folderPath}%2F${employeeId}.${storageConfig.employeePhotos.fileExtension}`;
    return `${bucketUrl}${encodedPath}?alt=media`;
  } catch (error) {
    console.error('Storage URL生成エラー:', error);
    return storageConfig.employeePhotos.defaultImage;
  }
};

export default {
  storageConfig,
  appConfig,
  formatDate,
  getStorageImageUrl
};
