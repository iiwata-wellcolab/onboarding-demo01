import React, { useState } from 'react';

const Step2Tasks = ({ journeyData, updateJourneyData, onNext, onBack }) => {
  const [tasks, setTasks] = useState(journeyData.tasks || []);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskFormData, setTaskFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'pending'
  });
  const [errors, setErrors] = useState({});

  // タスクの追加または編集
  const handleAddEditTask = () => {
    if (!validateTaskForm()) return;

    if (currentTask !== null) {
      // 既存タスクの編集
      const updatedTasks = [...tasks];
      updatedTasks[currentTask] = {
        ...updatedTasks[currentTask],
        ...taskFormData
      };
      setTasks(updatedTasks);
    } else {
      // 新規タスクの追加
      setTasks([
        ...tasks,
        {
          id: Date.now(), // 一時的なID
          ...taskFormData
        }
      ]);
    }

    // モーダルを閉じてフォームをリセット
    setShowTaskModal(false);
    resetTaskForm();
  };

  // タスクの削除
  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  // タスクの編集モーダルを開く
  const handleEditTask = (index) => {
    const task = tasks[index];
    setCurrentTask(index);
    setTaskFormData({
      name: task.name || '',
      description: task.description || '',
      dueDate: task.dueDate || '',
      status: task.status || 'pending'
    });
    setShowTaskModal(true);
  };

  // 新規タスク追加モーダルを開く
  const handleOpenAddTaskModal = () => {
    setCurrentTask(null);
    resetTaskForm();
    setShowTaskModal(true);
  };

  // タスクフォームのリセット
  const resetTaskForm = () => {
    setTaskFormData({
      name: '',
      description: '',
      dueDate: '',
      status: 'pending'
    });
    setErrors({});
  };

  // タスクフォームの入力変更を処理
  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData({
      ...taskFormData,
      [name]: value
    });
  };

  // タスクフォームのバリデーション
  const validateTaskForm = () => {
    const newErrors = {};
    if (!taskFormData.name.trim()) {
      newErrors.name = 'タスク名は必須です';
    }
    if (!taskFormData.dueDate.trim()) {
      newErrors.dueDate = '期日は必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 次のステップへ進む
  const handleNext = () => {
    updateJourneyData({ tasks });
    onNext();
  };

  // ステータスに応じたラベルとクラスを取得
  const getStatusInfo = (status) => {
    switch(status) {
      case 'completed':
        return { label: '完了', className: 'status-completed' };
      case 'in-progress':
        return { label: '進行中', className: 'status-in-progress' };
      case 'pending':
      default:
        return { label: '未開始', className: 'status-pending' };
    }
  };

  return (
    <div className="step-content">
      <h3>タスク設定</h3>
      <p className="step-description">オンボーディングジャーニーに含めるタスクを追加してください。</p>
      
      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>タスクがまだ追加されていません。「タスクを追加」ボタンをクリックして、最初のタスクを追加してください。</p>
          </div>
        ) : (
          tasks.map((task, index) => {
            const statusInfo = getStatusInfo(task.status);
            return (
              <div key={task.id || index} className="task-item">
                <div className="task-content">
                  <div className="task-name">{task.name}</div>
                  {task.description && <div className="task-description">{task.description}</div>}
                  <div className="task-due-date">期日: {task.dueDate}</div>
                  <div className={`task-status ${statusInfo.className}`}>
                    {statusInfo.label}
                  </div>
                </div>
                <div className="task-actions">
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => handleEditTask(index)}
                  >
                    編集
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => handleDeleteTask(index)}
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })
        )}
        
        <button 
          className="add-task-btn" 
          onClick={handleOpenAddTaskModal}
        >
          <i className="fas fa-plus"></i> タスクを追加
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
      
      {/* タスク追加/編集モーダル */}
      {showTaskModal && (
        <div className="task-detail-modal">
          <div className="task-detail-header">
            <h3>{currentTask !== null ? 'タスクを編集' : 'タスクを追加'}</h3>
            <button 
              className="task-detail-close" 
              onClick={() => setShowTaskModal(false)}
            >
              ×
            </button>
          </div>
          
          <div className="form-group">
            <label htmlFor="taskName">タスク名 <span className="required">*</span></label>
            <input
              type="text"
              id="taskName"
              name="name"
              value={taskFormData.name}
              onChange={handleTaskFormChange}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="例: 入社書類の提出"
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="taskDescription">説明</label>
            <textarea
              id="taskDescription"
              name="description"
              value={taskFormData.description}
              onChange={handleTaskFormChange}
              className="form-control"
              placeholder="タスクの詳細説明"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="taskDueDate">期日 <span className="required">*</span></label>
            <input
              type="text"
              id="taskDueDate"
              name="dueDate"
              value={taskFormData.dueDate}
              onChange={handleTaskFormChange}
              className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
              placeholder="例: 入社7日前、入社日、入社後30日"
            />
            {errors.dueDate && <div className="error-message">{errors.dueDate}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="taskStatus">ステータス</label>
            <select
              id="taskStatus"
              name="status"
              value={taskFormData.status}
              onChange={handleTaskFormChange}
              className="form-control"
            >
              <option value="pending">未開始</option>
              <option value="in-progress">進行中</option>
              <option value="completed">完了</option>
            </select>
          </div>
          
          <div className="button-group">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setShowTaskModal(false)}
            >
              キャンセル
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleAddEditTask}
            >
              {currentTask !== null ? '更新' : '追加'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2Tasks;
