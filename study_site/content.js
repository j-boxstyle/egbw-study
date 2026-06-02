// EGBW textbook / summary / glossary content — derived from Canvas slides & exercises
// (Cowen & Tabarrok, Modern Principles of Economics 5e). Source: Canvas only.
window.CONTENT = {
  weeks: [
    {w:1, title:"Demand and supply", chs:[5,6,8,9,10],
     summary:[
      "Ch5 Elasticities: 弾力性 = %ΔQ / %ΔP。需要が非弾力的(|E|<1)なら値上げで総収入↑、弾力的(|E|>1)なら値上げで総収入↓。供給は投入コストを上げずに生産拡大できるほど弾力的。",
      "Ch6 Taxes & subsidies: 税の負担(incidence)は法律上の課税対象ではなく弾力性で決まる。より非弾力的な側が大きな負担を負う。死荷重(DWL)は取引が減ることで発生。補助金は逆に過剰取引を生む。",
      "Ch8 Price ceilings & floors: 上限価格(均衡以下)は不足・品質低下・行列・資源の誤配分・取引利益の損失を生む。下限価格(均衡以上)は余剰を生む(例: 最低賃金→失業)。",
      "Ch9 International trade: 自由貿易は消費者余剰を増やし総余剰を最大化。関税は輸入を減らし国内生産↑・消費↓、政府は税収を得るが死荷重が発生。",
      "Ch10 Externalities: 外部費用があると市場均衡は過剰生産。効率的産出はMSB=MSCの点。ピグー税(外部費用に等しい)でDWL消去。コースの定理: 取引費用が低く所有権が明確なら当事者間交渉で効率化。"
     ]},
    {w:2, title:"Firms and factor markets", chs:[13,15,16,17,18],
     summary:[
      "Ch13 Monopoly: 利潤最大化は MR=MC。価格は需要曲線上で決まり P>MC。完全競争に比べ産出↓・価格↑で死荷重発生。価格差別で消費者余剰を奪い利潤↑。自然独占は規模の経済による。",
      "Ch15 Oligopoly: 少数企業。カルテルは独占のように振る舞うが、各社に裏切り(増産)の誘因があり不安定。ゲーム理論: 支配戦略=相手が何をしても最善の戦略。ナッシュ均衡=誰も一方的に戦略を変える誘因がない状態。",
      "Ch16 Competing for monopoly / network goods: ネットワーク財は独占・寡占で供給されがち。競争は『市場内』ではなく『市場をめぐる』もの。標準化戦争が起こり、必ずしも最良の製品が勝つとは限らない。",
      "Ch17 Monopolistic competition: 多数企業が似て非なる製品を販売(製品差別化)。自由参入により長期では利潤ゼロ、P=AC。革新の誘因が高い。",
      "Ch18 Labor markets: 労働需要は限界生産物価値(MPL)から導かれる。企業は『労働者の限界収入>賃金』の限り雇用。統計的差別=集団平均の情報を個人に当てはめること。教育は生産性を高めるため高賃金。"
     ]},
    {w:3, title:"Decision making for businesses and consumers", chs:[22,24,25],
     summary:[
      "Ch22 Managing incentives: 『支払うもの』と『望むもの』が近いほど強い誘因が有効。測定・監視が難しい場合は弱い誘因の方が良いことも。トーナメント=相対評価に基づく報酬。",
      "Ch24 Asymmetric information: 逆選択=取引前の情報非対称(レモン市場)。モラルハザード=取引後の隠れた行動(不要な修理など)。シグナリング=情報を持つ側が高コストの行動で情報を開示。",
      "Ch25 Consumer choice: 限界効用逓減。効用最大化は各財の『1ドルあたり限界効用(MU/P)』が等しく、所得を使い切る点。価格変化は代替効果(相対価格)と所得効果(実質購買力)に分解。労働供給曲線が後方屈折するのは所得効果が代替効果を上回るとき。"
     ]},
    {w:5, title:"Economic growth", chs:[26,28],
     summary:[
      "Ch26 GDP/output measurement: 実質GDP per capita が生活水準の最良指標。名目GDPは当年価格、実質GDPは基準年価格。GDP成長率=(今年−去年)/去年。支出アプローチ: GDP=C+I+G+NX。輸出は生産国のGDPに計上。",
      "Ch28 Solow growth model: 生産関数 Y=F(A,K,eL)。A=技術知識。資本には収穫逓減があり、貯蓄=減耗となる定常状態に収束。同じ定常状態を持つ国では貧しい国ほど速く成長(キャッチアップ成長=資本蓄積)。最先端成長(cutting-edge)=技術進歩によるもので無限には続かない。Solowは生活水準の約3/4が良いアイデアによると推定。"
     ]},
    {w:6, title:"Business fluctuations", chs:[30,31,32,33],
     summary:[
      "Ch30 AD-AS: 長期総供給(LRAS)はSolow成長率で垂直(長期の貨幣中立性)。短期総供給(SRAS)は右上がり。AD成長=実質GDP成長+インフレ。賃金が硬直的だと貨幣供給増は短期に実質GDPを上げるが長期はインフレのみ。",
      "Ch31 Business fluctuations: 景気変動=実質GDPの長期トレンド周りの動き。実質ショック(生産性)と名目ショック(貨幣・支出)。時間的集中(time bunching)・不確実性・取り返しのつかない投資が変動を増幅。小さな負のショックでも大きな景気後退を起こしうる。",
      "Ch32 Unemployment: 摩擦的失業=求職と求人のマッチングに伴う短期失業。構造的失業=経済構造変化による長期失業。循環的失業=景気による。失業率=失業者/労働力。労働力参加率=労働力/成人人口。最低賃金は均衡賃金が低い市場でより大きな失業を生む。",
      "Ch33 Inflation: 貨幣数量説 M+v=P+Y(成長率表記)。vとYが一定ならM増→P増。実質金利=名目金利−インフレ率(フィッシャー式)。予想外のデフレは貸し手が得し借り手が損。累進課税ではインフレが税負担を上げる。"
     ]},
    {w:7, title:"Macroeconomic policy and institutions", chs:[34,35,38],
     summary:[
      "Ch34 Central banks & monetary policy: 中央銀行(Fed)の手段=公開市場操作・準備金への付利。Fedが最も制御できるのはフェデラルファンド金利。Fedが債券購入→マネタリーベース↑・短期金利↓・投資↑・AD↑。貨幣乗数=準備1ドルあたりの貨幣供給拡大量(≈1/準備率)。金融政策は6〜18か月のラグ。インフレ目標=政策ルールの例。",
      "Ch35/38 International finance: 為替レート、増価/減価。購買力平価(PPP): 同じ財は共通通貨で同価格。経常収支赤字↔資本収支黒字。輸出>輸入なら貿易黒字。低貯蓄率や他国の貯蓄過剰(savings glut)は米国の経常赤字・資本黒字・貿易赤字の一因。不況下では減価をもたらす金融緩和が有効。"
     ]}
  ],
  // glossary: English term + Japanese definition (Canvas-derived)
  glossary: [
    {ch:5, en:"Price elasticity of demand", ja:"需要の価格弾力性。%ΔQ÷%ΔP。|E|>1で弾力的、|E|<1で非弾力的。"},
    {ch:5, en:"Elasticity of supply", ja:"供給の価格弾力性。投入価格を大きく上げずに生産拡大できるほど大きい(弾力的)。"},
    {ch:5, en:"Total revenue test", ja:"非弾力的なら値上げで総収入↑、弾力的なら値上げで総収入↓。"},
    {ch:5, en:"Midpoint method", ja:"弾力性計算で始点と終点の中点を分母に用いる方法。"},
    {ch:6, en:"Tax incidence", ja:"税の実質負担の分かれ方。より非弾力的な側が大きく負担する。"},
    {ch:6, en:"Deadweight loss (DWL)", ja:"死荷重。税・規制などで失われる取引利益(余剰)。"},
    {ch:6, en:"Wedge (tax wedge)", ja:"課税により買い手価格と売り手価格の間に生じる差。"},
    {ch:8, en:"Price ceiling", ja:"上限価格。均衡以下に設定すると不足・行列・品質低下・資源の誤配分を生む。"},
    {ch:8, en:"Price floor", ja:"下限価格。均衡以上に設定すると余剰を生む(例: 最低賃金と失業)。"},
    {ch:8, en:"Shortage", ja:"不足。需要量>供給量。上限価格の典型的帰結。"},
    {ch:9, en:"Tariff", ja:"関税。輸入を減らし国内価格↑・生産↑・消費↓、政府は税収、死荷重発生。"},
    {ch:9, en:"Gains from trade", ja:"貿易の利益。自由貿易は総余剰を最大化する。"},
    {ch:10, en:"Negative externality", ja:"負の外部性。市場均衡が社会的に過剰生産になる。"},
    {ch:10, en:"Pigouvian tax", ja:"ピグー税。外部費用に等しい税を課し死荷重を消去する。"},
    {ch:10, en:"Coase theorem", ja:"コースの定理。取引費用が低く所有権が明確なら当事者交渉で効率的解決が可能。"},
    {ch:13, en:"Monopoly", ja:"独占。MR=MCで産出を決め P>MC。死荷重を生む。"},
    {ch:13, en:"Marginal revenue (MR)", ja:"限界収入。独占では価格より低い。MR=MCで利潤最大化。"},
    {ch:13, en:"Price discrimination", ja:"価格差別。支払意思額に応じ価格を変え消費者余剰を奪う。"},
    {ch:13, en:"Natural monopoly", ja:"自然独占。規模の経済で1社生産が最も低コストになる状態。"},
    {ch:15, en:"Cartel", ja:"カルテル。独占的に振る舞う供給者集団。裏切りの誘因で不安定。"},
    {ch:15, en:"Nash equilibrium", ja:"ナッシュ均衡。誰も一方的に戦略を変える誘因がない状態。"},
    {ch:15, en:"Dominant strategy", ja:"支配戦略。相手の行動に関係なく常に最善となる戦略。"},
    {ch:16, en:"Network good", ja:"ネットワーク財。利用者が多いほど価値が高まる財。市場をめぐる競争。"},
    {ch:16, en:"Standard war", ja:"標準化戦争。規格の覇権争い。最良の製品が必ず勝つとは限らない。"},
    {ch:17, en:"Monopolistic competition", ja:"独占的競争。多数企業が差別化された製品を販売、長期はP=AC。"},
    {ch:17, en:"Product differentiation", ja:"製品差別化。似て非なる製品で需要曲線を右下がりにする。"},
    {ch:18, en:"Marginal product of labor (MPL)", ja:"労働の限界生産物。労働需要曲線の基礎。"},
    {ch:18, en:"Statistical discrimination", ja:"統計的差別。集団平均の情報を用いて個人を判断すること。"},
    {ch:18, en:"Compensating differential", ja:"補償賃金格差。労働条件の差を埋める賃金の違い。"},
    {ch:22, en:"Tournament (pay)", ja:"トーナメント。相対的成果に基づく報酬体系。"},
    {ch:22, en:"Incentive scheme", ja:"誘因設計。『支払う対象』が『望む成果』に近いほど強い誘因が有効。"},
    {ch:24, en:"Adverse selection", ja:"逆選択。取引前の情報非対称(レモン市場)。"},
    {ch:24, en:"Moral hazard", ja:"モラルハザード。取引後の隠れた行動(例: 不要な修理)。"},
    {ch:24, en:"Signaling", ja:"シグナリング。高コストの行動で情報を開示すること。"},
    {ch:25, en:"Diminishing marginal utility", ja:"限界効用逓減。追加1単位の価値は前の単位より小さい。"},
    {ch:25, en:"Utility maximization", ja:"効用最大化。各財のMU/Pが等しく所得を使い切る点。"},
    {ch:25, en:"Substitution effect", ja:"代替効果。相対価格変化による消費量の変化。"},
    {ch:25, en:"Income effect", ja:"所得効果。実質購買力変化による消費量の変化。"},
    {ch:26, en:"Real GDP", ja:"実質GDP。基準年価格で評価。生活水準比較に用いる。"},
    {ch:26, en:"Nominal GDP", ja:"名目GDP。当年価格で評価。"},
    {ch:26, en:"GDP per capita", ja:"一人当たりGDP。実質値が生活水準の最良指標。"},
    {ch:26, en:"National spending approach", ja:"支出アプローチ。GDP=C+I+G+NX。"},
    {ch:28, en:"Solow growth model", ja:"ソロー成長モデル。Y=F(A,K,eL)。資本は収穫逓減。"},
    {ch:28, en:"Steady state", ja:"定常状態。貯蓄=減耗で資本が一定になる点。"},
    {ch:28, en:"Catching-up growth", ja:"キャッチアップ成長。資本蓄積による。貧国ほど速い。"},
    {ch:28, en:"Cutting-edge growth", ja:"最先端成長。技術進歩による。無限には続かない。"},
    {ch:30, en:"LRAS", ja:"長期総供給。Solow成長率で垂直(貨幣中立性)。"},
    {ch:30, en:"SRAS", ja:"短期総供給。右上がり。賃金硬直性による。"},
    {ch:30, en:"Aggregate demand (AD)", ja:"総需要。AD成長=実質GDP成長+インフレ。"},
    {ch:31, en:"Real shock", ja:"実質ショック。生産性など実物要因の変動。"},
    {ch:31, en:"Time bunching", ja:"時間的集中。好況時に投資・労働が集中し変動を増幅。"},
    {ch:32, en:"Frictional unemployment", ja:"摩擦的失業。マッチングに伴う短期失業。"},
    {ch:32, en:"Labor force participation rate", ja:"労働力参加率=労働力÷成人人口。"},
    {ch:32, en:"Unemployment rate", ja:"失業率=失業者÷労働力。"},
    {ch:33, en:"Quantity theory of money", ja:"貨幣数量説。M+v=P+Y(成長率)。"},
    {ch:33, en:"Fisher effect", ja:"フィッシャー効果。実質金利=名目金利−インフレ率。"},
    {ch:33, en:"Disinflation", ja:"ディスインフレ。インフレ率の低下(物価は上昇継続)。"},
    {ch:34, en:"Open market operations", ja:"公開市場操作。Fedの債券売買による貨幣供給調整。"},
    {ch:34, en:"Federal funds rate", ja:"フェデラルファンド金利。Fedが最も制御できる短期金利。"},
    {ch:34, en:"Money multiplier", ja:"貨幣乗数。準備1ドルあたりの貨幣供給拡大量(≈1/準備率)。"},
    {ch:34, en:"Monetary base", ja:"マネタリーベース。流通現金+銀行準備。"},
    {ch:38, en:"Purchasing power parity (PPP)", ja:"購買力平価。同一財は共通通貨で同価格になるという理論。"},
    {ch:38, en:"Appreciation / Depreciation", ja:"増価/減価。通貨価値の上昇/下落。"},
    {ch:38, en:"Current account", ja:"経常収支。赤字は資本収支黒字と対応。"},
    {ch:38, en:"Trade deficit", ja:"貿易赤字。輸入>輸出。"}
  ]
};
window.CONTENT.chapterTitles = {5:"Elasticities",6:"Taxes & subsidies",8:"Price ceilings & floors",9:"International trade",10:"Externalities",13:"Monopoly",15:"Oligopoly",16:"Competing for monopoly (network goods)",17:"Monopolistic competition",18:"Labor markets",22:"Managing incentives",24:"Asymmetric information",25:"Consumer choice",26:"GDP & output measurement",28:"Solow growth model",30:"Aggregate demand & supply",31:"Business fluctuations",32:"Unemployment",33:"Inflation & quantity theory",34:"Central banks & monetary policy",35:"Monetary policy & shocks",38:"International finance"};
