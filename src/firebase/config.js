// Firebase設定の一元管理
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Firebase設定 - デモ用の設定に変更
const firebaseConfig = {
  apiKey: "AIzaSyDnW41I_neRyhZpON7BATvRMtBPSQmA9ds",
  authDomain: "iiwata-onboarding-demo01.firebaseapp.com",
  projectId: "iiwata-onboarding-demo01",
  storageBucket: "iiwata-onboarding-demo01.firebasestorage.app",
  messagingSenderId: "904336590646",
  appId: "1:904336590646:web:4ebc30b2e3efeb85da1597",
  measurementId: "G-BR5RKSR8TH"
};

// 開発環境かどうかを判定
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('172.31.');

// CORS問題を回避するための設定
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// Firebase初期化（アプリケーション全体で一度だけ初期化）
let firebaseApp;
let firestoreDB;
let firebaseStorage;
let firebaseAuth;

// アプリ初期化関数
const initializeFirebase = () => {
  try {
    // Firebaseアプリの初期化
    firebaseApp = initializeApp(firebaseConfig);
    console.log("Firebaseアプリ初期化成功");
    
    // Firebase認証の初期化
    firebaseAuth = getAuth(firebaseApp);
    
    // 匿名認証を実装
    console.log('匿名認証を試みます');
    
    // 匿名ログインを実行
    signInAnonymously(firebaseAuth)
      .then(() => {
        console.log('匿名認証に成功しました');
      })
      .catch((error) => {
        console.error('匿名認証に失敗しました:', error);
        // 認証エラーでもアプリが動作するようにする
        console.warn('認証エラーが発生しましたが、アプリは継続して動作します');
        // ここでエラーをスローしないことで、アプリは認証なしでも動作を試みる
      });
    
    // 認証状態の変更を監視
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        console.log('認証状態: ログイン済み', user.uid);
      } else {
        console.log('認証状態: 未ログイン');
      }
    });
    
    // Firestoreの初期化
    firestoreDB = getFirestore(firebaseApp);
    
    // Firebase Storageの初期化
    firebaseStorage = getStorage(firebaseApp);
    
    // 開発環境の場合、エミュレーターを使用するオプション
    if (isDevelopment && false) { // 必要に応じてtrueに変更
      // Firestoreエミュレーターの設定
      connectFirestoreEmulator(firestoreDB, 'localhost', 8080);
      // Storageエミュレーターの設定
      connectStorageEmulator(firebaseStorage, 'localhost', 9199);
      console.log('ローカルエミュレーターに接続しました');
    }
    
    return { firebaseApp, firebaseAuth, firestoreDB, firebaseStorage };
  } catch (error) {
    if (error.code === 'app/duplicate-app') {
      console.log("Firebaseはすでに初期化されています");
      try {
        // 既存のアプリを使用
        const existingApp = initializeApp(firebaseConfig, 'secondary');
        firebaseAuth = getAuth(existingApp);
        firestoreDB = getFirestore(existingApp);
        firebaseStorage = getStorage(existingApp);
        return { firebaseApp: existingApp, firebaseAuth, firestoreDB, firebaseStorage };
      } catch (secondaryError) {
        console.error("Secondary Firebase初期化エラー:", secondaryError);
        throw secondaryError;
      }
    } else {
      console.error("Firebase初期化エラー:", error);
      throw error;
    }
  }
};

// Firebase初期化を実行
const { firebaseApp: app, firebaseAuth: auth, firestoreDB: db, firebaseStorage: storage } = initializeFirebase();

export { app as firebaseApp, auth as firebaseAuth, db as firestoreDB, storage as firebaseStorage };

// デバッグ情報
console.log(`Firebase環境: ${isDevelopment ? '開発環境' : '本番環境'}`);
console.log(`FirebaseプロジェクトID: ${firebaseConfig.projectId}`);
console.log(`Firebaseストレージバケット: ${firebaseConfig.storageBucket}`);

