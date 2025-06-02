// Firebase SDKのインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// データローダーのインポート
import { loadEmployeeData } from "./data-loader.js";

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
const db = getFirestore(app);

// DOM要素の参照
const photoDirInput = document.getElementById('photo-dir');
const recursiveSearchCheckbox = document.getElementById('recursive-search');
const onlyActiveCheckbox = document.getElementById('only-active');
const batchSizeInput = document.getElementById('batch-size');
const concurrentUploadsInput = document.getElementById('concurrent-uploads');
const startUploadBtn = document.getElementById('start-upload');
const pauseUploadBtn = document.getElementById('pause-upload');
const resumeUploadBtn = document.getElementById('resume-upload');
const cancelUploadBtn = document.getElementById('cancel-upload');
const totalProgress = document.getElementById('total-progress');
const uploadStatus = document.getElementById('upload-status');
const logContainer = document.getElementById('log-container');
const summaryElement = document.getElementById('summary');
const totalFilesElement = document.getElementById('total-files');
const validFilesElement = document.getElementById('valid-files');
const successCountElement = document.getElementById('success-count');
const errorCountElement = document.getElementById('error-count');
const skippedCountElement = document.getElementById('skipped-count');

// グローバル変数
let employeeData = {};
let selectedFiles = [];
let validFiles = [];
let uploadQueue = [];
let isUploading = false;
let isPaused = false;
let isCancelled = false;
let totalUploaded = 0;
let totalErrors = 0;
let totalSkipped = 0;
let activeUploads = 0;
let maxConcurrentUploads = 3;

// フォールバックデータの取得
function getFallbackData() {
  if (window.EMPLOYEE_DATA_FALLBACK && Object.keys(window.EMPLOYEE_DATA_FALLBACK).length > 0) {
    return window.EMPLOYEE_DATA_FALLBACK;
  }
  return null;
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', async () => {
  uploadStatus.textContent = '従業員データを読み込み中...';
  
  try {
    // 従業員データの読み込みを試行
    try {
      // 新しいデータローダーを使用
      employeeData = await loadEmployeeData();
      console.log(`データローダーから ${Object.keys(employeeData).length} 人の従業員データを読み込みました`);
    } catch (loaderError) {
      console.warn('データローダーからの読み込みに失敗しました:', loaderError);
      
      // 当面の対応策として、Firestoreからの読み込みを試行
      try {
        await fetchEmployeeData();
      } catch (firestoreError) {
        console.warn('Firestoreからの読み込みに失敗しました:', firestoreError);
        
        // フォールバックデータを使用
        const fallbackData = getFallbackData();
        if (fallbackData) {
          employeeData = fallbackData;
          console.log(`フォールバックデータから ${Object.keys(employeeData).length} 人の従業員データを読み込みました`);
        } else {
          throw new Error('全てのデータ取得方法が失敗しました');
        }
      }
    }
    
    // データが正常に読み込まれたか確認
    if (!employeeData || Object.keys(employeeData).length === 0) {
      throw new Error('従業員データが空です');
    }
    
    uploadStatus.textContent = `データの読み込みが完了しました (${Object.keys(employeeData).length} 人)。フォルダを選択してください。`;
    uploadStatus.className = 'status success';
  } catch (error) {
    console.error('初期化エラー:', error);
    uploadStatus.textContent = '初期化に失敗しました: ' + error.message;
    uploadStatus.className = 'status error';
  }
});

// Firestoreから従業員データを取得する関数
async function fetchEmployeeData() {
  try {
    // Firestoreからデータを取得
    const employeesSnapshot = await getDocs(collection(db, "employees"));
    
    // 一時データを格納するオブジェクト
    const tempData = {};
    
    employeesSnapshot.forEach((doc) => {
      const data = doc.data();
      tempData[doc.id] = data;
    });
    
    console.log(`Firestoreから ${Object.keys(tempData).length} 人の従業員データを読み込みました`);
    
    // データが取得できた場合はグローバル変数に設定
    if (Object.keys(tempData).length > 0) {
      employeeData = tempData;
      return;
    }
    
    // Firestoreからデータが取得できない場合はJSONファイルを試す
    await fetchEmployeeDataFromJSON();
  } catch (error) {
    console.error('Firestoreからのデータ取得エラー:', error);
    // Firestoreからの取得に失敗した場合はJSONファイルを試す
    await fetchEmployeeDataFromJSON();
  }
}

// JSONファイルから従業員データを取得する関数（フォールバック）
async function fetchEmployeeDataFromJSON() {
  try {
    // JSONファイルのパスを複数試す
    const possiblePaths = [
      './firestore-data.json',  // 最初に現在のディレクトリを確認
      '/firestore-data.json',   // ルートパス
      '../temp/firestore-data.json',
      '/temp/firestore-data.json'
    ];
    
    let data = null;
    
    for (const path of possiblePaths) {
      try {
        console.log(`JSONファイルを ${path} から読み込み試行中...`);
        const response = await fetch(path);
        if (response.ok) {
          data = await response.json();
          console.log(`JSONデータを ${path} から読み込みました`);
          break;
        } else {
          console.warn(`${path} からのJSONデータ読み込みに失敗しました: ${response.status} ${response.statusText}`);
        }
      } catch (e) {
        console.warn(`${path} からのJSONデータ読み込みに失敗しました:`, e);
      }
    }
    
    if (data && data.employees) {
      employeeData = data.employees;
      console.log(`JSONから ${Object.keys(employeeData).length} 人の従業員データを読み込みました`);
      return;
    }
    
    // JSONファイルからも読み込めなかった場合はフォールバックデータを使用
    const fallbackData = getFallbackData();
    if (fallbackData) {
      employeeData = fallbackData;
      console.log(`フォールバックデータから ${Object.keys(employeeData).length} 人の従業員データを読み込みました`);
      return;
    }
    
    throw new Error('JSONファイルに従業員データがありません');
  } catch (error) {
    console.error('JSONからのデータ取得エラー:', error);
    
    // 最後の手段としてフォールバックデータを使用
    const fallbackData = getFallbackData();
    if (fallbackData) {
      employeeData = fallbackData;
      console.log(`フォールバックデータから ${Object.keys(employeeData).length} 人の従業員データを読み込みました`);
      return;
    }
    
    throw new Error('従業員データの取得に失敗しました');
  }
}

// ファイル選択時のイベントハンドラ
photoDirInput.addEventListener('change', (event) => {
  const files = event.target.files;
  selectedFiles = [];
  
  if (!files || files.length === 0) {
    uploadStatus.textContent = 'ファイルが選択されていません';
    return;
  }
  
  // 選択されたファイルをフィルタリング（PNGファイルのみ）
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // PNGファイルのみを処理
    if (file.type === 'image/png') {
      selectedFiles.push(file);
    }
  }
  
  // 選択されたファイルを処理
  processSelectedFiles();
});

// 選択されたファイルを処理する関数
function processSelectedFiles() {
  validFiles = [];
  
  if (selectedFiles.length === 0) {
    uploadStatus.textContent = 'PNGファイルが選択されていません';
    uploadStatus.className = 'status error';
    return;
  }
  
  // ログをクリア
  logContainer.innerHTML = '';
  
  // 各ファイルを検証
  for (const file of selectedFiles) {
    // ファイル名から従業員番号を抽出（例: "1001.png" → "1001"）
    const fileName = file.name;
    const empNo = fileName.split('.')[0];
    
    // 従業員データが存在するか確認
    if (employeeData[empNo]) {
      // アクティブな従業員のみフィルタリング（オプション）
      if (!onlyActiveCheckbox.checked || employeeData[empNo].status === 'active') {
        validFiles.push({
          file: file,
          empNo: empNo,
          name: employeeData[empNo]?.full_name_local || empNo,
          path: file.webkitRelativePath || fileName
        });
      } else {
        addLogEntry(`⚠️ 非アクティブな従業員: ${fileName} (${employeeData[empNo]?.full_name_local || empNo})`, 'warning');
      }
    } else {
      addLogEntry(`⚠️ 従業員データなし: ${fileName}`, 'warning');
    }
  }
  
  // 結果の表示
  uploadStatus.textContent = `${validFiles.length} 件の有効な顔写真ファイルが選択されました (全 ${selectedFiles.length} 件中)`;
  uploadStatus.className = 'status';
  
  // 有効なファイルがある場合はアップロードボタンを有効化
  startUploadBtn.disabled = validFiles.length === 0;
}

// アップロード開始ボタンのクリックイベント
startUploadBtn.addEventListener('click', () => {
  if (validFiles.length === 0) {
    uploadStatus.textContent = '有効なファイルがありません';
    uploadStatus.className = 'status error';
    return;
  }
  
  // アップロード設定を取得
  const batchSize = parseInt(batchSizeInput.value) || 10;
  maxConcurrentUploads = parseInt(concurrentUploadsInput.value) || 3;
  
  // アップロードキューを準備
  uploadQueue = [...validFiles];
  
  // 統計情報をリセット
  totalUploaded = 0;
  totalErrors = 0;
  totalSkipped = 0;
  activeUploads = 0;
  
  // UI状態を更新
  isUploading = true;
  isPaused = false;
  isCancelled = false;
  updateUIState();
  
  // プログレスバーをリセット
  totalProgress.style.width = '0%';
  
  // ログをクリア
  logContainer.innerHTML = '';
  
  // サマリーを非表示
  summaryElement.style.display = 'none';
  
  // アップロードを開始
  uploadStatus.textContent = 'アップロード開始...';
  uploadStatus.className = 'status';
  
  // 同時アップロードを開始
  for (let i = 0; i < Math.min(maxConcurrentUploads, uploadQueue.length); i++) {
    processNextUpload();
  }
});

// 一時停止ボタンのクリックイベント
pauseUploadBtn.addEventListener('click', () => {
  isPaused = true;
  updateUIState();
  uploadStatus.textContent = 'アップロードを一時停止しました。現在進行中のアップロードは完了まで続行されます。';
});

// 再開ボタンのクリックイベント
resumeUploadBtn.addEventListener('click', () => {
  isPaused = false;
  updateUIState();
  uploadStatus.textContent = 'アップロードを再開しています...';
  
  // 同時アップロードを再開
  const neededUploads = Math.min(maxConcurrentUploads - activeUploads, uploadQueue.length);
  for (let i = 0; i < neededUploads; i++) {
    processNextUpload();
  }
});

// キャンセルボタンのクリックイベント
cancelUploadBtn.addEventListener('click', () => {
  isCancelled = true;
  isPaused = false;
  updateUIState();
  uploadStatus.textContent = 'アップロードをキャンセルしました。現在進行中のアップロードは完了まで続行されます。';
});

// UI状態を更新する関数
function updateUIState() {
  startUploadBtn.disabled = isUploading;
  pauseUploadBtn.disabled = !isUploading || isPaused || isCancelled;
  resumeUploadBtn.disabled = !isUploading || !isPaused || isCancelled;
  cancelUploadBtn.disabled = !isUploading || isCancelled;
  photoDirInput.disabled = isUploading;
  recursiveSearchCheckbox.disabled = isUploading;
  onlyActiveCheckbox.disabled = isUploading;
  batchSizeInput.disabled = isUploading;
  concurrentUploadsInput.disabled = isUploading;
}

// 次のファイルをアップロードする関数
async function processNextUpload() {
  if (isPaused || isCancelled || uploadQueue.length === 0) {
    // すべてのアップロードが完了した場合
    if (activeUploads === 0 && (uploadQueue.length === 0 || isCancelled)) {
      finishUpload();
    }
    return;
  }
  
  // キューから次のファイルを取得
  const fileInfo = uploadQueue.shift();
  activeUploads++;
  
  try {
    // Firebase Storageへのアップロード
    const photoRef = ref(storage, `employee-photos/${fileInfo.empNo}.png`);
    
    // アップロード開始のログ
    addLogEntry(`🔄 アップロード中: ${fileInfo.path} (${fileInfo.name})`, 'info');
    
    // アップロード処理
    await uploadBytes(photoRef, fileInfo.file);
    
    // アップロードされた画像のURLを取得
    const photoURL = await getDownloadURL(photoRef);
    
    // ローカルストレージにURLをキャッシュ
    localStorage.setItem(`photo_${fileInfo.empNo}`, photoURL);
    localStorage.setItem(`photo_${fileInfo.empNo}_timestamp`, Date.now());
    
    // 成功のログ
    addLogEntry(`✅ アップロード成功: ${fileInfo.path} (${fileInfo.name})`, 'success');
    
    totalUploaded++;
  } catch (error) {
    console.error(`社員 ${fileInfo.empNo} の写真アップロードエラー:`, error);
    addLogEntry(`❌ アップロードエラー: ${fileInfo.path} - ${error.message}`, 'error');
    totalErrors++;
  } finally {
    activeUploads--;
    
    // 進捗状況の更新
    updateProgress();
    
    // 次のファイルを処理
    if (!isPaused && !isCancelled) {
      processNextUpload();
    } else if (activeUploads === 0 && (uploadQueue.length === 0 || isCancelled)) {
      // すべてのアップロードが完了した場合
      finishUpload();
    }
  }
}

// 進捗状況を更新する関数
function updateProgress() {
  const total = validFiles.length;
  const completed = totalUploaded + totalErrors + totalSkipped;
  const progressPercent = Math.round((completed / total) * 100);
  
  totalProgress.style.width = `${progressPercent}%`;
  uploadStatus.textContent = `進捗: ${completed}/${total} (${progressPercent}%) - 成功: ${totalUploaded}, エラー: ${totalErrors}, スキップ: ${totalSkipped}`;
}

// アップロード完了時の処理
function finishUpload() {
  isUploading = false;
  updateUIState();
  
  // 進捗バーを100%に
  totalProgress.style.width = '100%';
  
  // 結果の表示
  const total = validFiles.length;
  uploadStatus.textContent = `アップロード完了: 成功 ${totalUploaded} 件, エラー ${totalErrors} 件, スキップ ${totalSkipped} 件 (全 ${total} 件中)`;
  uploadStatus.className = totalErrors > 0 ? 'status error' : 'status success';
  
  // サマリーの表示
  totalFilesElement.textContent = selectedFiles.length;
  validFilesElement.textContent = validFiles.length;
  successCountElement.textContent = totalUploaded;
  errorCountElement.textContent = totalErrors;
  skippedCountElement.textContent = totalSkipped;
  summaryElement.style.display = 'block';
  
  // 最後のログエントリ
  addLogEntry(`🏁 アップロード処理完了: ${new Date().toLocaleString()}`, 'info');
}

// ログエントリを追加する関数
function addLogEntry(message, type) {
  const entry = document.createElement('div');
  entry.className = `log-entry log-${type}`;
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  logContainer.appendChild(entry);
  
  // 自動スクロール
  logContainer.scrollTop = logContainer.scrollHeight;
}
