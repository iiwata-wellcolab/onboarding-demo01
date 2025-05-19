import React, { createContext, useState, useContext, useEffect } from 'react';

// 進捗状況の初期値
const initialProgress = {
  documents: {
    total: 4,
    completed: 0,
    items: [
      { id: 'doc1', title: '就業規則', completed: false, completedAt: null },
      { id: 'doc2', title: 'リモートワーク規定', completed: false, completedAt: null },
      { id: 'doc3', title: '秘密保持契約書', completed: false, completedAt: null },
      { id: 'doc4', title: '個人情報の取り扱いに関する同意書', completed: false, completedAt: null }
    ]
  },
  items: {
    total: 9,
    completed: 0,
    items: [
      { id: 'item1', title: '健康診断個人票', completed: false, completedAt: null },
      { id: 'item2', title: '健康診断の領収書', completed: false, completedAt: null },
      { id: 'item3', title: 'パスポート・在留カード', completed: false, completedAt: null },
      { id: 'item4', title: '年金手帳', completed: false, completedAt: null },
      { id: 'item5', title: '雇用保険被保険者証', completed: false, completedAt: null },
      { id: 'item6', title: '扶養控除等申請書', completed: false, completedAt: null },
      { id: 'item7', title: '源泉徴収票', completed: false, completedAt: null },
      { id: 'item8', title: '住民税の特別徴収にかかる異動届', completed: false, completedAt: null },
      { id: 'item9', title: 'その他必要書類', completed: false, completedAt: null }
    ]
  },
  messages: {
    total: 3,
    completed: 0,
    items: [
      { id: 'msg1', title: '原田 一郎からのメッセージ', completed: false, completedAt: null },
      { id: 'msg2', title: '野村 育子からのメッセージ', completed: false, completedAt: null },
      { id: 'msg3', title: '小林 美樹からのメッセージ', completed: false, completedAt: null }
    ]
  }
};

// ローカルストレージのキー
const STORAGE_KEY = 'onboarding_progress';

// Contextの作成
const ProgressContext = createContext();

// Contextプロバイダーコンポーネント
export const ProgressProvider = ({ children }) => {
  // ローカルストレージから進捗状況を取得するか、初期値を使用
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    return savedProgress ? JSON.parse(savedProgress) : initialProgress;
  });

  // 進捗状況が変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // 特定のカテゴリのアイテムを完了としてマーク
  const markItemCompleted = (category, itemId) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    const completedAt = `${formattedDate} ${formattedTime}`;
    
    setProgress(prevProgress => {
      const updatedItems = prevProgress[category].items.map(item => 
        item.id === itemId ? { ...item, completed: true, completedAt } : item
      );
      
      const completedCount = updatedItems.filter(item => item.completed).length;
      
      return {
        ...prevProgress,
        [category]: {
          ...prevProgress[category],
          items: updatedItems,
          completed: completedCount
        }
      };
    });
  };

  // カテゴリ内のすべてのアイテムを完了としてマーク
  const markCategoryCompleted = (category) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    const completedAt = `${formattedDate} ${formattedTime}`;
    
    setProgress(prevProgress => {
      const updatedItems = prevProgress[category].items.map(item => 
        item.completed ? item : { ...item, completed: true, completedAt }
      );
      
      return {
        ...prevProgress,
        [category]: {
          ...prevProgress[category],
          items: updatedItems,
          completed: prevProgress[category].total
        }
      };
    });
  };

  // 進捗状況をリセット
  const resetProgress = () => {
    setProgress(initialProgress);
  };

  // 全体の進捗率を計算
  const calculateTotalProgress = () => {
    const totalItems = Object.values(progress).reduce((sum, category) => sum + category.total, 0);
    const completedItems = Object.values(progress).reduce((sum, category) => sum + category.completed, 0);
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  return (
    <ProgressContext.Provider value={{ 
      progress, 
      markItemCompleted, 
      markCategoryCompleted, 
      resetProgress,
      calculateTotalProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

// カスタムフック
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
