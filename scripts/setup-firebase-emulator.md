# Firebase Emulatorセットアップ手順

## 1. Firebase CLIのインストール

```bash
npm install -g firebase-tools
```

## 2. Firebaseプロジェクトの初期化（まだ行っていない場合）

```bash
firebase login
firebase init
```

初期化時に以下のサービスを選択します：
- Firestore
- Emulators

## 3. Emulatorの設定

`firebase.json`ファイルに以下の設定が含まれていることを確認します：

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

## 4. Emulatorの起動

```bash
firebase emulators:start
```

これにより、以下のサービスがローカルで起動します：
- Firestore: http://localhost:8080
- Auth: http://localhost:9099
- Emulator UI: http://localhost:4000
