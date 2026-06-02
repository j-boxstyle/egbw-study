# EGBW 学習サイト — Economics in a Global Business World

University of Amsterdam の科目 **Economics in a Global Business World** (教科書: Cowen & Tabarrok, *Modern Principles of Economics*, 5th ed.) 専用の単一ファイル Web 学習サイト。

🔗 **公開URL:** https://j-boxstyle.github.io/egbw-study/

## 特徴
- **MCQ クイズ**: 全問 Canvas 教材（講義スライド・週別演習・週テスト・過去問）由来。正解は必ず1つ、正解位置は均等ランダム化、5択目に「わからない」。
- **4タブ**: 📖 教科書（章別要点）｜📋 まとめ（週別）｜❓ クイズ｜📚 用語集（日英対訳）。
- **モード複数選択**: すべて / 復習(誤答) / わからない / 未回答 を OR 結合。出題ソース（過去問・演習・週テスト・講義）でも絞り込み。
- **層化シャッフル**: 20問ブロックで A/B/C/D が各≈5問、3連続同位置を回避。
- **AI 学習連携 (【Opus 4.8】)**: 📋分析プロンプト / 🎯確認テスト をクリップボードへコピー。10問以上でバッチ一括分析（弱点TOP3＋確認テスト15問）。

## 範囲（週↔章）
| Week | Topic | Chapters (C&T 5e) |
|------|-------|-------------------|
| 1 | Demand and supply | 5, 6, 8, 9, 10 |
| 2 | Firms and factor markets | 13, 15, 16, 17, 18 |
| 3 | Decision making | 22, 24, 25 |
| 5 | Economic growth | 26, 28 |
| 6 | Business fluctuations | 30, 31, 32, 33 |
| 7 | Macroeconomic policy | 34, 35, 38 |

## 構成
- `index.html` — 単一ファイル（vanilla JS、外部依存なし）。これだけで動作。
- `study_site/` — ビルドソース（`shell.html` + `content.js` + `questions.js` + `app.js`）と `_qtools/`（抽出・ビルドスクリプト）。

## 出典
全ての問題・要点・用語は Canvas 配布教材のみを根拠とする。一般的な経済学知識や外部資料は使用していない。
