<div align="center">
<h1>シャレイア語フォント生成 (TypeScript 版)</h1>
</div>

![](https://img.shields.io/github/commit-activity/y/Ziphil/TypescriptFontGenerator?label=commits)


## 概要
シャレイア語のフォントを TypeScript コードから生成するためのパッケージです。
フォントを生成するシステムはできていますが、フォントデータの移植がまだ終わっていません。

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

## 実行
### フォントファイルの生成
以下のコマンドを実行すると、`out` ディレクトリにフォントが出力されます。
```
npm run generate
```

### Web プレビュー
以下のコマンドを実行すると、プレビュー用のサーバーがポート 3003 で起動します。
```
npm run develop
```
この状態でブラウザから `localhost:3003/(フォントID)` にアクセスすると、該当フォントのプレビューが表示されます。
フォント ID は以下を参照してください。

## フォント一覧
現在生成できるフォントは以下の通りです。

| ID | フォント名 |
|:------:|:----------:|
| `vkr` | Vekos Regular |
| `vkb` | Vekos Bold |
| `vkt` | Vekos Thin |
| `vkcr` | Vekos Condensed Regular |
| `vkcb` | Vekos Condensed Bold |
| `vkct` | Vekos Condensed Thin |
| `vker` | Vekos Expanded Regular |
| `vkeb` | Vekos Expanded Bold |
| `vket` | Vekos Expanded Thin |
| `vkhr` | Vekos High Regular |
| `vkhb` | Vekos High Bold |