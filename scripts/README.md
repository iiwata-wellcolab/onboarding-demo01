# Firebase CSVデータインポートツール

このツールは、CSVファイルからFirebase Firestoreにデータをインポートするためのユーティリティです。

## 前提条件

- Node.js (v14以上)
- npm または yarn
- Firebase プロジェクト

## セットアップ手順

1. 必要なパッケージをインストールします：

```bash
cd /path/to/project
npm install firebase-admin csv-parser
```

2. Firebase Admin SDKの認証情報を取得します：

   a. [Firebase Console](https://console.firebase.google.com/) にアクセスします
   b. プロジェクトを選択します
   c. 「プロジェクト設定」 > 「サービスアカウント」タブを開きます
   d. 「新しい秘密鍵の生成」ボタンをクリックして、JSONファイルをダウンロードします
   e. ダウンロードしたJSONファイルをプロジェクトルートに `firebase-credentials.json` という名前で保存します

## 使用方法

```bash
node scripts/import-csv-to-firestore.js
```

## データモデル

このスクリプトは以下のコレクションを作成します：

### organizations コレクション

組織構造のマスターデータを格納します。各ドキュメントのIDは `division_code` です。

```
organizations/
└── [division_code]/
    ├── division_code: string
    ├── division_name_local: string
    └── parent_division: string | null
```

### employees コレクション

従業員データを格納します。各ドキュメントのIDは `emp_no` です。

```
employees/
└── [emp_no]/
    ├── emp_no: string
    ├── birth_date: timestamp
    ├── join_date: timestamp
    ├── join_type: string
    ├── nationality: string
    ├── status: string
    ├── termination_date: timestamp | null
    ├── division_code: string
    ├── position: string
    ├── supervisor_emp_id: string
    ├── concurrent_flag: number
    ├── gender: string
    ├── office: string
    ├── employment_type: string
    ├── last_name_local: string
    ├── last_name_alphabet: string
    ├── last_name_kana: string
    ├── first_name_local: string
    ├── first_name_alphabet: string
    ├── first_name_kana: string
    ├── middle_name_local: string
    ├── middle_name_alphabet: string
    ├── full_name_local: string
    ├── full_name_alphabet: string
    └── full_name_alphabet_lower: string
```

## セキュリティルール

Firestoreのセキュリティルールは、以下のように設定することをお勧めします：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 認証済みユーザーのみがデータを読み取れるようにする
    match /organizations/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /employees/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 注意事項

- 大量のデータをインポートする場合、Firestoreの書き込み制限に注意してください
- 機密情報を含むデータの場合、適切なセキュリティ対策を講じてください
- 本番環境での使用前に、テスト環境でスクリプトの動作を確認してください
