import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import './AdminStyles.css';
import './employee-styles.css';
import './employee-profile-styles.css';
import './employee-detail-styles.css';
import './modal-styles.css';

// 社員情報モーダルコンポーネント
const EmployeeModal = ({ isOpen, onClose, employeeId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchEmployeeData(employeeId);
    }
  }, [isOpen, employeeId]);

  // 社員データを取得する関数
  const fetchEmployeeData = async (empId) => {
    setLoading(true);
    setError(null);
    
    try {
      const db = getFirestore();
      const storage = getStorage();
      
      // 社員データを取得
      const employeeRef = doc(db, 'employees', empId);
      const employeeSnap = await getDoc(employeeRef);
      
      if (!employeeSnap.exists()) {
        throw new Error(`社員データが見つかりません: ${empId}`);
      }
      
      const data = employeeSnap.data();
      setEmployeeData(data);
      
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
      console.error('社員データの取得に失敗しました:', err);
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
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>×</button>
        
        {loading ? (
          <div className="modal-loading">読み込み中...</div>
        ) : error ? (
          <div className="modal-error">{error}</div>
        ) : employeeData ? (
          <div className="employee-modal-detail">
            <div className="employee-modal-header">
              <div className="employee-modal-photo">
                <img 
                  src={photoUrl || '/images/default_emp_icon.png'} 
                  alt={employeeData.full_name_local} 
                  onError={(e) => { e.target.src = '/images/default_emp_icon.png'; }}
                />
              </div>
              <div className="employee-modal-info">
                <h2>{employeeData.full_name_local || `${employeeData.last_name_local} ${employeeData.first_name_local}`}</h2>
                {employeeData.full_name_alphabet && <div className="employee-modal-name-en">{employeeData.full_name_alphabet}</div>}
                <div className="employee-modal-position">{employeeData.position || '社員'}</div>
                <div className="employee-modal-department">
                  {organization ? organization.division_name_local : employeeData.division_code}
                </div>
              </div>
            </div>
            
            <div className="employee-modal-body">
              <div className="info-section">
                <h3>基本情報</h3>
                <div className="info-grid">
                  <div className="info-row">
                    <div className="info-label">社員番号</div>
                    <div className="info-value">{employeeData.emp_no || '-'}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">メール</div>
                    <div className="info-value">{employeeData.email || '-'}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">オフィス</div>
                    <div className="info-value">{employeeData.office || '-'}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">雇用形態</div>
                    <div className="info-value">{employeeData.employment_type || '-'}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">入社日</div>
                    <div className="info-value">{employeeData.join_date || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="modal-error">社員データが見つかりません</div>
        )}
      </div>
    </div>
  );
};

export default EmployeeModal;
