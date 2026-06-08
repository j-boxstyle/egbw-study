# 用語ごと EN→JA 定義の生成ルール（サブエージェント共通・厳守）

EGBW 教科書サイトの各「概念カード」を、**用語ごとの定義の連続**に作り替える。
1用語＝1定義。各用語に「🇬🇧 英語の説明 → 🇯🇵 日本語の説明」を付ける。これは**英語の試験対策**なので英語が主役、日本語は理解補助。

## 入力（あなたが読むファイル）
- 既存の概念データ: `/Users/trumpdonald/Desktop/オランダ留学/egbw-study/study_site/_qtools/tb_w<N>.json`
  （各 concept に id, name, defEN, defJA, example, compare, mistakes などがある＝すべて Canvas 教材由来で正しい）
- 必要なら根拠として該当週の `/tmp/egbw_text/*.txt`（Canvas 教材のテキスト。唯一の真実源）

## 🔒 制約
- 内容は **既存concept(Canvas由来)の範囲のみ**。新しい外部知識・一般論・Web知識を足さない。defEN/defJA/example に書かれた事実だけを言い換え・分解する。
- 数値・定義・例も Canvas 由来のみ。

## 出力：各 concept に `defs` 配列を作る
```json
{
  "<conceptId>": [
    { "t": "Price Elasticity of Demand (Epd)",
      "en": "The responsiveness of quantity demanded to a change in price; the % change in quantity demanded divided by the % change in price.",
      "ja": "価格が1%変わったときに需要量が何%変わるかを示す指標。式は %ΔQd ÷ %ΔP。値（絶対値）が大きいほど価格に敏感、という意味。" },
    { "t": "Elastic demand (|E| > 1)",
      "en": "Quantity demanded responds a lot to a price change; total revenue falls when price rises.",
      "ja": "弾力的な需要。少しの値上げでも需要量が大きく減る。代替品が多い財や贅沢品が典型で、値上げすると総収入はむしろ減る。" },
    { "t": "Inelastic demand (|E| < 1)",
      "en": "Quantity demanded responds little to a price change; total revenue rises when price rises.",
      "ja": "非弾力的な需要。価格が変わっても需要量はあまり変わらない。必需品や代替品が少ない財が典型で、値上げすると総収入は増える。" }
  ],
  "<次のconceptId>": [ ... ]
}
```

## 各フィールドの規則
- **t（用語）**: 英語の用語名。必要なら `(記号/条件)` を併記（例 `Elastic demand (|E| > 1)`）。英語のみ。
- **en（英語の説明）**: 英語のみ。1〜2文で簡潔に、試験で問われる核心。defEN を分解・平易化したもの。記号は ASCII か Δ/%/×÷ 等の一般記号で可。
- **ja（日本語の説明）**: 日本語ベースで**長くてOK・とにかく分かりやすく**。重要な英語専門用語は `**bold**` で残す。計算は数値代入で。defJA の該当部分を噛み砕く。

## 用語の選び方・数
- 各 concept の **1つ目の def は概念そのもの**（t = concept.name 相当）。
- そのあとに、その概念の理解に必要な**主要用語/区別**を 1〜5個（compare の左右、定義中の太字キーワード、対になる概念など）。
- 1 concept あたり **2〜6 defs** を目安。多すぎず、重要なものだけ。重複させない。
- すべての concept を漏れなく処理する（入力 json の全 id にエントリを作る）。

## 品質
- en と ja は必ず**別物の言語**（en=英語のみ、ja=日本語）。en に日本語を混ぜない。
- 既存の example の数値があれば ja に活用してよい。
- JSON は厳密に valid。
