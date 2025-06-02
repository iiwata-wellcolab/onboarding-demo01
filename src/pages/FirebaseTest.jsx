import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { firestoreDB as db, firebaseStorage as storage } from '../firebase/config';

const FirebaseTest = () => {
  const [firestoreStatus, setFirestoreStatus] = useState('テスト未実行');
  const [storageStatus, setStorageStatus] = useState('テスト未実行');
  const [collections, setCollections] = useState([]);
  const [storageFiles, setStorageFiles] = useState([]);
  const [error, setError] = useState(null);

  // Firestoreアクセステスト
  const testFirestore = async () => {
    try {
      setFirestoreStatus('テスト中...');
      setError(null);
      
      // コレクション一覧を取得
      const collectionsData = [];
      
      // 主要コレクションをテスト
      const testCollections = ['employees', 'employee_profiles', 'new_hire', 'organizations'];
      
      for (const collName of testCollections) {
        try {
          const collRef = collection(db, collName);
          const snapshot = await getDocs(collRef);
          
          collectionsData.push({
            name: collName,
            count: snapshot.size,
            exists: snapshot.size > 0,
            error: null
          });
          
          console.log(`コレクション ${collName}: ${snapshot.size}件のドキュメントが見つかりました`);
        } catch (err) {
          console.error(`コレクション ${collName} の取得エラー:`, err);
          collectionsData.push({
            name: collName,
            count: 0,
            exists: false,
            error: err.message
          });
        }
      }
      
      setCollections(collectionsData);
      setFirestoreStatus('テスト完了');
    } catch (err) {
      console.error('Firestoreテストエラー:', err);
      setError(err.message);
      setFirestoreStatus('テスト失敗');
    }
  };

  // Storageアクセステスト
  const testStorage = async () => {
    try {
      setStorageStatus('テスト中...');
      setError(null);
      
      // ルートフォルダとemployee-photosフォルダをテスト
      const testFolders = ['/', 'employee-photos/'];
      const filesData = [];
      
      for (const folder of testFolders) {
        try {
          const folderRef = ref(storage, folder);
          const result = await listAll(folderRef);
          
          console.log(`フォルダ ${folder}: ${result.items.length}個のファイルが見つかりました`);
          
          // 最初の5つのファイルのURLを取得
          const fileItems = [];
          for (let i = 0; i < Math.min(5, result.items.length); i++) {
            try {
              const url = await getDownloadURL(result.items[i]);
              fileItems.push({
                name: result.items[i].name,
                url: url,
                error: null
              });
            } catch (urlErr) {
              fileItems.push({
                name: result.items[i].name,
                url: null,
                error: urlErr.message
              });
            }
          }
          
          filesData.push({
            folder: folder,
            count: result.items.length,
            exists: result.items.length > 0,
            files: fileItems,
            error: null
          });
        } catch (err) {
          console.error(`フォルダ ${folder} の取得エラー:`, err);
          filesData.push({
            folder: folder,
            count: 0,
            exists: false,
            files: [],
            error: err.message
          });
        }
      }
      
      setStorageFiles(filesData);
      setStorageStatus('テスト完了');
    } catch (err) {
      console.error('Storageテストエラー:', err);
      setError(err.message);
      setStorageStatus('テスト失敗');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Firebase 接続テスト</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Firestore テスト</h2>
        <div>
          <button 
            onClick={testFirestore}
            style={{ padding: '8px 16px', marginRight: '10px' }}
          >
            Firestoreテスト実行
          </button>
          <span>ステータス: {firestoreStatus}</span>
        </div>
        
        {collections.length > 0 && (
          <div style={{ marginTop: '15px' }}>
            <h3>コレクション一覧</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>コレクション名</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ドキュメント数</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>存在</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>エラー</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((coll, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{coll.name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{coll.count}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{coll.exists ? '✅' : '❌'}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', color: 'red' }}>{coll.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Storage テスト</h2>
        <div>
          <button 
            onClick={testStorage}
            style={{ padding: '8px 16px', marginRight: '10px' }}
          >
            Storageテスト実行
          </button>
          <span>ステータス: {storageStatus}</span>
        </div>
        
        {storageFiles.length > 0 && (
          <div style={{ marginTop: '15px' }}>
            <h3>ファイル一覧</h3>
            {storageFiles.map((folder, folderIndex) => (
              <div key={folderIndex} style={{ marginBottom: '20px' }}>
                <h4>フォルダ: {folder.folder}</h4>
                <p>ファイル数: {folder.count} {folder.exists ? '✅' : '❌'}</p>
                {folder.error && <p style={{ color: 'red' }}>エラー: {folder.error}</p>}
                
                {folder.files.length > 0 && (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ファイル名</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>URL</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>エラー</th>
                      </tr>
                    </thead>
                    <tbody>
                      {folder.files.map((file, fileIndex) => (
                        <tr key={fileIndex}>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{file.name}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                            {file.url ? (
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
                                {file.url.substring(0, 50)}...
                              </a>
                            ) : 'なし'}
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '8px', color: 'red' }}>{file.error}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <div style={{ color: 'red', marginTop: '20px', padding: '10px', border: '1px solid red' }}>
          <h3>エラー発生</h3>
          <p>{error}</p>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h2>Firebase 設定情報</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {`プロジェクトID: ${storage.app.options.projectId}
ストレージバケット: ${storage.app.options.storageBucket}`}
        </pre>
      </div>
    </div>
  );
};

export default FirebaseTest;
