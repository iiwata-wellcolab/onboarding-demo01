import React, { useState } from 'react';

const Step3Resources = ({ journeyData, updateJourneyData, onNext, onBack }) => {
  const [resources, setResources] = useState(journeyData.resources || []);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [resourceFormData, setResourceFormData] = useState({
    title: '',
    type: 'document',
    url: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  // リソースの追加または編集
  const handleAddEditResource = () => {
    if (!validateResourceForm()) return;

    if (currentResource !== null) {
      // 既存リソースの編集
      const updatedResources = [...resources];
      updatedResources[currentResource] = {
        ...updatedResources[currentResource],
        ...resourceFormData
      };
      setResources(updatedResources);
    } else {
      // 新規リソースの追加
      setResources([
        ...resources,
        {
          id: Date.now(), // 一時的なID
          ...resourceFormData
        }
      ]);
    }

    // モーダルを閉じてフォームをリセット
    setShowResourceModal(false);
    resetResourceForm();
  };

  // リソースの削除
  const handleDeleteResource = (index) => {
    const updatedResources = [...resources];
    updatedResources.splice(index, 1);
    setResources(updatedResources);
  };

  // リソースの編集モーダルを開く
  const handleEditResource = (index) => {
    const resource = resources[index];
    setCurrentResource(index);
    setResourceFormData({
      title: resource.title || '',
      type: resource.type || 'document',
      url: resource.url || '',
      description: resource.description || ''
    });
    setShowResourceModal(true);
  };

  // 新規リソース追加モーダルを開く
  const handleOpenAddResourceModal = () => {
    setCurrentResource(null);
    resetResourceForm();
    setShowResourceModal(true);
  };

  // リソースフォームのリセット
  const resetResourceForm = () => {
    setResourceFormData({
      title: '',
      type: 'document',
      url: '',
      description: ''
    });
    setErrors({});
  };

  // リソースフォームの入力変更を処理
  const handleResourceFormChange = (e) => {
    const { name, value } = e.target;
    setResourceFormData({
      ...resourceFormData,
      [name]: value
    });
  };

  // リソースフォームのバリデーション
  const validateResourceForm = () => {
    const newErrors = {};
    if (!resourceFormData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }
    if (!resourceFormData.url.trim()) {
      newErrors.url = 'URLまたはファイルパスは必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 次のステップへ進む
  const handleNext = () => {
    updateJourneyData({ resources });
    onNext();
  };

  // リソースタイプに応じたアイコンとラベルを取得
  const getResourceTypeInfo = (type) => {
    switch(type) {
      case 'video':
        return { icon: 'fas fa-video', label: '動画' };
      case 'link':
        return { icon: 'fas fa-link', label: 'リンク' };
      case 'image':
        return { icon: 'fas fa-image', label: '画像' };
      case 'document':
      default:
        return { icon: 'fas fa-file-alt', label: '文書' };
    }
  };

  return (
    <div className="step-content">
      <h3>リソース設定</h3>
      <p className="step-description">オンボーディングジャーニーに含めるリソースを追加してください。文書、動画、リンクなどを追加できます。</p>
      
      <div className="resource-list">
        {resources.length === 0 ? (
          <div className="no-resources">
            <p>リソースがまだ追加されていません。「リソースを追加」ボタンをクリックして、最初のリソースを追加してください。</p>
          </div>
        ) : (
          resources.map((resource, index) => {
            const typeInfo = getResourceTypeInfo(resource.type);
            return (
              <div key={resource.id || index} className="resource-item">
                <div className="resource-icon">
                  <i className={typeInfo.icon}></i>
                </div>
                <div className="resource-content">
                  <div className="resource-title">{resource.title}</div>
                  {resource.description && <div className="resource-description">{resource.description}</div>}
                  <div className="resource-type">{typeInfo.label}</div>
                </div>
                <div className="resource-actions">
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => handleEditResource(index)}
                  >
                    編集
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => handleDeleteResource(index)}
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })
        )}
        
        <button 
          className="add-resource-btn" 
          onClick={handleOpenAddResourceModal}
        >
          <i className="fas fa-plus"></i> リソースを追加
        </button>
      </div>
      
      <div className="button-group">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          戻る
        </button>
        <button type="button" className="btn btn-primary" onClick={handleNext}>
          次へ
        </button>
      </div>
      
      {/* リソース追加/編集モーダル */}
      {showResourceModal && (
        <div className="resource-detail-modal">
          <div className="resource-detail-header">
            <h3>{currentResource !== null ? 'リソースを編集' : 'リソースを追加'}</h3>
            <button 
              className="resource-detail-close" 
              onClick={() => setShowResourceModal(false)}
            >
              ×
            </button>
          </div>
          
          <div className="form-group">
            <label htmlFor="resourceTitle">タイトル <span className="required">*</span></label>
            <input
              type="text"
              id="resourceTitle"
              name="title"
              value={resourceFormData.title}
              onChange={handleResourceFormChange}
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              placeholder="例: 就業規則"
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="resourceType">タイプ</label>
            <select
              id="resourceType"
              name="type"
              value={resourceFormData.type}
              onChange={handleResourceFormChange}
              className="form-control"
            >
              <option value="document">文書</option>
              <option value="video">動画</option>
              <option value="link">リンク</option>
              <option value="image">画像</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="resourceUrl">URLまたはファイルパス <span className="required">*</span></label>
            <input
              type="text"
              id="resourceUrl"
              name="url"
              value={resourceFormData.url}
              onChange={handleResourceFormChange}
              className={`form-control ${errors.url ? 'is-invalid' : ''}`}
              placeholder="例: https://example.com/document.pdf"
            />
            {errors.url && <div className="error-message">{errors.url}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="resourceDescription">説明</label>
            <textarea
              id="resourceDescription"
              name="description"
              value={resourceFormData.description}
              onChange={handleResourceFormChange}
              className="form-control"
              placeholder="リソースの説明"
            />
          </div>
          
          <div className="button-group">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setShowResourceModal(false)}
            >
              キャンセル
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleAddEditResource}
            >
              {currentResource !== null ? '更新' : '追加'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3Resources;
