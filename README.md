# WellColab オンボーディングデモアプリ

## 概要
このアプリケーションは、社員情報管理システムのデモです。社員ディレクトリ、社員詳細、新入社員情報などの機能を提供します。

## 開発環境
- React + Vite
- Firebase (Firestore, Storage, Hosting)

## 重要な設定情報

### 画像パスの命名規則

**重要**: 画像パスの形式に関する注意事項

1. **社員写真のパス形式**
   - 正しいパス: `employee-photos/${emp_no}.png`（ハイフン区切り）
   - 誤ったパス: `employee_photos/${emp_no}.png`（アンダースコア区切り）

2. **ファイル拡張子**
   - 正しい拡張子: `.png`
   - 誤った拡張子: `.jpg`

3. **画像の参照場所**
   - ローカル環境: `/images/employee-photos/${emp_no}.png`
   - Firebase Storage: `employee-photos/${emp_no}.png`

過去に何度もこの命名規則の間違いによりバグが発生しているため、新しいコンポーネントを作成する際は必ずこの規則に従ってください。

## 起動方法
- 開発サーバー: `npm run dev`
- ビルド: `npm run build`
- デプロイ: `firebase deploy --only hosting`

## 元の React + Vite 情報

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces.

[Vite](https://vitejs.dev/) is a blazing fast frontend build tool that includes features like Hot Module Reloading (HMR), optimized builds, and TypeScript support out of the box.

Using the two in conjunction is one of the fastest ways to build a web app.