import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStyles.css';

const EmployeesList = () => {
  const navigate = useNavigate();
  // 新入社員データ（実際のアプリではAPIから取得）
  const initialEmployees = [
    { 
      id: 1632, 
      name: '渡辺 悠希', 
      email: 'y.watanabe@example.com', 
      joiningDate: '2025/02/01',
      department: 'エンジニアリング部',
      progress: 75,
      status: 'in-progress'
    },
    { 
      id: 1633, 
      name: '中村 太陽', 
      email: 't.nakamura@example.com', 
      joiningDate: '2025/03/01',
      department: 'エンジニアリング部',
      progress: 100,
      status: 'completed'
    },
    { 
      id: 1634, 
      name: '大原 孝之', 
      email: 't.ohara@example.com', 
      joiningDate: '2025/04/01',
      department: 'エンジニアリング部',
      progress: 50,
      status: 'in-progress'
    },
    { 
      id: 1635, 
      name: '藤田 健太', 
      email: 'k.fujita@example.com', 
      joiningDate: '2025/04/01',
      department: 'プロジェクト推進部',
      progress: 25,
      status: 'in-progress'
    },
    { 
      id: 1636, 
      name: '尾形 香織', 
      email: 'k.ogata@example.com', 
      joiningDate: '2025/04/01',
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
                <td>
                  <div className="employee-list-item">
                    <div className="employee-list-photo">
                      <img src={`${process.env.PUBLIC_URL}/images/${employee.id}.png`} alt={employee.name} />
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
                      onClick={() => navigate(`/admin/employees/${employee.id}`)}
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
      </div>
    </div>
  );
};

export default EmployeesList;
