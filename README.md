Not # 事前準備
npmコマンドを利用するため、node.js及び導入が必要です。
予めインストールしておいてください。

# 導入手順
1. プロジェクトデータをダウンロードし、VSCodeなどのコードディタで開く
2. 以下のコマンドを実行してThree.js関連のライブラリをインポート
```
npm install three --save
npm install @react-three/fiber @react-three/drei
npm install @types/three
npm install @react-three/rapier
```

# Lccデータを閲覧するには
* ローカルサーバにて動作確認したい場合
1. 以下のコマンドでローカルサーバビルド
```
npm run dev
```
4. 生成されたローカルサーバのURLをmain.jsの166行目の記載に反映
5. アローカルサーバのURLをWebブラウザで閲覧確認


* ウェブサーバサーバ上で閲覧したい場合
1. page.jsの67行目のdatapath属性に既述されているURLの"http://localhost:3000"の部分をアップロードしたいサーバのドメイン（サブドメイン含）に書き換えて保存
2. next.config.tsの13,14行目に記述されている'/next_test'を'/ + アップロードしたいサーバのサブドメイン（1階層目のディレクトリ名）'に書き換えて保存
3. 以下のコマンドでビルド
```
npm run build
```
4. outファイル下の内容一式をウェブサーバのアップロード先ディレクトリ下にアップロード
5. アップロード先のURLをWebブラウザで閲覧確認