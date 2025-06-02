// Firebase SDKのインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyDnW41I_neRyhZpON7BATvRMtBPSQmA9ds",
  authDomain: "iiwata-onboarding-demo01.firebaseapp.com",
  projectId: "iiwata-onboarding-demo01",
  storageBucket: "iiwata-onboarding-demo01.firebasestorage.app",
  messagingSenderId: "904336590646",
  appId: "1:904336590646:web:4ebc30b2e3efeb85da1597",
  measurementId: "G-BR5RKSR8TH"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// DOM要素の参照
const photoDirInput = document.getElementById('photo-dir');
const uploadBtn = document.getElementById('upload-btn');
const uploadProgress = document.getElementById('upload-progress');
const uploadStatus = document.getElementById('upload-status');
const employeeGrid = document.getElementById('employee-grid');

// 選択されたファイルを保持する変数
let selectedFiles = [];

// 従業員データを保持する変数
let employeeData = {};

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', async () => {
  // Firestoreデータの読み込み（JSONファイルから）
  try {
    const response = await fetch('/temp/firestore-data.json');
    const data = await response.json();
    
    if (data && data.employees) {
      employeeData = data.employees;
      console.log(`${Object.keys(employeeData).length} 人の従業員データを読み込みました`);
      
      // 既存の写真を読み込む
      loadExistingPhotos();
    }
  } catch (error) {
    console.error('従業員データの読み込みエラー:', error);
    uploadStatus.textContent = '従業員データの読み込みに失敗しました。';
    uploadStatus.className = 'status error';
  }
});

// ファイル選択時のイベントハンドラ
photoDirInput.addEventListener('change', (event) => {
  const files = event.target.files;
  selectedFiles = [];
  
  // 選択されたファイルをフィルタリング（PNGファイルのみ）
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type === 'image/png') {
      // ファイル名から従業員番号を抽出（例: "1001.png" → "1001"）
      const empNo = file.name.split('.')[0];
      
      // アクティブな従業員のみ追加
      if (employeeData[empNo] && employeeData[empNo].status === 'active') {
        selectedFiles.push({
          file: file,
          empNo: empNo,
          name: employeeData[empNo]?.full_name_local || empNo
        });
      }
    }
  }
  
  uploadStatus.textContent = `${selectedFiles.length} 件の有効な顔写真ファイルが選択されました`;
  uploadStatus.className = 'status';
});

// アップロードボタンのクリックイベント
uploadBtn.addEventListener('click', async () => {
  if (selectedFiles.length === 0) {
    uploadStatus.textContent = '顔写真ファイルが選択されていません';
    uploadStatus.className = 'status error';
    return;
  }
  
  uploadStatus.textContent = 'アップロード中...';
  uploadStatus.className = 'status';
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < selectedFiles.length; i++) {
    const { file, empNo, name } = selectedFiles[i];
    
    // 進捗状況の更新
    const progress = Math.round((i / selectedFiles.length) * 100);
    uploadProgress.style.width = `${progress}%`;
    
    try {
      // Firebase Storageへのアップロード
      const photoRef = ref(storage, `employee-photos/${empNo}.png`);
      await uploadBytes(photoRef, file);
      
      // アップロードされた画像のURLを取得
      const photoURL = await getDownloadURL(photoRef);
      
      // ローカルストレージにURLをキャッシュ
      localStorage.setItem(`photo_${empNo}`, photoURL);
      localStorage.setItem(`photo_${empNo}_timestamp`, Date.now());
      
      // プレビューを更新
      addOrUpdatePhotoPreview(empNo, name, photoURL);
      
      successCount++;
    } catch (error) {
      console.error(`社員 ${empNo} の写真アップロードエラー:`, error);
      errorCount++;
    }
  }
  
  // 完了時の進捗バーを100%に
  uploadProgress.style.width = '100%';
  
  // 結果の表示
  uploadStatus.textContent = `アップロード完了: 成功 ${successCount} 件, 失敗 ${errorCount} 件`;
  uploadStatus.className = errorCount > 0 ? 'status error' : 'status success';
});

// 既存の写真を読み込む関数
async function loadExistingPhotos() {
  try {
    // Firebase Storageから既存の写真リストを取得
    const photosRef = ref(storage, 'employee-photos');
    const result = await listAll(photosRef);
    
    // 各写真のURLを取得してプレビューに追加
    for (const item of result.items) {
      const empNo = item.name.split('.')[0];
      
      // アクティブな従業員のみ表示
      if (employeeData[empNo] && employeeData[empNo].status === 'active') {
        try {
          // キャッシュされたURLを確認
          let photoURL = localStorage.getItem(`photo_${empNo}`);
          
          // キャッシュがない場合はStorageから取得
          if (!photoURL) {
            photoURL = await getDownloadURL(item);
            localStorage.setItem(`photo_${empNo}`, photoURL);
            localStorage.setItem(`photo_${empNo}_timestamp`, Date.now());
          }
          
          const name = employeeData[empNo]?.full_name_local || empNo;
          addOrUpdatePhotoPreview(empNo, name, photoURL);
        } catch (error) {
          console.error(`社員 ${empNo} の写真URL取得エラー:`, error);
        }
      }
    }
  } catch (error) {
    console.error('既存の写真の読み込みエラー:', error);
  }
}

// プレビューに写真を追加または更新する関数
function addOrUpdatePhotoPreview(empNo, name, photoURL) {
  // 既存のカードを確認
  let card = document.getElementById(`employee-card-${empNo}`);
  
  if (!card) {
    // 新しいカードを作成
    card = document.createElement('div');
    card.id = `employee-card-${empNo}`;
    card.className = 'employee-card';
    
    // カードの内容を作成
    card.innerHTML = `
      <img class="employee-photo" id="employee-photo-${empNo}" src="${photoURL}" alt="${name}の写真">
      <div class="employee-name">${name}</div>
      <div class="employee-id">${empNo}</div>
    `;
    
    // グリッドに追加
    employeeGrid.appendChild(card);
  } else {
    // 既存のカードの写真を更新
    const photo = document.getElementById(`employee-photo-${empNo}`);
    photo.src = photoURL;
  }
}
