import React from 'react';

const OneOnOneCard = ({ meeting }) => {
  return (
    <div className="oneOnOne-card">
      <div className="oneOnOne-card-header">
        <div className="oneOnOne-date-time">
          <div className="oneOnOne-date">{meeting.date}</div>
          <div className="oneOnOne-time">{meeting.time}</div>
        </div>
        <div className={`oneOnOne-status ${meeting.status === 'upcoming' ? 'upcoming' : 'completed'}`}>
          {meeting.status === 'upcoming' ? '予定' : '完了'}
        </div>
      </div>
      <div className="oneOnOne-card-body">
        <div className="oneOnOne-location">
          <i className="fas fa-map-marker-alt"></i> {meeting.location}
        </div>
        <div className="oneOnOne-participants">
          <h4>参加者:</h4>
          <div className="participant-cards">
            {meeting.participants.map((participant, index) => (
              <div key={index} className="participant-card">
                <div className="participant-avatar">
                  <img 
                    src={participant.photo.startsWith('/onboarding-demo01') ? participant.photo : `/onboarding-demo01${participant.photo}`} 
                    alt={participant.name} 
                  />
                </div>
                <div className="participant-info">
                  <div className="participant-name">{participant.name}</div>
                  <div className="participant-position">{participant.position}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="oneOnOne-agenda">
          <h4>アジェンダ:</h4>
          <ul>
            {meeting.agenda.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        {meeting.notes && (
          <div className="oneOnOne-notes">
            <h4>議事録:</h4>
            <p>{meeting.notes}</p>
          </div>
        )}
        {meeting.action_items && meeting.action_items.length > 0 && (
          <div className="oneOnOne-action-items">
            <h4>アクションアイテム:</h4>
            <ul>
              {meeting.action_items.map((item, index) => (
                <li key={index} className={`action-item ${item.status === 'completed' ? 'completed' : ''}`}>
                  <div className="action-item-task">{item.task}</div>
                  <div className="action-item-meta">
                    <span className="action-item-assignee">{item.assignee}</span>
                    <span className="action-item-due">{item.due_date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="oneOnOne-card-footer">
        {meeting.status === 'upcoming' ? (
          <>
            <button className="btn-edit">編集</button>
            <button className="btn-cancel">キャンセル</button>
          </>
        ) : (
          <button className="btn-view-details">詳細を見る</button>
        )}
      </div>
    </div>
  );
};

export default OneOnOneCard;
