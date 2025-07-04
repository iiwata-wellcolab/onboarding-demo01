import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminStyles.css';

// 新入社員詳細画面用のサイドバーコンポーネント
const NewHireSidebar = ({ employeeId, activeTab }) => {
  const navigate = useNavigate();
  
  // サイドバーのスタイル
  const sidebarStyle = {
    width: '180px', // 横幅を小さく調整
    minWidth: '180px', // 最小幅を固定
    flexShrink: 0, // 横幅が縮小しないように設定
    backgroundColor: 'white', // 背景を白に変更
    color: '#333', // 文字を黒に変更
    padding: '20px 0',
    height: '100%', // 親要素の高さいっぱいに伸ばす
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky', // スクロールしても固定されるように
    top: 0, // 上部に固定
    borderRight: '1px solid #eee', // 右側に薄い線を追加
  };
  
  // サイドバー項目のスタイル
  const itemStyle = {
    padding: '15px 20px',
    cursor: 'pointer',
    borderLeft: '4px solid transparent',
    fontSize: '16px',
    color: '#333', // 文字を黒に変更
  };
  
  // アクティブな項目のスタイル
  const activeItemStyle = {
    ...itemStyle,
    backgroundColor: '#f5f5f5', // 選択時は薄いグレー
    color: '#333',
    borderLeft: '4px solid #0a5275', // アクセント色を維持
    fontWeight: 'bold',
  };
  
  // 戻るボタンのスタイル
  const backButtonStyle = {
    ...itemStyle,
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    color: '#0a5275', // 戻るボタンはアクセント色に
  };
  
  // 各タブへのリンクを生成する関数
  const getTabLink = (tab) => `/admin/newhire/${employeeId}/${tab}`;
  
  return (
    <div style={sidebarStyle}>
      {/* 一覧へ戻るボタン */}
      <div 
        style={backButtonStyle}
        onClick={() => navigate('/admin/employees')}
      >
        ← 一覧へ戻る
      </div>
      
      {/* 情報タブ */}
      <Link 
        to={getTabLink('info')} 
        style={{ textDecoration: 'none' }}
      >
        <div style={activeTab === 'info' ? activeItemStyle : itemStyle}>
          情報
        </div>
      </Link>
      
      {/* オンボーディングタブ */}
      <Link 
        to={getTabLink('onboarding')} 
        style={{ textDecoration: 'none' }}
      >
        <div style={activeTab === 'onboarding' ? activeItemStyle : itemStyle}>
          オンボーディング
        </div>
      </Link>
      
      {/* サーベイタブ */}
      <Link 
        to={getTabLink('survey')} 
        style={{ textDecoration: 'none' }}
      >
        <div style={activeTab === 'survey' ? activeItemStyle : itemStyle}>
          サーベイ
        </div>
      </Link>
      
      {/* 1on1タブ */}
      <Link 
        to={getTabLink('1on1')} 
        style={{ textDecoration: 'none' }}
      >
        <div style={activeTab === '1on1' ? activeItemStyle : itemStyle}>
          1on1
        </div>
      </Link>
    </div>
  );
};

export default NewHireSidebar;
