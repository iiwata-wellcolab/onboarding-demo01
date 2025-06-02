import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStyles.css';
import './employee-styles.css';

// Firebase関連のインポート
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

// 共通のFirebase設定をインポート
import { firestoreDB as db, firebaseStorage as storage } from '../firebase/config';

const EmployeeDirectory = () => {
  const navigate = useNavigate();
  
  // 状態管理
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [photoUrls, setPhotoUrls] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // 無限スクロール用の監視対象要素
  const observer = useRef();
  // 最後の要素を監視するためのコールバック関数
  const lastEmployeeElementRef = useCallback(node => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreEmployees();
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);

  // バケットURLを取得
  const bucketUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/`;

  // モックデータ（Firestore接続に問題がある場合のフォールバック）
  const mockEmployees = [
    { 
      id: "E001", 
      emp_no: "E001",
      name: "渡辺 悠希", 
      email: "y.watanabe@example.com", 
      department: "エンジニアリング部",
      position: "ソフトウェアエンジニア"
    },
    { 
      id: "E002", 
      emp_no: "E002",
      name: "中村 太陽", 
      email: "t.nakamura@example.com", 
      department: "エンジニアリング部",
      position: "シニアエンジニア"
    },
    { 
      id: "E003", 
      emp_no: "E003",
      name: "大原 孝之", 
      email: "t.ohara@example.com", 
      department: "エンジニアリング部",
      position: "プロジェクトマネージャー"
    },
    { 
      id: "E004", 
      emp_no: "E004",
      name: "藤田 健太", 
      email: "k.fujita@example.com", 
      department: "プロジェクト部",
      position: "プロジェクトリーダー"
    },
    { 
      id: "E005", 
      emp_no: "E005",
      name: "尾形 香織", 
      email: "k.ogata@example.com", 
      department: "営業部",
      position: "セールスマネージャー"
    }
  ];

  // モック写真URLデータ
  const mockPhotoUrls = {
    "E001": "/images/default_emp_icon.png",
    "E002": "/images/default_emp_icon.png",
    "E003": "/images/default_emp_icon.png",
    "E004": "/images/default_emp_icon.png",
    "E005": "/images/default_emp_icon.png"
  };

  // 社員データを取得する関数
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Firestoreから組織データを取得
      console.log('Firestoreから組織データを取得します');
      const orgsSnapshot = await getDocs(collection(db, 'organizations'));
      const orgsData = {};
      
      orgsSnapshot.forEach(doc => {
        const orgData = doc.data();
        orgsData[doc.id] = orgData.division_name_local || doc.id;
      });
      
      console.log(`${Object.keys(orgsData).length}件の組織データを取得しました`);
      
      // employeesコレクションからデータを取得（最初の20件）
      console.log('Firestoreからemployeesデータを取得します');
      
      // クエリを定義
      let employeesQuery;
      let employeesSnapshot;
      
      try {
        // インデックスが作成されたので、元のクエリに戻す
        employeesQuery = query(
          collection(db, 'employees'),
          where('status', '==', 'active'),
          orderBy('emp_no'), // ソート順を指定
          limit(20)
        );
      
        employeesSnapshot = await getDocs(employeesQuery);
        console.log(`${employeesSnapshot.size}件のemployeesデータを取得しました`);
      } catch (queryError) {
        console.error('statusフィールドでのクエリエラー:', queryError);
        // statusフィールドがない場合は別のフィルタリングを試みる
        console.log('退職者を除外するための別のフィルタリングで再試行');
        try {
          // まずは退職日がないユーザーを取得
          employeesQuery = query(
            collection(db, 'employees'),
            where('retirement_date', '==', null),
            orderBy('emp_no'), // ソート順を指定
            limit(20)
          );
          employeesSnapshot = await getDocs(employeesQuery);
          console.log(`退職日フィルタ: ${employeesSnapshot.size}件のemployeesデータを取得しました`);
        } catch (retirementError) {
          console.error('退職日フィルタでのクエリエラー:', retirementError);
          // 最終手段として、フィルタなしで取得
          employeesQuery = query(
            collection(db, 'employees'),
            orderBy('emp_no'), // ソート順を指定
            limit(20)
          );
          employeesSnapshot = await getDocs(employeesQuery);
          console.log(`フィルタなし: ${employeesSnapshot.size}件のemployeesデータを取得しました`);
        }
      }
      
      // 最後の要素を保存（ページング用）
      if (employeesSnapshot.size > 0) {
        setLastVisible(employeesSnapshot.docs[employeesSnapshot.size - 1]);
      } else {
        setHasMore(false);
      }
      
      // 従業員データを処理
      const employeesData = [];
      const photoUrlsData = {};
      
      // employeesコレクションから取得したデータを処理
      employeesSnapshot.forEach(doc => {
        const empData = doc.data();
        if (empData.emp_no) {
          // 役職情報のデバッグ
          console.log(`社員ID ${empData.emp_no} の役職情報:`, {
            position: empData.position,
            position_name_local: empData.position_name_local
          });
          
          // 従業員プロフィールデータを作成
          employeesData.push({
            id: doc.id,
            emp_no: empData.emp_no,
            name: empData.full_name_local || 'Unknown',
            email: empData.email_addr || generateEmail(empData.full_name_local),
            department: getDepartmentName(empData.division_code, orgsData),
            position: empData.position || empData.position_name_local || ''
          });
          
          // Firebase Storageから写真を取得
          if (empData.emp_no) {
            try {
              // Firebase Storageから画像を取得
              const photoRef = ref(storage, `employee-photos/${empData.emp_no}.png`);
              console.log('画像参照を作成:', photoRef);
              
              getDownloadURL(photoRef)
                .then(url => {
                  console.log(`画像取得成功: ${empData.emp_no}, URL: ${url}`);
                  // 写真URLを設定
                  setPhotoUrls(prev => ({
                    ...prev,
                    [empData.emp_no]: url
                  }));
                })
                .catch(err => {
                  console.warn(`画像取得失敗: ${empData.emp_no}`, err);
                  // デフォルト画像を設定
                  setPhotoUrls(prev => ({
                    ...prev,
                    [empData.emp_no]: '/images/default_emp_icon.png'
                  }));
                });
            } catch (photoErr) {
              console.warn(`社員ID ${empData.emp_no} の写真取得エラー:`, photoErr);
              photoUrlsData[empData.emp_no] = '/images/default_emp_icon.png';
            }
          }
        }
      });
      
      setEmployees(employeesData);
      setPhotoUrls(prev => ({...prev, ...photoUrlsData}));
      setLoading(false);
    } catch (err) {
      console.error('Firestoreからのデータ取得エラー:', err);
      
      // エラー発生時はモックデータを使用
      console.log('エラーが発生したため、モックデータを使用します');
      setEmployees(mockEmployees);
      setPhotoUrls(mockPhotoUrls);
      setError('Firestoreからのデータ取得に失敗しました。モックデータを表示しています。');
      setLoading(false);
      setHasMore(false);
    }
  };

  // 追加の社員データを読み込む関数
  const loadMoreEmployees = async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      
      // 最後に表示した要素以降のデータを取得
      let employeesQuery;
      let employeesSnapshot;
      
      try {
        // インデックスが作成されたので、元のクエリに戻す
        employeesQuery = query(
          collection(db, 'employees'),
          where('status', '==', 'active'),
          orderBy('emp_no'), // ソート順を指定
          startAfter(lastVisible),
          limit(10)
        );
      
        employeesSnapshot = await getDocs(employeesQuery);
        console.log(`追加で${employeesSnapshot.size}件のemployeesデータを取得しました`);
      } catch (queryError) {
        console.error('追加読み込み: statusフィールドでのクエリエラー:', queryError);
        // statusフィールドがない場合は別のフィルタリングを試みる
        console.log('退職者を除外するための別のフィルタリングで再試行');
        try {
          // まずは退職日がないユーザーを取得
          employeesQuery = query(
            collection(db, 'employees'),
            where('retirement_date', '==', null),
            orderBy('emp_no'), // ソート順を指定
            startAfter(lastVisible),
            limit(10)
          );
          employeesSnapshot = await getDocs(employeesQuery);
          console.log(`退職日フィルタ: 追加で${employeesSnapshot.size}件のemployeesデータを取得しました`);
        } catch (retirementError) {
          console.error('退職日フィルタでのクエリエラー:', retirementError);
          // 最終手段として、フィルタなしで取得
          employeesQuery = query(
            collection(db, 'employees'),
            orderBy('emp_no'), // ソート順を指定
            startAfter(lastVisible),
            limit(10)
          );
          employeesSnapshot = await getDocs(employeesQuery);
          console.log(`フィルタなし: 追加で${employeesSnapshot.size}件のemployeesデータを取得しました`);
        }
      }
      
      // 最後の要素を更新
      if (employeesSnapshot.size > 0) {
        setLastVisible(employeesSnapshot.docs[employeesSnapshot.size - 1]);
      } else {
        setHasMore(false);
      }
      
      // 組織データを取得（キャッシュがあれば使用）
      const orgsSnapshot = await getDocs(collection(db, 'organizations'));
      const orgsData = {};
      
      orgsSnapshot.forEach(doc => {
        const orgData = doc.data();
        orgsData[doc.id] = orgData.division_name_local || doc.id;
      });
      
      // 新しい従業員データを処理
      const newEmployeesData = [];
      
      employeesSnapshot.forEach(doc => {
        const empData = doc.data();
        if (empData.emp_no) {
          // 役職情報のデバッグ
          console.log(`追加読み込み: 社員ID ${empData.emp_no} の役職情報:`, {
            position: empData.position,
            position_name_local: empData.position_name_local
          });
          
          // 従業員プロフィールデータを作成
          newEmployeesData.push({
            id: doc.id,
            emp_no: empData.emp_no,
            name: empData.full_name_local || 'Unknown',
            email: empData.email_addr || generateEmail(empData.full_name_local),
            department: getDepartmentName(empData.division_code, orgsData),
            position: empData.position || empData.position_name_local || ''
          });
          
          // Firebase Storageから写真を取得
          if (empData.emp_no) {
            try {
              const photoRef = ref(storage, `employee-photos/${empData.emp_no}.png`);
              
              getDownloadURL(photoRef)
                .then(url => {
                  setPhotoUrls(prev => ({
                    ...prev,
                    [empData.emp_no]: url
                  }));
                })
                .catch(err => {
                  setPhotoUrls(prev => ({
                    ...prev,
                    [empData.emp_no]: '/images/default_emp_icon.png'
                  }));
                });
            } catch (photoErr) {
              console.warn(`社員ID ${empData.emp_no} の写真取得エラー:`, photoErr);
            }
          }
        }
      });
      
      // 既存のデータに新しいデータを追加
      setEmployees(prev => [...prev, ...newEmployeesData]);
      setLoadingMore(false);
    } catch (err) {
      console.error('追加データ取得エラー:', err);
      setLoadingMore(false);
      setHasMore(false);
    }
  };
  
  // コンポーネントマウント時に社員データを取得
  useEffect(() => {
    console.log('Firebase Storageバケット:', storage.app.options.storageBucket);
    console.log('FirebaseプロジェクトID:', storage.app.options.projectId);
    
    fetchEmployees();
  }, []);
  
  // 部門名を取得する関数
  const getDepartmentName = (divisionCode, orgsData) => {
    if (!divisionCode) return '部門不明';
    
    // Firestoreから取得した組織データを使用
    if (orgsData && orgsData[divisionCode]) {
      return orgsData[divisionCode];
    }
    
    // フォールバック用の部門マップ
    const divisionMap = {
      'COR': 'コーポレート本部',
      'ENG': 'エンジニアリング部',
      'PRJ': 'プロジェクト部',
      'SLS': '営業部',
      'BRD': '取締役会'
    };
    
    // 部門コードが存在する場合はそのまま使用
    if (divisionMap[divisionCode]) {
      return divisionMap[divisionCode];
    }
    
    // 部門コードの先頭部分を取得（例: COR-D01-S02 → COR）
    const mainDivision = divisionCode.split('-')[0];
    return divisionMap[mainDivision] || `部門: ${divisionCode}`;
  };
  
  // メールアドレスを生成する関数
  const generateEmail = (fullName) => {
    if (!fullName) return 'email@example.com';
    
    // 名前を分割
    const nameParts = fullName.split(' ');
    
    if (nameParts.length >= 2) {
      // 簡易的なローマ字化
      const initial = nameParts[0].charAt(0).toLowerCase();
      const lastName = nameParts[1].toLowerCase();
      
      return `${initial}.${lastName}@example.com`;
    }
    
    // 単一名の場合
    return `${fullName.replace(/\s+/g, '.').toLowerCase().substring(0, 8)}@example.com`;
  };

  // 検索フィルタリング
  const filteredEmployees = employees.filter(employee => {
    return (
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.emp_no.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      {/* 検索ツールバー */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <input 
            type="text" 
            placeholder="社員番号、名前、メール、部署、役職で検索..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 社員リスト */}
      <div className="admin-card">
        <h3 className="admin-card-title">社員ディレクトリ</h3>
        
        {loading ? (
          <div className="admin-loading">データを読み込み中...</div>
        ) : error ? (
          <div className="admin-error">{error}</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="admin-empty">該当する社員が見つかりません</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>社員番号</th>
                <th>氏名</th>
                <th>部署</th>
                <th>役職</th>
                <th>メールアドレス</th>
                <th>アクション</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr 
                  key={`${employee.emp_no}_${index}`}
                  ref={index === filteredEmployees.length - 1 ? lastEmployeeElementRef : null}
                >
                  <td>{employee.emp_no}</td>
                  <td>
                    <div className="employee-list-item">
                      <div className="employee-list-photo">
                        <img 
                          src={photoUrls[employee.emp_no] || '/images/default_emp_icon.png'} 
                          alt={employee.name} 
                          onError={(e) => { 
                            e.target.src = '/images/default_emp_icon.png'; 
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <span>{employee.name}</span>
                    </div>
                  </td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td>{employee.email}</td>
                  <td>
                    <div className="admin-actions">
                      <button 
                        className="admin-action-button" 
                        onClick={() => navigate(`/admin/employee-detail/${employee.emp_no}`)}
                      >
                        詳細
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {loadingMore && (
          <div className="admin-loading-more">さらにデータを読み込み中...</div>
        )}
        
        {!hasMore && employees.length > 0 && (
          <div className="admin-no-more-data">すべての社員データを表示しました</div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDirectory;
