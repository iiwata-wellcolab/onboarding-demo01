import React, { useState } from 'react';
import './AdminStyles.css';
import './employee-styles.css';

// 新入社員詳細画面の1on1タブコンテンツコンポーネント
const NewHireOneOnOneContent = ({ employeeData }) => {
  // 1on1ミーティングデータ（実際のアプリケーションではAPIから取得）
  const oneOnOneMeetings = [
    {
      id: 1,
      date: '2025年6月15日',
      time: '14:00 - 15:00',
      status: 'upcoming',
      location: 'オンライン（Zoom）',
      participants: [
        { id: 1632, name: '渡辺 悠希', position: 'スタッフ', photo: '/images/default_emp_icon.png' },
        { id: 1056, name: '吉村 和夫', position: 'セクションマネージャー', photo: '/images/default_emp_icon.png' }
      ],
      agenda: [
        '前回からの進捗確認',
        '現在の課題や困っていること',
        '今後の目標設定',
        'キャリアプランの相談'
      ],
      notes: ''
    },
    {
      id: 2,
      date: '2025年5月30日',
      time: '10:00 - 11:00',
      status: 'completed',
      location: '会議室A',
      participants: [
        { id: 1632, name: '渡辺 悠希', position: 'スタッフ', photo: '/images/default_emp_icon.png' },
        { id: 1404, name: '森 隼人', position: 'メンター', photo: '/images/default_emp_icon.png' }
      ],
      agenda: [
        '入社後の適応状況確認',
        '現在の業務内容の確認',
        'チーム内でのコミュニケーション'
      ],
      notes: '渡辺さんは技術的な面では順調に成長しているが、チーム内でのコミュニケーションに不安を感じている様子。特に質問や相談をする際に踹躇している。メンターの森さんからは、同じ部署の先輩として気軽に相談できるようサポートしていくことを提案。次回までに小さなペアプログラミングの機会を設けることにした。',
      action_items: [
        { task: 'ペアプログラミングセッションの実施', assignee: '森 隼人', due_date: '2025年6月5日' },
        { task: 'チーム内勉強会への参加', assignee: '渡辺 悠希', due_date: '2025年6月10日' }
      ]
    },
    {
      id: 3,
      date: '2025年5月15日',
      time: '13:00 - 14:00',
      status: 'completed',
      location: 'オンライン（Zoom）',
      participants: [
        { id: 1632, name: '渡辺 悠希', position: 'スタッフ', photo: '/images/default_emp_icon.png' },
        { id: 1056, name: '吉村 和夫', position: 'セクションマネージャー', photo: '/images/default_emp_icon.png' }
      ],
      agenda: [
        '入社後の初回1on1',
        '業務環境の確認',
        '初期目標の設定'
      ],
      notes: '入社後2週間が経過し、基本的な業務環境には慣れてきた様子。技術的なスキルは高いが、まだ社内の業務フローに不慣れな部分がある。今後は吉村マネージャーとの定期的な1on1を通じて、業務の進め方や疑問点を解消していくことを確認した。',
      action_items: [
        { task: '社内システムのアクセス権限確認', assignee: '吉村 和夫', due_date: '2025年5月20日', status: 'completed' },
        { task: '開発環境のセットアップ完了', assignee: '渡辺 悠希', due_date: '2025年5月18日', status: 'completed' }
      ]
    }
  ];

  // スタイル定義
  const contentContainerStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    margin: '20px 0',
    height: 'calc(100vh - 180px)',
    overflowY: 'auto'
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  };

  // ミーティングカードのスタイル
  const meetingCardStyle = {
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    padding: '15px',
    marginBottom: '20px',
    border: '1px solid #e0e0e0'
  };

  const upcomingMeetingStyle = {
    ...meetingCardStyle,
    borderLeft: '4px solid #2196f3'
  };

  const completedMeetingStyle = {
    ...meetingCardStyle,
    borderLeft: '4px solid #4caf50'
  };

  const meetingHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '10px'
  };

  const participantStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px'
  };

  const participantImageStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    marginRight: '10px',
    objectFit: 'cover'
  };

  const agendaItemStyle = {
    marginBottom: '5px',
    paddingLeft: '15px',
    position: 'relative'
  };

  const bulletPointStyle = {
    position: 'absolute',
    left: '0',
    top: '8px',
    width: '6px',
    height: '6px',
    backgroundColor: '#666',
    borderRadius: '50%'
  };

  const actionItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    marginBottom: '5px'
  };

  const completedActionItemStyle = {
    ...actionItemStyle,
    backgroundColor: '#e8f5e9',
    textDecoration: 'line-through'
  };

  // ステータスラベルのスタイル
  const getStatusStyle = (status) => {
    if (status === 'upcoming') {
      return {
        backgroundColor: '#e3f2fd',
        color: '#0d47a1',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold'
      };
    } else if (status === 'completed') {
      return {
        backgroundColor: '#e8f5e9',
        color: '#1b5e20',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold'
      };
    }
  };

  return (
    <div className="content-container" style={contentContainerStyle}>
      <h2 style={headingStyle}>1on1履歴</h2>
      
      {/* 予定されたミーティング */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>予定された1on1</h3>
        {oneOnOneMeetings.filter(meeting => meeting.status === 'upcoming').map(meeting => (
          <div key={meeting.id} style={upcomingMeetingStyle}>
            <div style={meetingHeaderStyle}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
                  {meeting.date} {meeting.time}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  場所: {meeting.location}
                </div>
              </div>
              <div style={getStatusStyle(meeting.status)}>予定</div>
            </div>
            
            {/* 参加者 */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>参加者:</div>
              {meeting.participants.map((participant, index) => (
                <div key={index} style={participantStyle}>
                  <img 
                    src={participant.photo} 
                    alt={participant.name} 
                    style={participantImageStyle} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/default_emp_icon.png';
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{participant.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{participant.position}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* アジェンダ */}
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>アジェンダ:</div>
              {meeting.agenda.map((item, index) => (
                <div key={index} style={agendaItemStyle}>
                  <div style={bulletPointStyle}></div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* 完了したミーティング */}
      <div>
        <h3 style={{ marginBottom: '15px' }}>過去の1on1</h3>
        {oneOnOneMeetings.filter(meeting => meeting.status === 'completed').map(meeting => (
          <div key={meeting.id} style={completedMeetingStyle}>
            <div style={meetingHeaderStyle}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
                  {meeting.date} {meeting.time}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  場所: {meeting.location}
                </div>
              </div>
              <div style={getStatusStyle(meeting.status)}>完了</div>
            </div>
            
            {/* 参加者 */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>参加者:</div>
              {meeting.participants.map((participant, index) => (
                <div key={index} style={participantStyle}>
                  <img 
                    src={participant.photo} 
                    alt={participant.name} 
                    style={participantImageStyle} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/default_emp_icon.png';
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{participant.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{participant.position}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* アジェンダ */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>アジェンダ:</div>
              {meeting.agenda.map((item, index) => (
                <div key={index} style={agendaItemStyle}>
                  <div style={bulletPointStyle}></div>
                  {item}
                </div>
              ))}
            </div>
            
            {/* メモ */}
            {meeting.notes && (
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>メモ:</div>
                <div style={{ 
                  backgroundColor: '#ffffff', 
                  padding: '10px', 
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {meeting.notes}
                </div>
              </div>
            )}
            
            {/* アクションアイテム */}
            {meeting.action_items && meeting.action_items.length > 0 && (
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>アクションアイテム:</div>
                {meeting.action_items.map((item, index) => (
                  <div key={index} style={item.status === 'completed' ? completedActionItemStyle : actionItemStyle}>
                    <div>
                      <div>{item.task}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>担当: {item.assignee}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>期限: {item.due_date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewHireOneOnOneContent;
