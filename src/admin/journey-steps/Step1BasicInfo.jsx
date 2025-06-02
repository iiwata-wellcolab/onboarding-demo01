import React, { useState } from 'react';

const Step1BasicInfo = ({ journeyData, updateJourneyData, onNext, onCancel }) => {
  const [formData, setFormData] = useState({
    title: journeyData.title || '',
    description: journeyData.description || '',
    department: journeyData.department || '',
    duration: journeyData.duration || '',
    status: journeyData.status || 'draft'
  });

  const [errors, setErrors] = useState({});

  // 入力値の変更を処理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // フォームの検証
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }
    if (!formData.description.trim()) {
      newErrors.description = '説明は必須です';
    }
    if (!formData.department.trim()) {
      newErrors.department = '対象部門は必須です';
    }
    if (!formData.duration.trim()) {
      newErrors.duration = '期間は必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 次のステップへ進む
  const handleNext = () => {
    if (validateForm()) {
      updateJourneyData(formData);
      onNext();
    }
  };

  return (
    <div className="step-content">
      <h3>基本情報</h3>
      <p className="step-description">オンボーディングジャーニーの基本情報を入力してください。</p>
      
      <div className="form-group">
        <label htmlFor="title">タイトル <span className="required">*</span></label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          placeholder="例: 新入社員基本オンボーディング"
        />
        {errors.title && <div className="error-message">{errors.title}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="description">説明 <span className="required">*</span></label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          placeholder="このジャーニーの目的や概要を記入してください"
        />
        {errors.description && <div className="error-message">{errors.description}</div>}
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="department">対象部門 <span className="required">*</span></label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`form-control ${errors.department ? 'is-invalid' : ''}`}
            placeholder="例: 全部門、エンジニアリング部"
          />
          {errors.department && <div className="error-message">{errors.department}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="duration">期間 <span className="required">*</span></label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
            placeholder="例: 90日"
          />
          {errors.duration && <div className="error-message">{errors.duration}</div>}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="status">ステータス</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-control"
        >
          <option value="draft">下書き</option>
          <option value="active">有効</option>
          <option value="inactive">無効</option>
        </select>
      </div>
      
      <div className="button-group">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          キャンセル
        </button>
        <button type="button" className="btn btn-primary" onClick={handleNext}>
          次へ
        </button>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
