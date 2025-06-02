import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AdminStyles.css';
import './employee-styles.css';
import './employee-profile-styles.css';

// Firebase関連のインポート
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { firestoreDB as db, firebaseStorage as storage } from '../firebase/config';

// サブコンポーネントのインポート
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeInfoContent from './EmployeeInfoContent';

const EmployeeDetail = () => {
  // URLパラメータから従業員IDとアクティブタブを取得
  const { id, tab = 'info' } = useParams();
  const navigate = useNavigate();
  
  // 状態管理
  const [activeTab, setActiveTab] = useState(tab);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('/images/default_emp_icon.png');
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [employeeMaster, setEmployeeMaster] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [managerData, setManagerData] = useState(null);
  
  // タブ切り替え処理
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    navigate(`/admin/employee-detail/${id}/${newTab}`);
  };
  
  // 従業員データを取得する関数
  const fetchEmployeeData = async (employeeId) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('従業員データ取得開始:', employeeId);
      
      // 1. 従業員マスターデータを取得
      const employeeRef = doc(db, 'employees', employeeId);
      const employeeSnapshot = await getDoc(employeeRef);
      
      if (employeeSnapshot.exists()) {
        const employeeMasterData = employeeSnapshot.data();
        setEmployeeMaster(employeeMasterData);
        console.log('従業員マスターデータ:', employeeMasterData);
        
        // 2. 組織情報を取得
        let orgData = null;
        if (employeeMasterData.division_code) {
          try {
            const orgRef = doc(db, 'organizations', employeeMasterData.division_code);
            const orgSnapshot = await getDoc(orgRef);
            if (orgSnapshot.exists()) {
              orgData = orgSnapshot.data();
              setOrganization(orgData);
              console.log('組織情報:', orgData);
            }
          } catch (orgError) {
            console.error('組織情報取得エラー:', orgError);
            // 組織情報の取得に失敗しても処理を続行
          }
        }
        
        // 3. プロフィール情報を取得
        let profileData = null;
        try {
          const profileRef = doc(db, 'employee_profiles', employeeId);
          const profileSnapshot = await getDoc(profileRef);
          if (profileSnapshot.exists()) {
            profileData = profileSnapshot.data();
            setEmployeeProfile(profileData);
            console.log('プロフィール情報:', profileData);
          }
        } catch (profileError) {
          console.error('プロフィール情報取得エラー:', profileError);
          // プロフィール情報の取得に失敗しても処理を続行
        }
        
        // 4. マネージャー情報を取得
        let managerInfo = null;
        const supervisorEmpId = employeeMasterData?.supervisor_emp_id;
        console.log('マネージャーコード(supervisor_emp_id):', supervisorEmpId);
        
        if (supervisorEmpId) {
          try {
            // supervisor_emp_idが存在する場合、employeesコレクションからマネージャー情報を取得
            const managerRef = doc(db, 'employees', supervisorEmpId);
            const managerSnapshot = await getDoc(managerRef);
            
            if (managerSnapshot.exists()) {
              const managerData = managerSnapshot.data();
              managerInfo = {
                id: supervisorEmpId,
                name: managerData.full_name_local || `${managerData.last_name_local || ''} ${managerData.first_name_local || ''}`,
                name_alphabet: managerData.full_name_alphabet,
                position: managerData.position || '',
                emp_no: managerData.emp_no || supervisorEmpId
              };
              console.log('マネージャー情報を取得しました:', managerInfo);
              setManagerData(managerData);
            } else {
              console.log(`マネージャーデータが見つかりません: ${supervisorEmpId}`);
              // マネージャー情報が見つからない場合はデフォルト情報を設定
              managerInfo = {
                id: '1001',
                name: '浜辺 淳二',
                name_alphabet: 'Junji Hamabe',
                position: '部長',
                emp_no: '1001'
              };
            }
          } catch (error) {
            console.error('マネージャーデータの取得に失敗しました:', error);
            // エラーが発生した場合はデフォルト情報を設定
            managerInfo = {
              id: '1001',
              name: '浜辺 淳二',
              name_alphabet: 'Junji Hamabe',
              position: '部長',
              emp_no: '1001'
            };
          }
        } else {
          console.log('マネージャーコードが見つからないため、デフォルト情報を設定します');
          // マネージャーコードがない場合はデフォルト情報を設定
          managerInfo = {
            id: '1001',
            name: '浜辺 淳二',
            name_alphabet: 'Junji Hamabe',
            position: '部長',
            emp_no: '1001'
          };
        }

        // 5. 従業員の顔写真を取得
        try {
          // 従業員IDを取得
          const emp_no = employeeMasterData?.emp_no || employeeId;
          
          if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
            // ローカル環境ではローカルの画像ファイルを使用
            try {
              const photoUrl = `/images/employee-photos/${emp_no}.png`;
              console.log('写真URLを設定:', photoUrl);
              setPhotoUrl(photoUrl);
            } catch (photoError) {
              console.log('写真が見つかりません。デフォルト画像を使用します:', photoError);
              setPhotoUrl('/images/default_emp_icon.png');
            }
          } else {
            // 本番環境ではFirebase Storageから取得
            try {
              const photoRef = ref(storage, `employee-photos/${emp_no}.png`);
              const photoUrl = await getDownloadURL(photoRef);
              console.log('写真URLを設定:', photoUrl);
              setPhotoUrl(photoUrl);
            } catch (photoError) {
              console.log('写真が見つかりません。デフォルト画像を使用します:', photoError);
              setPhotoUrl('/images/default_emp_icon.png');
            }
          }
        } catch (photoError) {
          console.log('写真取得中にエラーが発生しました:', photoError);
          setPhotoUrl('/images/default_emp_icon.png');
        }
        
        // 従業員データを構築
        const formatTimestamp = (timestamp) => {
          if (!timestamp) return '';
          
          // FirestoreのTimestamp型の場合
          if (timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
          
          // 通常の日付型の場合
          return new Date(timestamp).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        };
        
        // 従業員データを構築
        const combinedData = {
          id: employeeId,
          emp_no: employeeMasterData.emp_no || employeeId,
          name: employeeMasterData.full_name_local || 'Unknown',
          name_en: employeeMasterData.full_name_alphabet || '',
          email: employeeMasterData.email_addr || '',
          department: orgData?.division_name_local || employeeMasterData.division_code || '',
          position: employeeMasterData.position || employeeMasterData.position_name_local || '',
          join_date: formatTimestamp(employeeMasterData.join_date) || '',
          status: employeeMasterData.status || '',
          phone: employeeMasterData.phone_no || '',
          office: employeeMasterData.office || 'JP-NGY',
          profile: profileData || {},
          manager: managerInfo
        };
        
        setEmployeeData(combinedData);
        console.log('従業員データ構築完了:', combinedData);
      } else {
        setError('従業員データが見つかりませんでした');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('従業員データ取得エラー:', err);
      setError(`データ取得中にエラーが発生しました: ${err.message}`);
      setLoading(false);
    }
  };
  
  // コンポーネントマウント時に従業員データを取得
  useEffect(() => {
    if (id) {
      fetchEmployeeData(id);
    }
  }, [id]);
  
  // アクティブタブが変更されたときにURLを更新
  useEffect(() => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [tab]);
  
  // レイアウトスタイル
  const containerStyle = {
    display: 'flex',
    minHeight: 'calc(100vh - 60px)', // AdminLayoutのヘッダーの高さを考慮
    height: 'calc(100vh - 60px)', // 高さを固定値にする
    width: '100%',
    backgroundColor: '#f5f5f5',
  };

  return (
    <div style={containerStyle}>
      {/* サイドバー */}
      <EmployeeSidebar 
        employeeId={id} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      {/* コンテンツエリア */}
      <div className="admin-detail-content" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <EmployeeInfoContent 
          employeeData={employeeData}
          employeeProfile={employeeProfile}
          employeeMaster={employeeMaster}
          organization={organization}
          photoUrl={photoUrl}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default EmployeeDetail;
