# EGBW 教科書タブ用 概念カード抽出ルール（サブエージェント共通・厳守）

会計版と同じ「8ブロック概念カード」を EGBW 用に作る。出力は JSON1ファイル。
教科書: Cowen & Tabarrok, *Modern Principles of Economics* 5e。**根拠は指定テキストファイルのみ**。

## 🔒 絶対制約
- 与えられた `/tmp/egbw_text/*.txt` の内容だけが根拠。Web知識・一般経済学・記憶・他資料の加筆は禁止。数値・定義・例も全てファイル由来。
- Student wiki / 外部サイト禁止。
- 各概念は教材（スライド・演習・週テスト・過去問）に実在する論点であること。

## 🌐 言語ルール（最重要・違反でやり直し）
| フィールド | 言語 | 注意 |
|---|---|---|
| name | **英語のみ** | 試験で問われる正式英語用語そのまま (例 "Price Elasticity of Demand") |
| punchline | **英語のみ** | 試験で出る1行要約 |
| defEN | **英語のみ** | 教科書/スライドの定義ベース。複数段落可。重要語は **bold** |
| example | **英語のみ** | 数字付き具体例。日本語禁止 |
| compare (headers/cells) | **英語のみ** | 比較表は全セル英語 |
| scene | 日本語ベース | ただし英語の概念名・専門用語は **bold** で必ず混在 |
| defJA | 日本語ベース | 英語の専門用語を **bold** で必ず混在。長文可(複数段落・箇条書き歓迎) |
| whyNeeded | 日本語ベース | 英語キーワードを **bold** で混在 |
| mistakes | 日本語ベース | 間違えやすい英語用語ペアを必ず含める |
| memorize | 任意 | 英語のニーモニック推奨 |
→ 目標: **学習者が英語の用語を見ただけで意味を想起できる**状態。英語用語が消えてはいけない。

## 概念カード JSON スキーマ
```json
{
  "id": "c5_price_elasticity_demand",     // c<章番号>_<英語スラッグ>。ユニーク
  "ch": 5,                                  // 教科書章番号
  "week": 1,
  "name": "Price Elasticity of Demand",    // 英語のみ
  "star": true,                            // 試験頻出なら true
  "scene": "ある財の価格が10%上がったとき需要量が...という状況。**price elasticity of demand**(需要の価格弾力性)で測る。",
  "compare": null,                          // 比較概念があるときだけ。無ければ null
  "punchline": "Price elasticity of demand measures how responsive quantity demanded is to a price change.",
  "defEN": "**Price elasticity of demand** is the percentage change in quantity demanded divided by the percentage change in price... (英語、複数段落可、bold重要語)",
  "defJA": "めちゃくちゃ簡単に言うと、**price elasticity of demand**(需要の価格弾力性)は『価格が1%変わったら需要量が何%変わるか』です。\n\n--- 計算 ---\n**E** = %ΔQ / %ΔP\n\n--- 試験で聞かれるポイント ---\n• |E|>1 → **elastic**(弾力的)\n• |E|<1 → **inelastic**(非弾力的)",
  "example": "If price rises 10% and quantity demanded falls 20%, then E = -20%/10% = -2 (elastic).",
  "whyNeeded": "価格設定や税の帰着(**tax incidence**)、総収入(**total revenue**)の変化を予測するのに不可欠。試験では計算と弾力/非弾力の判定が頻出。",
  "mistakes": ["**elastic** と **inelastic** を逆にする誤り。|E|>1 が elastic。", "弾力性を傾き(slope)と混同する誤り。"],
  "memorize": "Elastic = E>1 (responsive); Inelastic = E<1 (rigid)"
}
```
### compare を使う場合（旧形式）
```json
"compare": { "a": "Elastic Demand", "b": "Inelastic Demand",
  "table": [
    {"dim":"Elasticity","a":"|E| > 1","b":"|E| < 1"},
    {"dim":"Total revenue when price rises","a":"Falls","b":"Rises"}
  ]}
```
（dim=比較軸も英語。a/b も英語）

## 演習問題(EXAM_PROBLEMS) スキーマ
週テスト/演習/過去問の代表問題を週ごとに1〜2問。
```json
{
  "id":"ep_w1_1", "week":1,
  "title":"Elasticity & Tax Incidence",           // 英語
  "badge":"Week 1 Practice ①",
  "scenario":"英語のシナリオ(条件・数値)",
  "transactions":["英語の条件1","英語の条件2"],   // 任意。無ければ空配列
  "questions":["(a) English question...","(b) ..."],
  "solHtml":"<div class=\"exam-sol-label\">(a)</div><div class=\"exam-entry\">E = -20%/10% = -2 ... </div>"  // HTML文字列。計算過程を含む英語+必要なら日本語注
}
```
solHtml では `<div class="exam-sol-label">`(見出し), `<div class="exam-entry">`(等幅計算), `<table class="exam-table">`(表) が使える。

## 用語集(GLOSSARY) スキーマ
```json
{ "term":"Price Elasticity of Demand", "def":"需要の価格弾力性。%ΔQ÷%ΔP。|E|>1で弾力的。" }
```
term=英語、def=日本語(英語専門用語は残す)。

## 出力
1ファイルに3配列をまとめる:
```json
{ "concepts":[...], "glossary":[...], "examProblems":[...] }
```
JSON は厳密に valid。質と source-fidelity 最優先。
