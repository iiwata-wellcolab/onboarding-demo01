// 従業員データを保持するグローバル変数
let employeeData = {};

// 従業員データを読み込む関数
async function loadEmployeeData() {
  try {
    console.log('従業員データの読み込みを開始します...');
    
    // まず、インラインデータを試みる
    const data = await loadInlineData();
    if (data && Object.keys(data).length > 0) {
      employeeData = data;
      console.log(`インラインデータから ${Object.keys(employeeData).length} 人の従業員データを読み込みました`);
      return employeeData;
    }
    
    // インラインデータがない場合、JSONファイルを試みる
    console.log('インラインデータが見つかりませんでした。JSONファイルを試みます...');
    const jsonData = await loadFromJsonFile();
    if (jsonData && Object.keys(jsonData).length > 0) {
      employeeData = jsonData;
      console.log(`JSONファイルから ${Object.keys(employeeData).length} 人の従業員データを読み込みました`);
      return employeeData;
    }
    
    // それでも失敗した場合
    throw new Error('従業員データを読み込めませんでした');
  } catch (error) {
    console.error('従業員データの読み込みエラー:', error);
    throw error;
  }
}

// インラインデータを読み込む関数
function loadInlineData() {
  // ここに直接従業員データを埋め込む
  // 注意: 実際の環境では、この方法は大量のデータには適していません
  // しかし、デモや緊急時の対応としては有効です
  
  // サンプルデータ（実際のデータに置き換えてください）
  const sampleData = {
    "1001": { "full_name_local": "山田 太郎", "status": "active", "division_code": "ENG" },
    "1002": { "full_name_local": "佐藤 花子", "status": "active", "division_code": "SLS" },
    "1003": { "full_name_local": "鈴木 一郎", "status": "active", "division_code": "PRJ" },
    // 他の従業員データを追加...
  };
  
  // 実際のデータがある場合はそれを返し、なければnullを返す
  return Promise.resolve(Object.keys(sampleData).length > 0 ? sampleData : null);
}

// JSONファイルから読み込む関数
async function loadFromJsonFile() {
  // JSONファイルのパスを複数試す
  const possiblePaths = [
    './firestore-data.json',
    '/firestore-data.json',
    '../temp/firestore-data.json',
    '/temp/firestore-data.json'
  ];
  
  for (const path of possiblePaths) {
    try {
      console.log(`JSONファイルを ${path} から読み込み試行中...`);
      const response = await fetch(path);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`JSONデータを ${path} から読み込みました`);
        
        if (data && data.employees) {
          return data.employees;
        } else {
          console.warn(`${path} からのJSONデータに従業員情報がありません`);
        }
      } else {
        console.warn(`${path} からのJSONデータ読み込みに失敗しました: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.warn(`${path} からのJSONデータ読み込みに失敗しました:`, error);
    }
  }
  
  return null;
}

// 従業員データをエクスポート
export { loadEmployeeData, employeeData };
