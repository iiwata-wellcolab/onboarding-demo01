import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStyles.css';

const EmployeesList = () => {
  const navigate = useNavigate();
  // 新入社員データ（実際のアプリではAPIから取得）
  const initialEmployees = [
    { 
      id: 1, 
      name: '山田 太郎', 
      email: 'yamada@example.com', 
      joiningDate: '2025/06/01',
      department: '営業部',
      progress: 75,
      status: 'in-progress'
    },
    { 
      id: 2, 
      name: '佐藤 花子', 
      email: 'sato@example.com', 
      joiningDate: '2025/06/01',
      department: '人事部',
      progress: 100,
      status: 'completed'
    },
    { 
      id: 3, 
      name: '鈴木 一郎', 
      email: 'suzuki@example.com', 
      joiningDate: '2025/06/15',
      department: '技術部',
      progress: 50,
      status: 'in-progress'
    },
    { 
      id: 4, 
      name: '田中 美咲', 
      email: 'tanaka@example.com', 
      joiningDate: '2025/07/01',
      department: '経理部',
      progress: 25,
      status: 'in-progress'
    },
    { 
      id: 5, 
      name: '高橋 健太', 
      email: 'takahashi@example.com', 
      joiningDate: '2025/07/01',
      department: '営業部',
      progress: 0,
      status: 'not-started'
    }
  ];

  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // 検索とフィルタリング
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
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
        <h3 className="admin-card-title">新入社員一覧</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>名前</th>
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
                <td>{employee.name}</td>
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
                    <button className="admin-action-button">詳細</button>
                    <button className="admin-action-button">編集</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesList;
