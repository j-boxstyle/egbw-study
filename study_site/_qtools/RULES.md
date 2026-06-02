# EGBW 問題抽出ルール（サブエージェント共通・厳守）

あなたは UvA「Economics in a Global Business World」(教科書: Cowen & Tabarrok, *Modern Principles of Economics*, 5e) の
MCQ を、指定された **テキストファイルだけ** を根拠に作る。出力は JSON 配列ファイル1個。

## 🔒 絶対制約
1. **ソース厳格**: 与えられた `/tmp/egbw_text/*.txt` の内容のみが根拠。Web知識・一般経済学・他資料・記憶からの加筆は一切禁止。数値・定義・例も全てファイル由来。
2. **既存MCQ最優先**: ファイルに `ANSWER:` 付きの MCQ があれば、それを最優先で抽出する（問題文・4択・正解をそのまま使う）。図(figure/table)が無いと解けない問題は **スキップ**（"Refer to the figure" 系で図の数値が本文に無いもの）。図が無くても文章で完結する問題は採用。
3. **正解は必ず1つだけ**。"All of the above"/"None of the above" を正解にしない（元問題がそうでも、その問題はスキップ）。複数正解・等価判定禁止。
4. **概念問題の追加**: スライド(slides)の箇条書き・定義から、図不要の概念MCQを追加で作ってよい。ただし内容は必ずスライド本文に書かれていること。選択肢は問題文の語をそのまま並べない。誤答は明確に誤りとわかるもの。
5. **言語**: 問題文(q)・選択肢(opts)は英語。解説(exp)・誤答理由(we)は日本語。
6. **大問の小問**: (a)(b)(c)(d) に分かれた解答付き問題は、各小問を独立MCQにできるものは分ける。

## 出力スキーマ（JSON配列、1要素=1問）
```json
{
  "conceptId": "c5_elasticity",        // c<章番号>_<英小文字スラッグ>
  "ch": 5,                              // 教科書章番号(整数)
  "week": 1,                            // 週
  "type": "A",                         // A=概念定義 B=計算 C=分析/比較 D=グラフ読取(本文で完結する範囲) E=応用/事例
  "q": "The supply of a good tends to be more elastic if:",   // 英語。先頭に[Source]は付けない（sourceフィールドで管理）
  "opts": ["production can be expanded without a big input-price increase",
           "the good is a necessary good",
           "a price change causes only a small change in quantity supplied",
           "an increase in production has minimal impact on demand"],
           // ちょうど4要素。"A)"等の接頭辞は付けない（本文だけ）。E)わからない は付けない（サイト側で自動付与）
  "ans": 0,                            // 正解のindex(0-3)。任意の位置でよい（後で均等化する）
  "exp": "供給は、価格が上がっても投入コストが大きく上がらず生産を拡大できるときに弾力的になる。…(日本語3-5文。途中式や根拠も)",
  "we": {"1":"必需品かどうかは需要の弾力性の話で供給の弾力性とは別。","2":"これは逆に非弾力的な供給の説明。","3":"需要への影響は供給の弾力性の定義に無関係。"},
           // キーは ans 以外の opts index(文字列)。各誤答が「なぜ誤りか」を日本語で。
  "source": "EGBW Past Exam (Midterm 2021 Q2)"   // 由来。例: "EGBW Exercise W1 Ch5", "EGBW Weekly Test 1", "EGBW Slides W2 Ch13", "EGBW Past Exam (Endterm 2023 Q10)"
}
```

## 品質
- exp は日本語で計算は substitution 形式（数値代入の途中式）を書く。
- 弾力性・GDP成長率・税率などの計算問題は積極的に採用（本文に数値があるもの）。
- conceptId は章とトピックで一貫させる（同じ概念は同じ id）。
- 1ファイルにつき出せるだけ出す。質を最優先。重複は避ける。
- JSON は厳密に valid（末尾カンマ無し、ダブルクオート、改行は \n エスケープ）。
