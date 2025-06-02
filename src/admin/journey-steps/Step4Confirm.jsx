import React from 'react';

const Step4Confirm = ({ journeyData, onSave, onBack }) => {
  // ステータスに応じたラベルとクラスを取得
  const getStatusInfo = (status) => {
    switch(status) {
      case 'active':
        return { label: '有効', className: 'status-active' };
      case 'inactive':
        return { label: '無効', className: 'status-inactive' };
      case 'draft':
      default:
        return { label: '下書き', className: 'status-draft' };
    }
  };

  // リソースタイプに応じたラベルを取得
  const getResourceTypeLabel = (type) => {
    switch(type) {
      case 'video':
        return '動画';
      case 'link':
        return 'リンク';
      case 'image':
        return '画像';
      case 'document':
      default:
        return '文書';
    }
  };

  // タスクステータスに応じたラベルを取得
  const getTaskStatusLabel = (status) => {
    switch(status) {
      case 'completed':
        return '完了';
      case 'in-progress':
        return '進行中';
      case 'pending':
      default:
        return '未開始';
    }
  };

  const statusInfo = getStatusInfo(journeyData.status);

  return (
    <div className="step-content">
      <h3>確認</h3>
      <p className="step-description">以下の内容でオンボーディングジャーニーを作成します。内容を確認してください。</p>
      
      <div className="confirm-section">
        <h3>基本情報</h3>
        <div className="confirm-item">
          <div className="confirm-label">タイトル</div>
          <div className="confirm-value">{journeyData.title}</div>
        </div>
        <div className="confirm-item">
          <div className="confirm-label">説明</div>
          <div className="confirm-value">{journeyData.description}</div>
        </div>
        <div className="confirm-item">
          <div className="confirm-label">対象部門</div>
          <div className="confirm-value">{journeyData.department}</div>
        </div>
        <div className="confirm-item">
          <div className="confirm-label">期間</div>
          <div className="confirm-value">{journeyData.duration}</div>
        </div>
        <div className="confirm-item">
          <div className="confirm-label">ステータス</div>
          <div className={`confirm-value ${statusInfo.className}`}>
            {statusInfo.label}
          </div>
        </div>
      </div>
      
      <div className="confirm-section">
        <h3>タスク</h3>
        {journeyData.tasks && journeyData.tasks.length > 0 ? (
          <div className="confirm-tasks">
            {journeyData.tasks.map((task, index) => (
              <div key={task.id || index} className="confirm-task-item">
                <div className="confirm-task-name">
                  {index + 1}. {task.name}
                </div>
                {task.description && (
                  <div className="confirm-task-description">
                    {task.description}
                  </div>
                )}
                <div className="confirm-task-details">
                  <span className="confirm-task-due-date">期日: {task.dueDate}</span>
                  <span className="confirm-task-status">
                    ステータス: {getTaskStatusLabel(task.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="confirm-no-items">タスクが追加されていません</div>
        )}
      </div>
      
      <div className="confirm-section">
        <h3>リソース</h3>
        {journeyData.resources && journeyData.resources.length > 0 ? (
          <div className="confirm-resources">
            {journeyData.resources.map((resource, index) => (
              <div key={resource.id || index} className="confirm-resource-item">
                <div className="confirm-resource-name">
                  {index + 1}. {resource.title} ({getResourceTypeLabel(resource.type)})
                </div>
                {resource.description && (
                  <div className="confirm-resource-description">
                    {resource.description}
                  </div>
                )}
                <div className="confirm-resource-url">
                  URL: {resource.url}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="confirm-no-items">リソースが追加されていません</div>
        )}
      </div>
      
      <div className="button-group">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          戻る
        </button>
        <button type="button" className="btn btn-primary" onClick={onSave}>
          作成する
        </button>
      </div>
    </div>
  );
};

export default Step4Confirm;
