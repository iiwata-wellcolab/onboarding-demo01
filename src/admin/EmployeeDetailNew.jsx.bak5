import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './AdminStyles.css';
import './employee-styles.css';
import './employee-profile-styles.css';

// Firebase関連のインポート
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { firestoreDB as db, firebaseStorage as storage } from '../firebase/config';

const EmployeeDetailNew = () => {
  // 基本的な状態管理
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('/images/default_emp_icon.png');
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [employeeMaster, setEmployeeMaster] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const [mbtiData, setMbtiData] = useState({});
  
  const navigate = useNavigate();
  const { id } = useParams();
  
  // 従業員データを取得する関数
  const fetchEmployeeData = async (employeeId) => {
    try {
      console.log('従業員データ取得開始:', employeeId);
      
      // ローディング状態を設定
      setLoading(true);
      setError(null);
      
      // 各データを取得
      let newHireData = null;
      let employeeMasterData = null;
      let profileData = null;
      let orgData = null;

      // 1. employee_profiles データを取得
      const profileRef = doc(db, 'employee_profiles', employeeId);
      const profileSnapshot = await getDoc(profileRef);
      if (profileSnapshot.exists()) {
        profileData = profileSnapshot.data();
        console.log('プロフィールデータ取得成功:', profileData);
        setEmployeeProfile(profileData);
      } else {
        console.log(`プロフィールデータが見つかりません: ${employeeId}`);
      }

      // 2. employees データを取得
      const employeeRef = doc(db, 'employees', employeeId);
      const employeeSnapshot = await getDoc(employeeRef);
      if (employeeSnapshot.exists()) {
        employeeMasterData = employeeSnapshot.data();
        console.log('従業員マスターデータ取得成功:', employeeMasterData);
        setEmployeeMaster(employeeMasterData);
      } else {
        console.log(`従業員マスターデータが見つかりません: ${employeeId}`);
      }

      // 3. new_hire データを取得
      const newHireRef = doc(db, 'new_hire', employeeId);
      const newHireSnapshot = await getDoc(newHireRef);
      if (newHireSnapshot.exists()) {
        newHireData = newHireSnapshot.data();
        console.log('新入社員データ取得成功:', newHireData);
      } else {
        console.log(`新入社員データが見つかりません: ${employeeId}`);
      }

      // 4. 組織情報を取得
      const divisionCode = newHireData?.division_code || employeeMasterData?.division_code;
      if (divisionCode) {
        const orgRef = doc(db, 'organizations', divisionCode);
        const orgSnapshot = await getDoc(orgRef);
        if (orgSnapshot.exists()) {
          orgData = orgSnapshot.data();
          console.log('組織データ取得成功:', orgData);
          setOrganization(orgData);
        } else {
          console.log(`組織データが見つかりません: ${divisionCode}`);
        }
      }

      // 5. 従業員の顔写真を取得
      try {
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
          // ローカル環境ではローカルの画像ファイルを使用
          setPhotoUrl(`/images/${employeeId}.png`);
          console.log('ローカル環境の写真URLを設定:', `/images/${employeeId}.png`);
        } else {
          // Firebase Storageから画像を取得
          const emp_no = employeeMasterData?.emp_no || newHireData?.emp_no || employeeId;
          const photoRef = ref(storage, `employee-photos/${emp_no}.png`);
          try {
            const photoURL = await getDownloadURL(photoRef);
            console.log('従業員写真URL取得成功:', photoURL);
            setPhotoUrl(photoURL);
          } catch (photoError) {
            console.log('従業員写真の取得に失敗しました:', photoError);
          }
        }
      } catch (photoError) {
        console.log('写真取得中にエラーが発生しました:', photoError);
      }
      
      // 従業員データを構築
      if (newHireData || employeeMasterData) {
        // Timestamp型のデータを文字列に変換する関数
        const formatTimestamp = (timestamp) => {
          if (!timestamp) return '';
          
          // FirestoreのTimestamp型かどうかチェック
          if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toISOString().split('T')[0]; // YYYY-MM-DD形式
          }
          
          // すでに文字列の場合はそのまま返す
          return String(timestamp);
        };
        
        // マネージャー情報を取得
        let managerInfo = null;
        const supervisorEmpId = newHireData?.supervisor_emp_id || employeeMasterData?.supervisor_emp_id;
        console.log('上司の社員番号:', supervisorEmpId);
        
        if (supervisorEmpId) {
          try {
            // supervisor_emp_idが存在する場合、employeesコレクションからマネージャー情報を取得
            const employeesRef = collection(db, 'employees');
            const q = query(employeesRef, where('emp_no', '==', supervisorEmpId));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const managerDoc = querySnapshot.docs[0];
              const managerData = managerDoc.data();
              managerInfo = {
                id: managerDoc.id,
                name: managerData.full_name_local || `${managerData.last_name_local || ''} ${managerData.first_name_local || ''}`,
                name_alphabet: managerData.full_name_alphabet || '',
                emp_no: managerData.emp_no || supervisorEmpId
              };
              setManagerData(managerInfo);
              console.log('マネージャーデータ取得成功:', managerInfo);
            } else {
              console.log(`マネージャーデータが見つかりません: 社員番号 ${supervisorEmpId}`);
            }
          } catch (error) {
            console.error('マネージャーデータの取得に失敗しました:', error);
          }
        }
        
        const employeeInfo = {
          id: employeeId,
          name: newHireData?.full_name_local || 
                `${newHireData?.last_name_local || employeeMasterData?.last_name_local || ''} ${newHireData?.first_name_local || employeeMasterData?.first_name_local || ''}`,
          email: newHireData?.email_addr || employeeMasterData?.email_addr || '',
          department: newHireData?.division_code || employeeMasterData?.division_code || '',
          position: newHireData?.position || employeeMasterData?.position || '',
          emp_no: newHireData?.emp_no || employeeMasterData?.emp_no || employeeId,
          join_date: formatTimestamp(newHireData?.join_date || employeeMasterData?.join_date),
          birth_date: formatTimestamp(employeeMasterData?.birth_date),
          gender: employeeMasterData?.gender || '',
          manager: managerInfo
        };
        
        // データをセット
        setEmployeeData(employeeInfo);
      } else {
        console.log('従業員データが見つかりません');
        setError('従業員データが見つかりません');
      }
      
      // ローディング状態を解除
      setLoading(false);
      
    } catch (error) {
      console.error('従業員データの取得に失敗しました:', error);
      setError(error.message || 'データ取得エラー');
      setLoading(false);
    }
  };
  
  // MBTIデータを取得する関数
  const fetchMbtiData = async () => {
    try {
      const response = await fetch('/data/mbti_j.json');
      if (!response.ok) {
        throw new Error(`MBTIデータの取得に失敗しました: ${response.status}`);
      }
      const data = await response.json();
      
      // MBTIデータをオブジェクト形式に変換して状態に保存
      const mbtiMap = {};
      data.forEach(item => {
        mbtiMap[item.mbti] = item.description;
      });
      
      setMbtiData(mbtiMap);
      console.log('MBTIデータを取得しました:', mbtiMap);
    } catch (error) {
      console.error('MBTIデータの取得中にエラーが発生しました:', error);
    }
  };
  
  // 初期データ読み込み
  useEffect(() => {
    if (id) {
      console.log('データ取得を開始します:', id);
      fetchEmployeeData(id);
      fetchMbtiData(); // MBTIデータを取得
    }
  }, [id]);
  
  // 最小限のレンダリング
  return (
    <div className="main-container">
          {/* ローディング表示 */}
          {loading && (
            <div className="admin-loading">
              <p>データを読み込み中...</p>
            </div>
          )}
          
          {/* エラー表示 */}
          {error && (
            <div className="admin-error-message">
              <p>エラーが発生しました: {error}</p>
              <button onClick={() => navigate('/admin/employees')}>
                ← 一覧に戻る
              </button>
            </div>
          )}
          
          {/* 従業員詳細表示 - 各コレクションからの情報を表示 */}
          {!loading && employeeData && !error && (
            <>
              {/* プロフィールヘッダー */}
              <div className="profile-header">
                <div className="profile-photo">
                  <img 
                    src={photoUrl} 
                    alt={`${employeeData.name}の写真`} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/default_emp_icon.png';
                    }}
                  />
                </div>
                <div className="profile-basic">
                  {employeeData.position && (
                    <div className="employee-position" style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>{employeeData.position}</div>
                  )}
                  <div className="employee-name">{employeeData.name || '名前なし'}</div>
                  {employeeMaster && employeeMaster.full_name_alphabet && (
                    <div className="employee-name-en">{employeeMaster.full_name_alphabet}</div>
                  )}
                  {/* 部署名を追加 */}
                  <div className="employee-department" style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                    {organization ? organization.division_name_local || organization.division_name : employeeData.department || '-'}
                  </div>
                  {/* マネージャー情報を追加 */}
                  {employeeData.manager && (
                    <div className="employee-manager" style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                      マネージャー: <Link 
                        to={`/admin/employees/${employeeData.manager.id}`} 
                        style={{ color: '#1976d2', textDecoration: 'none' }}
                        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                      >
                        {employeeData.manager.name}
                        {employeeData.manager.name_alphabet && ` (${employeeData.manager.name_alphabet})`}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* コンテンツグリッド */}
              <div className="content-grid">
                {/* 基本情報カード */}
                <div className="info-card">
                  <div className="card-header">基本情報</div>
                  <div className="card-content">
                    <div className="basic-info-grid">
                      <div className="basic-info-left">
                        <div className="info-row">
                          <div className="info-label">氏名（現地表記）</div>
                          <div className="info-value">{employeeData.name || '名前なし'}</div>
                        </div>
                        {employeeMaster && employeeMaster.full_name_alphabet && (
                          <div className="info-row">
                            <div className="info-label">氏名（アルファベット）</div>
                            <div className="info-value">{employeeMaster.full_name_alphabet}</div>
                          </div>
                        )}
                        <div className="info-row">
                          <div className="info-label">社員番号</div>
                          <div className="info-value">{employeeData.emp_no || '-'}</div>
                        </div>
                      </div>
                      <div className="basic-info-right">
                        <div className="info-row">
                          <div className="info-label">入社日</div>
                          <div className="info-value">
                            {employeeData.join_date ? new Date(employeeData.join_date).toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : '-'}
                          </div>
                        </div>
                        <div className="info-row">
                          <div className="info-label">メールアドレス</div>
                          <div className="info-value">{employeeData.email || '-'}</div>
                        </div>
                        <div className="info-row">
                          <div className="info-label">オフィス</div>
                          <div className="info-value">{employeeMaster && employeeMaster.office ? employeeMaster.office : '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 保有資格カード (もしデータがあれば) */}
                {employeeProfile && employeeProfile.qualifications && (
                  <div className="info-card">
                    <div className="card-header">保有資格</div>
                    <div className="card-content">
                      <div className="qualifications-grid">
                        {employeeProfile.qualifications.split(',').map((qual, index) => (
                          <span key={index} className="qualification-tag">{qual.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* プロフィールカード */}
                {employeeProfile && (
                  <div className="info-card">
                    <div className="card-header">プロフィール</div>
                    <div className="card-content">
                      {employeeProfile.mbti && (
                        <div className="info-row">
                          <div className="info-label">MBTI</div>
                          <div className="info-value">
                            <span className="mbti-display">
                              {employeeProfile.mbti}
                              <div className="mbti-tooltip">
                                {mbtiData[employeeProfile.mbti] 
                                  ? <>
                                      <strong>{employeeProfile.mbti}</strong><br />
                                      {mbtiData[employeeProfile.mbti]}
                                    </>
                                  : <>MBTIは性格タイプを示す指標です。<br />
                                    {employeeProfile.mbti_description || 'MBTIの詳細情報は登録されていません。'}
                                  </>}
                              </div>
                            </span>
                          </div>
                        </div>
                      )}
                      {employeeProfile.profile && (
                        <div className="info-row">
                          <div className="info-label">コメント</div>
                          <div className="info-value comment-text">
                            {employeeProfile.profile}
                          </div>
                        </div>
                      )}
                      {employeeProfile.skills && (
                        <div className="info-row">
                          <div className="info-label">スキル</div>
                          <div className="info-value">{employeeProfile.skills}</div>
                        </div>
                      )}
                      {employeeProfile.interests && (
                        <div className="info-row">
                          <div className="info-label">興味・関心</div>
                          <div className="info-value">{employeeProfile.interests}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 戻るボタン */}
                <button 
                  className="back-button" 
                  onClick={() => navigate('/admin/employees')}
                >
                  ← 一覧に戻る
                </button>
              </div>
            </>
          )}
          
          {/* デバッグ情報表示 - 開発時のみ表示 */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ 
              background: '#f0f0f0', 
              padding: '10px', 
              marginTop: '20px', 
              border: '1px solid #ccc'
            }}>
              <h3>デバッグ情報</h3>
              <p>Loading: {loading ? 'true' : 'false'}</p>
              <p>Error: {error ? error : 'None'}</p>
              <p>Employee Data: {employeeData ? 'Available' : 'Not Available'}</p>
              {employeeData && (
                <pre>{JSON.stringify(employeeData, null, 2)}</pre>
              )}
            </div>
          )}
    </div>
  );
};

export default EmployeeDetailNew;
