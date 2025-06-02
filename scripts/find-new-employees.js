const fs = require('fs');
const path = require('path');

// 現在の日付（2025-05-25）
const currentDate = new Date('2025-05-25');

// 180日をミリ秒に変換
const days180InMs = 180 * 24 * 60 * 60 * 1000;

// JSONファイルを読み込む
const jsonFilePath = path.join(__dirname, '../temp/firestore-data.json');
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

// 従業員データを取得
const employees = jsonData.employees;

// 新入社員を格納する配列
const newEmployees = [];

// 各従業員をチェック
for (const empNo in employees) {
  const employee = employees[empNo];
  
  // join_dateが存在し、statusがactiveの場合のみ処理
  if (employee.join_date && employee.status === 'active') {
    // join_dateをDate型に変換
    const joinDate = new Date(employee.join_date);
    
    // 現在の日付と入社日の差分を計算（ミリ秒）
    const diffMs = currentDate - joinDate;
    
    // 180日以内かどうかをチェック
    if (diffMs >= 0 && diffMs <= days180InMs) {
      // 新入社員として追加
      newEmployees.push({
        empNo,
        full_name_local: employee.full_name_local,
        join_date: employee.join_date,
        division_code: employee.division_code,
        days_since_joining: Math.floor(diffMs / (24 * 60 * 60 * 1000))
      });
    }
  }
}

// 入社日の新しい順にソート
newEmployees.sort((a, b) => new Date(b.join_date) - new Date(a.join_date));

// 結果を表示
console.log(`新入社員（入社後180日以内）: ${newEmployees.length}人`);
console.log('-------------------------------------');
newEmployees.forEach((emp, index) => {
  console.log(`${index + 1}. ${emp.full_name_local} (${emp.empNo})`);
  console.log(`   部門: ${emp.division_code}`);
  console.log(`   入社日: ${emp.join_date} (${emp.days_since_joining}日前)`);
  console.log('-------------------------------------');
});

// 結果をJSONファイルとして保存
const outputFilePath = path.join(__dirname, '../temp/new-employees.json');
fs.writeFileSync(outputFilePath, JSON.stringify(newEmployees, null, 2), 'utf8');
console.log(`新入社員データを ${outputFilePath} に保存しました`);
