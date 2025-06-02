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
import NewHireSidebar from './NewHireSidebar';
import NewHireContent from './NewHireContent';

const NewHireDetail = () => {
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
  
  // タブ切り替え処理
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    navigate(`/admin/newhire/${id}/${newTab}`);
  };
  
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
        // 従業員IDを取得
        const emp_no = employeeMasterData?.emp_no || newHireData?.emp_no || employeeId;
        
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
          // ローカル環境ではローカルの画像ファイルを使用
          setPhotoUrl(`/images/${emp_no}.png`);
          console.log('ローカル環境の写真URLを設定:', `/images/${emp_no}.png`);
        } else {
          // Firebase Storageから画像を取得
          try {
            // バケットURLを取得
            const bucketUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/`;
            const photoPath = `employee-photos%2F${emp_no}.png`;
            const photoUrl = `${bucketUrl}${photoPath}?alt=media`;
            
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
      if (newHireData || employeeMasterData) {
        // Timestamp型のデータを文字列に変換する関数
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
        
        // マネージャー情報を取得
        let managerInfo = null;
        const supervisorEmpId = newHireData?.supervisor_emp_id || employeeMasterData?.supervisor_emp_id;
        
        if (supervisorEmpId) {
          try {
            // supervisor_emp_idが存在する場合、employeesコレクションからマネージャー情報を取得
            const managerRef = doc(db, 'employees', supervisorEmpId);
            const managerSnapshot = await getDoc(managerRef);
            
            if (managerSnapshot.exists()) {
              const managerData = managerSnapshot.data();
              managerInfo = {
                id: supervisorEmpId,
                name: managerData.full_name_local || `${managerData.last_name_local} ${managerData.first_name_local}`,
                name_alphabet: managerData.full_name_alphabet,
                position: managerData.position || ''
              };
              console.log('マネージャー情報を取得しました:', managerInfo);
            } else {
              console.log(`マネージャーデータが見つかりません: ${supervisorEmpId}`);
            }
          } catch (error) {
            console.error('マネージャーデータの取得に失敗しました:', error);
          }
        }
        
        const employeeInfo = {
          id: employeeId,
          name: newHireData?.full_name_local || 
                employeeMasterData?.full_name_local || 
                `${employeeMasterData?.last_name_local || ''} ${employeeMasterData?.first_name_local || ''}`,
          emp_no: newHireData?.emp_no || employeeMasterData?.emp_no || '',
          email: employeeMasterData?.email_addr || newHireData?.email || employeeMasterData?.email || '',
          department: orgData?.division_name_local || newHireData?.division_name || employeeMasterData?.division_name || '',
          position: newHireData?.position || employeeMasterData?.position || '',
          join_date: employeeMasterData?.join_date || newHireData?.join_date || '',
          manager: managerInfo
        };
        
        // データをセット
        setEmployeeData(employeeInfo);
      } else {
        console.log('従業員データが見つかりません');
        setError('従業員データが見つかりません');
        
        // デフォルトデータを設定
        setEmployeeData({
          name: '大原 孝之',
          emp_no: '1634',
          email: 'to1634@sonoeng.jp',
          department: '第二開発部',
          position: 'エンジニア'
        });
      }
      
      // ローディング状態を解除
      setLoading(false);
      
    } catch (error) {
      console.error('従業員データの取得に失敗しました:', error);
      setError(error.message || 'データ取得エラー');
      setLoading(false);
      
      // デフォルトデータを設定
      setEmployeeData({
        name: '大原 孝之',
        emp_no: '1634',
        email: 'to1634@sonoeng.jp',
        department: '第二開発部',
        position: 'エンジニア'
      });
    }
  };
  
  // コンポーネントのマウント時に従業員データを取得
  useEffect(() => {
    if (id) {
      console.log('データ取得を開始します:', id);
      fetchEmployeeData(id);
    }
  }, [id]);
  
  // URLパラメータのtabが変更されたときにアクティブタブを更新
  useEffect(() => {
    // URLから取得したtabパラメータを反映させる
    console.log('タブパラメータが変更されました:', tab);
    setActiveTab(tab);
  }, [tab]); // tabパラメータが変わるたびに実行
  
  // レイアウトスタイル
  const containerStyle = {
    display: 'flex',
    minHeight: 'calc(100vh - 120px)', // AdminLayoutのヘッダーの高さを考慮
    height: 'calc(100vh - 120px)', // 高さを固定値にする
    width: '100%',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden', // スクロールを防止
  };

  return (
    <div style={containerStyle}>
      {/* サイドバー */}
      <NewHireSidebar employeeId={id} activeTab={activeTab} />
      
      {/* メインコンテンツ */}
      <NewHireContent 
        activeTab={activeTab}
        employeeData={employeeData}
        employeeProfile={employeeProfile}
        employeeMaster={employeeMaster}
        organization={organization}
        photoUrl={photoUrl}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default NewHireDetail;
