# プロジェクト設定情報

## 環境情報
- プロジェクト名: iiwata-onboarding-demo01
- フレームワーク: React + Vite
- Firebase プロジェクト: iiwata-onboarding-demo01
- ホスティング URL: https://iiwata-onboarding-demo01.web.app

## 主要ファイル構成
- `/src/firebase/config.js` - Firebase設定
- `/src/admin/` - 管理画面関連コンポーネント
  - `/src/admin/NewHireDetail.jsx` - 新入社員詳細画面
  - `/src/admin/NewHireSidebar.jsx` - 新入社員詳細画面のサイドバー
  - `/src/admin/NewHireContent.jsx` - 新入社員詳細画面のコンテンツエリア
  - `/src/admin/EmployeesList.jsx` - 従業員一覧画面
- `/scripts/` - データインポート用スクリプト
- `/temp/` - CSVデータファイル
- `/public/images/` - デフォルト画像ファイル

## データベース構造
- Firestore コレクション:
  - `organizations` - 組織マスターデータ
  - `employees` - 従業員マスターデータ
  - `employee_profile` - 従業員プロフィールデータ
  - `new_hire` - 新入社員データ

## ストレージ構造
- Firebase Storage:
  - `employee-photos` - 従業員の顔写真フォルダ
    - フォルダ名: `employee-photos` (ハイフンを使用)
    - ファイル名形式: `{{emp_no}}.png`
    - 拡張子: `png` (大文字小文字を区別)
    - デフォルト画像パス: `/images/default_emp_icon.png`
    - statusが「active」な社員全員の写真を格納
    - URL生成方法: `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/employee-photos%2F${emp_no}.png?alt=media`

## デプロイ方法
```bash
# ビルド
npm run build

# Firebaseプロジェクト選択
firebase use iiwata-onboarding-demo01

# デプロイ
firebase deploy --only hosting
```

## 主要コマンド
- 開発サーバー起動: `npm run dev`
- ビルド: `npm run build`
- プレビュー: `npm run preview`
- CSVインポート: `node scripts/update-organizations.js`
- Firebaseデプロイ: `firebase deploy --only hosting`
- Firebaseデプロイ(関数のみ): `firebase deploy --only functions`

## ローカルプレビュー方法

### Vite開発サーバーによるプレビュー
```bash
# プロジェクトルートディレクトリで実行
npm run dev
```

実行後、以下のURLでアクセス可能：
- ローカル: http://localhost:5173/
- ネットワーク: http://[IPアドレス]:5173/

### HTMLファイル直接プレビュー
特定のHTMLファイルを直接確認したい場合は、以下の方法でも可能：

```bash
# プロジェクトルートディレクトリで実行
python -m http.server 8000
```

実行後、以下のURLでアクセス可能：
- http://localhost:8000/[ファイルパス]
- 例: http://localhost:8000/temp/新入社員詳細_o3mini_2.html
