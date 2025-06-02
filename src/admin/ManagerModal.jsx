import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import './modal-styles.css';
import './employee-styles.css';
import './manager-modal-styles.css';

// 上司情報モーダルコンポーネント
const ManagerModal = ({ isOpen, onClose, managerId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('/images/default_emp_icon.png');
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    if (isOpen && managerId) {
      fetchManagerData(managerId);
    }
  }, [isOpen, managerId]);

  // 上司データを取得する関数
  const fetchManagerData = async (empId) => {
    setLoading(true);
    setError(null);
    
    try {
      const db = getFirestore();
      const storage = getStorage();
      
      // 社員データを取得
      const employeeRef = doc(db, 'employees', empId);
      const employeeSnap = await getDoc(employeeRef);
      
      if (!employeeSnap.exists()) {
        throw new Error(`上司データが見つかりません: ${empId}`);
      }
      
      const data = employeeSnap.data();
      setManagerData(data);
      
      // 組織データを取得
      if (data.division_code) {
        const orgRef = doc(db, 'organizations', data.division_code);
        const orgSnap = await getDoc(orgRef);
        if (orgSnap.exists()) {
          setOrganization(orgSnap.data());
        }
      }
      
      // 写真URLを取得
      try {
        const photoRef = ref(storage, `employee-photos/${empId}.png`);
        const url = await getDownloadURL(photoRef);
        setPhotoUrl(url);
      } catch (photoError) {
        console.log('写真の取得に失敗しました:', photoError);
        setPhotoUrl('/images/default_emp_icon.png');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('上司データの取得に失敗しました:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // モーダル外をクリックした時に閉じる
  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>上司情報</h2>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        
        {loading ? (
          <div className="modal-body">
            <div className="modal-loading">読み込み中...</div>
          </div>
        ) : error ? (
          <div className="modal-body">
            <div className="modal-error">{error}</div>
          </div>
        ) : managerData ? (
          <>
            <div className="modal-body">
              <div className="manager-profile">
                <div className="manager-photo">
                  <img 
                    src={photoUrl} 
                    alt={managerData.full_name_local || `${managerData.last_name_local} ${managerData.first_name_local}`} 
                    onError={(e) => { e.target.src = '/images/default_emp_icon.png'; }}
                  />
                </div>
                <div className="manager-info">
                  <h3>{managerData.full_name_local || `${managerData.last_name_local} ${managerData.first_name_local}`}</h3>
                  {managerData.full_name_alphabet && <div className="manager-name-en">{managerData.full_name_alphabet}</div>}
                  <div className="manager-position">{managerData.position || '社員'}</div>
                  <div className="manager-department">
                    {organization ? organization.division_name_local : managerData.division_code}
                  </div>
                </div>
              </div>
              
              <div className="manager-details">
                <div className="info-section">
                  <h4>基本情報</h4>
                  <div className="info-grid">
                    <div className="info-row">
                      <div className="info-label">社員番号</div>
                      <div className="info-value">{managerData.emp_no || '-'}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">メール</div>
                      <div className="info-value">{managerData.email_addr || '-'}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">オフィス</div>
                      <div className="info-value">{managerData.office || '-'}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">雇用形態</div>
                      <div className="info-value">{managerData.employment_type || '-'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="modal-button" onClick={onClose}>閉じる</button>
            </div>
          </>
        ) : (
          <div className="modal-body">
            <div className="modal-error">上司データが見つかりません</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerModal;
