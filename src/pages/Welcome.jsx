
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Firebase関連のインポート
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

// 共通のFirebase設定をインポート
import { firestoreDB as db, firebaseStorage as storage } from '../firebase/config';

const Welcome = ({ userName, daysUntilJoining }) => {
  // 新入社員データの状態
  const [newEmployees, setNewEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 現在の日付
  const currentDate = new Date();
  
  // 180日をミリ秒に変換
  const days180InMs = 180 * 24 * 60 * 60 * 1000;

  // コンポーネントマウント時に新入社員データを取得
  useEffect(() => {
    const fetchNewEmployees = async () => {
      try {
        setLoading(true);
        
        // Firestoreから従業員データを取得
        const employeesRef = collection(db, "employees");
        const q = query(
          employeesRef,
          where("status", "==", "active"),
          orderBy("join_date", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const employeesData = [];
        
        // 各従業員データを処理
        for (const doc of querySnapshot.docs) {
          const employee = doc.data();
          const empNo = doc.id;
          
          // join_dateが存在する場合のみ処理
          if (employee.join_date) {
            // join_dateをDate型に変換
            const joinDate = new Date(employee.join_date);
            
            // 現在の日付と入社日の差分を計算（ミリ秒）
            const diffMs = currentDate - joinDate;
            
            // 180日以内かどうかをチェック
            if (diffMs >= 0 && diffMs <= days180InMs) {
              // 写真URLを取得
              let photoURL = null;
              try {
                const photoRef = ref(storage, `employee-photos/${empNo}.png`);
                photoURL = await getDownloadURL(photoRef);
              } catch (photoError) {
                console.log(`社員 ${empNo} の写真が見つかりません:`, photoError);
                // 写真が見つからない場合はデフォルト画像を使用
                photoURL = '/images/default_emp_icon.png';
              }
              
              // 新入社員として追加
              employeesData.push({
                empNo,
                full_name_local: employee.full_name_local,
                join_date: employee.join_date,
                division_code: employee.division_code,
                days_since_joining: Math.floor(diffMs / (24 * 60 * 60 * 1000)),
                photoURL
              });
            }
          }
        }
        
        // 入社日の新しい順にソート
        employeesData.sort((a, b) => new Date(b.join_date) - new Date(a.join_date));
        
        setNewEmployees(employeesData);
        setLoading(false);
      } catch (err) {
        console.error("新入社員データの取得エラー:", err);
        setError("新入社員データの取得に失敗しました。");
        setLoading(false);
      }
    };
    
    fetchNewEmployees();
  }, []);

  // 部門名を取得する関数
  const getDivisionName = (divisionCode) => {
    const divisionMap = {
      'COR': 'コーポレート本部',
      'ENG': 'エンジニアリング部門',
      'PRJ': 'プロジェクト部門',
      'SLS': 'セールス部門',
      'BRD': '取締役会'
    };
    
    // 部門コードの先頭部分を取得（例: COR-D01-S02 → COR）
    const mainDivision = divisionCode?.split('-')[0];
    return divisionMap[mainDivision] || divisionCode;
  };

  // 日付をフォーマットする関数
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <h1>ようこそ、{userName}さん！</h1>
      </header>

      <main className="welcome-main">
        <div className="card welcome-card">
          <img 
            src="/images/welcome-team.png" 
            alt="ウェルカムイメージ" 
            className="welcome-img" 
          />
          <h2>あなたの入社を心待ちにしています！</h2>
          <p>一緒に準備を進めましょう。</p>
          <Link to="/dashboard">
            <button className="welcome-button">はじめる</button>
          </Link>
        </div>
        
        <div className="card new-employees-card">
          <h2>最近入社した新しい仲間たち</h2>
          
          {loading ? (
            <p>読み込み中...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="new-employees-grid">
              {newEmployees.map((employee) => (
                <div key={employee.empNo} className="employee-card">
                  <img 
                    src={employee.photoURL} 
                    alt={`${employee.full_name_local}の写真`} 
                    className="employee-photo" 
                    onError={(e) => { e.target.src = '/images/default_emp_icon.png'; }}
                  />
                  <div className="employee-info">
                    <h3>{employee.full_name_local}</h3>
                    <p className="employee-division">{getDivisionName(employee.division_code)}</p>
                    <p className="employee-join-date">入社日: {formatDate(employee.join_date)}</p>
                    <p className="employee-days">{employee.days_since_joining}日前に入社</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="welcome-footer">
        入社日まであと <strong>{daysUntilJoining}</strong> 日です！
      </footer>
    </div>
  );
};

export default Welcome;

// スタイル定義
const styles = `
  .welcome-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .welcome-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .welcome-main {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  
  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .welcome-card {
    text-align: center;
  }
  
  .welcome-img {
    max-width: 100%;
    height: auto;
    margin-bottom: 20px;
    border-radius: 8px;
  }
  
  .welcome-button {
    background: #4285F4;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 15px;
  }
  
  .welcome-button:hover {
    background: #3367D6;
  }
  
  .new-employees-card h2 {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .new-employees-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .employee-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    border-radius: 8px;
    background: #f9f9f9;
    transition: transform 0.2s;
  }
  
  .employee-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .employee-photo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px;
    border: 3px solid white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .employee-info {
    text-align: center;
    width: 100%;
  }
  
  .employee-info h3 {
    margin: 0 0 5px;
    font-size: 16px;
  }
  
  .employee-division {
    color: #666;
    font-size: 14px;
    margin: 5px 0;
    background: #e9f0fe;
    padding: 3px 8px;
    border-radius: 12px;
    display: inline-block;
  }
  
  .employee-join-date {
    font-size: 12px;
    color: #666;
    margin: 5px 0;
  }
  
  .employee-days {
    font-size: 12px;
    color: #4285F4;
    font-weight: bold;
    margin: 5px 0;
  }
  
  .welcome-footer {
    text-align: center;
    margin-top: 30px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
  }
  
  .error-message {
    color: #F44336;
    text-align: center;
  }
`;

// スタイルをドキュメントに追加
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}
