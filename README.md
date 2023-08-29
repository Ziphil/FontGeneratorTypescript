<div align="center">
<h1>シャレイア語フォント生成 (TypeScript 版)</h1>
</div>

![](https://img.shields.io/github/commit-activity/y/Ziphil/TypescriptFontGenerator?label=commits)


## 概要
シャレイア語のフォントを TypeScript コードから生成するためのパッケージです。
フォントのグリフデータを閲覧できる Web プレビュー機能が付いているので、生成結果を確認しながらフォントデータを編集することができます。

フォントの Web プレビューは GitHub Pages にもデプロイしてあるので、このパッケージをインストールしなくても見ることができます。 

- [Web プレビュー (on GitHub)](https://ziphil.github.io/FontGeneratorTypescript/)

## 下準備
### ライブラリのインストール
まず、以下のコマンドを実行して必要なライブラリをインストールしてください。
ただし、Windows 環境で実行する場合、コマンドプロンプトや PowerShell では paper.js をインストールする際にエラーが発生します。
Git Bash や WSL が提供する Bash などの Unix 系シェルで実行してください。
```
npm install
```

### FontForge と Python の準備
フォントファイルの生成には [FontForge](https://fontforge.github.io/) の Python スクリプティング機能を使います。
Python 上で `import fontforge` が通るようになっていれば問題ありません。

Windows の場合は、FontForge の Windows 用インストーラを用いると、FontForge がデフォルトで呼び出せるようになっている Python が勝手に付いてきます。
FontForge をインストールした場所の `bin` フォルダ内にある `ffpython.exe` というファイルがそれです。
このフォルダにパスを通してください。

なお、フォントファイルを生成せずに Web プレビューを利用するだけなら FontForge は必要ありません。

## 実行
### フォントファイルの生成
以下のコマンドを実行すると、`out` ディレクトリにフォントが出力されます。
```
npm run generate -- --python (Pythonのコマンド名)
```
Python のコマンド名には、`import fontforge` が通るものを指定してください。
Windows 環境で実行する場合で、上に述べた方法で FontForge をインストールしてある場合は、`ffpython` を指定してください。

生成できるフォントは、以下のコマンドで一覧することができます。
```
npm run generate -- --list
```

### Web プレビュー
以下のコマンドを実行すると、プレビュー用のサーバーが起動します。
```
npm run develop -- --port (ポート番号)
```
この状態でブラウザから `localhost:(ポート番号)` にアクセスすると、生成できるフォントの一覧が表示された Web ページが表示されます。
フォントを選択すると、プレビューを見ることができます。