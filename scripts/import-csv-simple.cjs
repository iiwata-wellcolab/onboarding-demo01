const fs = require('fs');
const path = require('path');
const readline = require('readline');

// BOMを除去する関数
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    return content.slice(1);
  }
  return content;
}

// CSVを解析する簡易関数
function parseCSV(line) {
  return line.split(',').map(field => field.trim());
}

// 組織データのインポート
async function importOrganizations() {
  const filePath = path.join(__dirname, '../temp/org_master.csv');
  const organizations = {};
  let headers = null;
  
  try {
    // ファイルを行ごとに読み込む
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    
    let lineCount = 0;
    
    for await (let line of rl) {
      lineCount++;
      
      // 最初の行はBOMを除去してヘッダーとして処理
      if (lineCount === 1) {
        line = stripBOM(line);
        headers = parseCSV(line);
        continue;
      }
      
      // データ行を処理
      const values = parseCSV(line);
      if (values.length !== headers.length) {
        console.warn(`警告: 行 ${lineCount} のフィールド数がヘッダーと一致しません`);
        continue;
      }
      
      // オブジェクトに変換
      const org = {};
      headers.forEach((header, index) => {
        org[header] = values[index];
      });
      
      // 親部門の特定
      let parentDivision = null;
      if (org.division_code && org.division_code.includes('-')) {
        const parts = org.division_code.split('-');
        if (parts.length > 2) {
          // 例: COR-D01-S01 の親は COR-D01
          parentDivision = parts.slice(0, 2).join('-');
        } else {
          // 例: COR-D01 の親は COR
          parentDivision = parts[0];
        }
      }
      
      // 組織データを保存
      organizations[org.division_code] = {
        division_code: org.division_code,
        division_name_local: org.division_name_local,
        parent_division: parentDivision
      };
    }
    
    console.log(`${Object.keys(organizations).length} 組織データを読み込みました`);
    return organizations;
    
  } catch (error) {
    console.error('組織データの読み込み中にエラーが発生しました:', error);
    throw error;
  }
}

// 従業員データのインポート
async function importEmployees() {
  const filePath = path.join(__dirname, '../temp/step17i_with_full_names_rev3.csv');
  const employees = {};
  let headers = null;
  
  try {
    // ファイルを行ごとに読み込む
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    
    let lineCount = 0;
    
    for await (let line of rl) {
      lineCount++;
      
      // 最初の行はBOMを除去してヘッダーとして処理
      if (lineCount === 1) {
        line = stripBOM(line);
        headers = parseCSV(line);
        continue;
      }
      
      // データ行を処理
      const values = parseCSV(line);
      if (values.length !== headers.length) {
        console.warn(`警告: 行 ${lineCount} のフィールド数がヘッダーと一致しません`);
        continue;
      }
      
      // オブジェクトに変換
      const emp = {};
      headers.forEach((header, index) => {
        emp[header] = values[index];
      });
      
      // 日付フィールドをISOString形式に変換
      const joinDate = emp.join_date ? new Date(emp.join_date).toISOString() : null;
      const birthDate = emp.birth_date ? new Date(emp.birth_date).toISOString() : null;
      const terminationDate = emp.termination_date ? new Date(emp.termination_date).toISOString() : null;
      
      // 従業員データを保存
      employees[emp.emp_no] = {
        emp_no: emp.emp_no,
        birth_date: birthDate,
        join_date: joinDate,
        join_type: emp.join_type,
        nationality: emp.nationality,
        status: emp.status,
        termination_date: terminationDate,
        division_code: emp.division_code,
        position: emp.position,
        supervisor_emp_id: emp.supervisor_emp_id,
        concurrent_flag: parseInt(emp.concurrent_flag) || 0,
        gender: emp.gender,
        office: emp.office,
        employment_type: emp.employment_type,
        last_name_local: emp.last_name_local,
        last_name_alphabet: emp.last_name_alphabet,
        last_name_kana: emp.last_name_kana,
        first_name_local: emp.first_name_local,
        first_name_alphabet: emp.first_name_alphabet,
        first_name_kana: emp.first_name_kana,
        middle_name_local: emp.middle_name_local,
        middle_name_alphabet: emp.middle_name_alphabet,
        full_name_local: emp.full_name_local,
        full_name_alphabet: emp.full_name_alphabet,
        full_name_alphabet_lower: emp.full_name_alphabet ? emp.full_name_alphabet.toLowerCase() : null
      };
    }
    
    console.log(`${Object.keys(employees).length} 従業員データを読み込みました`);
    return employees;
    
  } catch (error) {
    console.error('従業員データの読み込み中にエラーが発生しました:', error);
    throw error;
  }
}

// メイン処理
async function main() {
  try {
    console.log('組織データのインポートを開始します...');
    const organizations = await importOrganizations();
    console.log('組織データのインポートが完了しました');
    
    console.log('従業員データのインポートを開始します...');
    const employees = await importEmployees();
    console.log('従業員データのインポートが完了しました');
    
    // インポートしたデータの統計情報
    const orgCount = Object.keys(organizations).length;
    const empCount = Object.keys(employees).length;
    console.log(`インポート統計: ${orgCount} 組織, ${empCount} 従業員`);
    
    // データをJSONファイルに保存
    const outputPath = path.join(__dirname, '../temp/firestore-data.json');
    const data = {
      organizations,
      employees
    };
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`インポートデータを ${outputPath} に保存しました`);
    
    console.log('すべてのデータのインポートが完了しました');
    process.exit(0);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
