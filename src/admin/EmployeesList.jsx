import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStyles.css';
import './employee-styles.css';

// Firebase関連のインポート
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

// 共通のFirebase設定をインポート
import { firestoreDB as db, firebaseStorage as storage } from '../firebase/config';

// ローカル開発用のJSONデータ
// 注: 実行時に動的に読み込むように変更

const EmployeesList = () => {
  const navigate = useNavigate();
  
  // 状態管理
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [photoUrls, setPhotoUrls] = useState({});

  // バケットURLを取得
  const bucketUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/`;

  // 現在の日付
  const currentDate = new Date();
  
  // 180日をミリ秒に変換
  const days180InMs = 180 * 24 * 60 * 60 * 1000;

  // モックデータ（Firestore接続に問題がある場合のフォールバック）
  const mockEmployees = [
    { 
      id: "E001", 
      name: "渡辺 悠希", 
      email: "y.watanabe@example.com", 
      joiningDate: "2025/02/01",
      department: "エンジニアリング部",
      progress: 75,
      status: "in-progress",
      days_since_joining: 114
    },
    { 
      id: "E002", 
      name: "中村 太陽", 
      email: "t.nakamura@example.com", 
      joiningDate: "2025/03/01",
      department: "エンジニアリング部",
      progress: 100,
      status: "completed",
      days_since_joining: 85
    },
    { 
      id: "E003", 
      name: "大原 孝之", 
      email: "t.ohara@example.com", 
      joiningDate: "2025/04/01",
      department: "エンジニアリング部",
      progress: 50,
      status: "in-progress",
      days_since_joining: 54
    },
    { 
      id: "E004", 
      name: "藤田 健太", 
      email: "k.fujita@example.com", 
      joiningDate: "2025/04/01",
      department: "プロジェクト部",
      progress: 25,
      status: "in-progress",
      days_since_joining: 54
    },
    { 
      id: "E005", 
      name: "尾形 香織", 
      email: "k.ogata@example.com", 
      joiningDate: "2025/04/15",
      department: "営業部",
      progress: 0,
      status: "not-started",
      days_since_joining: 40
    },
    { 
      id: "E006", 
      name: "高橋 美咲", 
      email: "m.takahashi@example.com", 
      joiningDate: "2025/05/01",
      department: "コーポレート本部",
      progress: 0,
      status: "not-started",
      days_since_joining: 24
    },
    { 
      id: "E007", 
      name: "伊藤 光幸", 
      email: "m.ito@example.com", 
      joiningDate: "2025/05/15",
      department: "エンジニアリング部",
      progress: 0,
      status: "not-started",
      days_since_joining: 10
    }
  ];

  // モック写真URLデータ
  const mockPhotoUrls = {
    "E001": "/images/default_emp_icon.png",
    "E002": "/images/default_emp_icon.png",
    "E003": "/images/default_emp_icon.png",
    "E004": "/images/default_emp_icon.png",
    "E005": "/images/default_emp_icon.png",
    "E006": "/images/default_emp_icon.png",
    "E007": "/images/default_emp_icon.png"
  };

  // 新入社員データを取得する関数
  const fetchNewEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const date180DaysAgo = new Date(currentDate.getTime() - days180InMs);
      const date180DaysAgoStr = date180DaysAgo.toISOString().split('T')[0]; // YYYY-MM-DD形式
      
      console.log(`180日前の日付: ${date180DaysAgoStr}`);
      
      // Firestoreから組織データを取得
      console.log('Firestoreから組織データを取得します');
      const orgsSnapshot = await getDocs(collection(db, 'organizations'));
      const orgsData = {};
      
      orgsSnapshot.forEach(doc => {
        const orgData = doc.data();
        orgsData[doc.id] = orgData.division_name_local || doc.id;
      });
      
      console.log(`${Object.keys(orgsData).length}件の組織データを取得しました`);
      
      // new_hireコレクションからstatusがactiveまたはprejoinのレコードを取得
      console.log('Firestoreからnew_hireデータを取得します');
      const newHireQuery = query(
        collection(db, 'new_hire'),
        where('status', 'in', ['active', 'prejoin'])
      );
      
      const newHireSnapshot = await getDocs(newHireQuery);
      console.log(`${newHireSnapshot.size}件のnew_hireデータを取得しました`);
      
      // 従業員データを処理
      const employeesData = [];
      const photoUrlsData = {};
      
      // new_hireコレクションから取得したデータを処理
      const newEmployees = [];
      
      // まずemployeesコレクションからメールアドレス情報を取得
      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      const employeesMap = {};
      
      employeesSnapshot.forEach(doc => {
        const empData = doc.data();
        if (empData.emp_no) {
          employeesMap[empData.emp_no] = {
            email_addr: empData.email_addr || '',
            division_code: empData.division_code || '',
            full_name_alphabet: empData.full_name_alphabet || ''
          };
        }
      });
      
      console.log('employeesコレクションから取得したデータ:', employeesMap);
      
      newHireSnapshot.forEach(doc => {
        const newHireData = doc.data();
        if (newHireData.emp_no) {
          // employeesコレクションから追加情報を取得
          const employeeInfo = employeesMap[newHireData.emp_no] || {};
          
          // 入社日を処理
          let joinDateValue = newHireData.join_date || employeeInfo.join_date;
          
          // 元の入社日情報をそのまま出力
          console.log(`元の入社日情報 (${typeof joinDateValue}):`, joinDateValue);
          
          // 入社日が文字列の場合はそのまま使用
          if (typeof joinDateValue === 'string') {
            console.log(`文字列形式の入社日をそのまま使用: ${joinDateValue}`);
            // 変換なし
          }
          // Timestamp形式の場合は変換
          else if (joinDateValue && typeof joinDateValue === 'object' && 'seconds' in joinDateValue && 'nanoseconds' in joinDateValue) {
            const originalValue = joinDateValue;
            try {
              const date = new Date(joinDateValue.seconds * 1000);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              joinDateValue = `${year}/${month}/${day}`;
              console.log(`Timestamp変換後の入社日: ${joinDateValue}, 元の値:`, originalValue);
            } catch (e) {
              console.error('Timestamp変換エラー:', e);
              joinDateValue = '不明';
            }
          }
          // 入社日がない場合は「不明」と表示
          else if (!joinDateValue) {
            joinDateValue = '不明';
            console.log(`入社日なし、'不明'を設定`);
          }
          // その他の場合
          else {
            console.log(`不明な形式の入社日:`, joinDateValue);
            joinDateValue = '不明';
          }
          
          console.log(`社員ID ${newHireData.emp_no} の入社日:`, joinDateValue);
          
          newEmployees.push({
            emp_no: newHireData.emp_no,
            full_name_local: newHireData.full_name_local || 'Unknown',
            full_name_alphabet: newHireData.full_name_alphabet || employeeInfo.full_name_alphabet || '',
            join_date: joinDateValue,
            division_code: newHireData.division_code || employeeInfo.division_code || '',
            status: newHireData.status || 'active',
            email_addr: employeeInfo.email_addr || ''
          });
        }
      });
      
      console.log(`${newEmployees.length}人の新入社員データを処理します`);
      
      // 入社日の新しい順にソート
      newEmployees.sort((a, b) => new Date(b.join_date) - new Date(a.join_date));
      
      for (const empData of newEmployees) {
        const empId = empData.emp_no;
        
        // 入社日からの経過日数を計算
        let joinDate;
        let formattedJoinDate;
        let daysSinceJoining = 0;
        
        try {
          // join_dateの情報をそのまま使用
          if (empData.join_date) {
            console.log(`入社日データタイプ: ${typeof empData.join_date}`, empData.join_date);
            
            // 文字列の場合はそのまま使用
            if (typeof empData.join_date === 'string') {
              console.log(`文字列形式の入社日をそのまま使用: ${empData.join_date}`);
              joinDate = empData.join_date; // 文字列をそのまま使用
              formattedJoinDate = empData.join_date; // フォーマットも不要
            }
            // Timestampオブジェクトの場合
            else if (typeof empData.join_date === 'object' && 'seconds' in empData.join_date && 'nanoseconds' in empData.join_date) {
              console.log(`Timestamp形式の日付を処理:`, empData.join_date);
              try {
                const date = new Date(empData.join_date.seconds * 1000);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                formattedJoinDate = `${year}/${month}/${day}`;
                joinDate = formattedJoinDate;
                console.log(`Timestampから変換した入社日: ${formattedJoinDate}`);
              } catch (e) {
                console.error('Timestamp変換エラー:', e);
                joinDate = '不明';
                formattedJoinDate = '不明';
              }
            }
            // Dateオブジェクトの場合
            else if (empData.join_date instanceof Date) {
              console.log('Dateオブジェクトの日付を処理');
              try {
                const date = empData.join_date;
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                formattedJoinDate = `${year}/${month}/${day}`;
                joinDate = formattedJoinDate;
              } catch (e) {
                console.error('Date変換エラー:', e);
                joinDate = '不明';
                formattedJoinDate = '不明';
              }
            }
            // その他の場合
            else {
              console.log(`不明な形式の日付を処理:`, empData.join_date);
              joinDate = '不明';
              formattedJoinDate = '不明';
            }
          } else {
            // 日付がない場合
            console.warn(`入社日が存在しません: ${empData.emp_no}`);
            joinDate = '不明';
            formattedJoinDate = '不明';
          }
          
          // 経過日数を計算
          if (typeof joinDate === 'string') {
            // 日付が文字列の場合は経過日数は計算しない
            daysSinceJoining = 0;
            // formattedJoinDateはすでに設定済み
          } else if (joinDate instanceof Date) {
            // Dateオブジェクトの場合は経過日数を計算
            daysSinceJoining = Math.floor((currentDate - joinDate) / (1000 * 60 * 60 * 24));
            
            // 日付形式をYYYY/MM/DDに変換
            const year = joinDate.getFullYear();
            const month = String(joinDate.getMonth() + 1).padStart(2, '0');
            const day = String(joinDate.getDate()).padStart(2, '0');
            formattedJoinDate = `${year}/${month}/${day}`;
          } else {
            // その他の場合は経過日数は0
            daysSinceJoining = 0;
          }
          
          console.log(`フォーマットされた入社日: ${formattedJoinDate}`);
        } catch (dateErr) {
          console.error('日付処理エラー:', dateErr);
          joinDate = '不明';
          formattedJoinDate = '不明';
          daysSinceJoining = 0;
        }
        
        // 進捗率を計算 (180日を100%とする)
        const progress = Math.min(100, Math.round((daysSinceJoining / 180) * 100));
        
        // ステータスを決定
        let status = 'not-started';
        if (progress >= 100) {
          status = 'completed';
        } else if (progress > 0) {
          status = 'in-progress';
        }
        
        // 従業員データを追加
        // 氏名をフォーマット（日本語名 + アルファベット名）
        let displayName = empData.full_name_local;
        if (empData.full_name_alphabet && empData.full_name_alphabet.trim() !== '') {
          displayName = `${empData.full_name_local} (${empData.full_name_alphabet})`;
        }
        
        const employeeItem = {
          id: empId,
          name: displayName,
          email: empData.email_addr || generateEmail(empData.full_name_local),
          joiningDate: formattedJoinDate,
          department: getDepartmentName(empData.division_code, orgsData),
          progress: progress,
          status: status,
          days_since_joining: daysSinceJoining
        };
        
        console.log('追加する従業員データ:', employeeItem);
        employeesData.push(employeeItem);
        
        // Firebase Storageから写真を取得
        if (empId) {
          try {
            // Firebase Storageから画像を取得
            const photoRef = ref(storage, `employee-photos/${empId}.png`);
            console.log('画像参照を作成:', photoRef);
            
            getDownloadURL(photoRef)
              .then(url => {
                console.log(`画像取得成功: ${empId}, URL: ${url}`);
                // 写真URLを設定
                setPhotoUrls(prev => ({
                  ...prev,
                  [empId]: url
                }));
              })
              .catch(err => {
                console.warn(`画像取得失敗: ${empId}`, err);
                // デフォルト画像を設定
                setPhotoUrls(prev => ({
                  ...prev,
                  [empId]: '/images/default_emp_icon.png'
                }));
              });
          } catch (photoErr) {
            console.warn(`社員ID ${empId} の写真取得エラー:`, photoErr);
            photoUrlsData[empId] = '/images/default_emp_icon.png';
          }
        }
      }
      
      setEmployees(employeesData);
      setPhotoUrls(photoUrlsData);
      setLoading(false);
    } catch (err) {
      console.error('Firestoreからのデータ取得エラー:', err);
      
      // エラー発生時はモックデータを使用
      console.log('エラーが発生したため、モックデータを使用します');
      setEmployees(mockEmployees);
      setPhotoUrls(mockPhotoUrls);
      setError('Firestoreからのデータ取得に失敗しました。モックデータを表示しています。');
      setLoading(false);
    }
  };
  
  // コンポーネントマウント時に新入社員データを取得
  useEffect(() => {
    // Firebase Storageのバケット情報をログ出力
    console.log('Firebase Storageバケット:', storage.app.options.storageBucket);
    console.log('FirebaseプロジェクトID:', storage.app.options.projectId);
    
    fetchNewEmployees();
  }, []);
  
  // 部門名を取得する関数
  const getDepartmentName = (divisionCode, orgsData) => {
    if (!divisionCode) return '部門不明';
    
    console.log(`部門コード: ${divisionCode}`, orgsData);
    
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
    
    console.log(`メールアドレス生成: ${fullName}`);
    
    // 日本語名をローマ字化する簡易マッピング
    const japaneseToRoman = {
      'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
      'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
      'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
      'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
      'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
      'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
      'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
      'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
      'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
      'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',
      // 漢字の一部
      '田': 'ta', '中': 'naka', '山': 'yama', '川': 'kawa',
      '伊': 'i', '藤': 'to', '高': 'taka', '橋': 'hashi',
      '佐': 'sa', '藩': 'sato', '渡': 'wata',
      '辰': 'tatsu', '小': 'ko', '大': 'o', '松': 'matsu', '本': 'moto',
      '村': 'mura', '林': 'hayashi', '金': 'kane', '子': 'ko',
      '郁': 'yu', '光': 'mitsu', '幸': 'yuki', '健': 'ken',
      '陽': 'yo', '海': 'kai', '香': 'ka', '美': 'mi', '咲': 'saki',
      // 追加の漢字
      '木': 'ki', '鈴': 'suzu', '太': 'ta'
    };
    
    // 名前を分割
    const nameParts = fullName.split(' ');
    
    if (nameParts.length >= 2) {
      // 姓と名前のローマ字化を試みる
      let firstName = nameParts[0];
      let lastName = nameParts[1];
      
      // 簡易的なローマ字化
      const initial = firstName.charAt(0).toLowerCase();
      
      // ローマ字化された名前が利用可能な場合は使用
      if (/^[a-zA-Z]/.test(lastName)) {
        return `${initial}.${lastName.toLowerCase()}@example.com`;
      }
      
      // 日本語名の場合はデフォルトのパターンを使用
      return `${initial}.${lastName.length > 0 ? lastName.charAt(0).toLowerCase() : 'x'}@example.com`;
    }
    
    // 単一名の場合
    return `${fullName.replace(/\s+/g, '.').toLowerCase().substring(0, 8)}@example.com`;
  };

  // 検索とフィルタリング
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || employee.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // ステータス表示のヘルパー関数
  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return '完了';
      case 'in-progress': return '進行中';
      case 'not-started': return '未開始';
      default: return status;
    }
  };

  return (
    <div>
      {/* 検索とフィルターのツールバー */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <input 
            type="text" 
            placeholder="名前、メール、部署で検索..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="admin-filter">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">すべてのステータス</option>
            <option value="completed">完了</option>
            <option value="in-progress">進行中</option>
            <option value="not-started">未開始</option>
          </select>
        </div>
        <button className="admin-button" onClick={() => navigate('/admin/add-employee')}>新入社員を追加</button>
      </div>

      {/* 社員リスト */}
      <div className="admin-card">
        <h3 className="admin-card-title">新入社員一覧 (入社後180日以内)</h3>
        
        {loading ? (
          <div className="admin-loading">データを読み込み中...</div>
        ) : error ? (
          <div className="admin-error">{error}</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="admin-empty">該当する新入社員が見つかりません</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>氏名</th>
                <th>メールアドレス</th>
                <th>入社日</th>
                <th>部署</th>
                <th>進捗</th>
                <th>ステータス</th>
                <th>アクション</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee.id}>
                  <td>
                    <div className="employee-list-item">
                      <div className="employee-list-photo">
                        <img 
                          src={photoUrls[employee.id] || '/images/default_emp_icon.png'} 
                          alt={employee.name} 
                          onLoad={(e) => {
                            console.log(`画像読み込み成功: ${employee.id}`);
                            console.log('読み込まれた画像ソース:', e.target.src);
                          }} 
                          onError={(e) => { 
                            console.error(`画像読み込みエラー: ${employee.id}`, e); 
                            console.log('元のソース:', e.target.src);
                            e.target.src = '/images/default_emp_icon.png'; 
                            console.log('デフォルト画像に切り替え'); 
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <span>{employee.name}</span>
                    </div>
                  </td>
                  <td>{employee.email}</td>
                  <td>{employee.joiningDate}</td>
                  <td>{employee.department}</td>
                  <td>
                    <div className="admin-progress-bar-container">
                      <div 
                        className="admin-progress-bar" 
                        style={{ width: `${employee.progress}%` }}
                      ></div>
                      <span>{employee.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status ${employee.status}`}>
                      {getStatusLabel(employee.status)}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button 
                        className="admin-action-button" 
                        onClick={() => navigate(`/admin/newhire/${employee.id}/info`)}
                      >
                        詳細
                      </button>
                      <button className="admin-action-button">編集</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeesList;
