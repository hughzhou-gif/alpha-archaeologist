// === Example Events (Page 1) ===
export const exampleEvents = [
  { title: 'VIRTUAL Pump', date: 'Oct 2024', magnitude: '+830%', query: 'VIRTUAL pumped 830% in October 2024' },
  { title: 'EDGE Rally', date: 'Feb 2026', magnitude: '+217%', query: 'EDGE rallied 217% in February 2026' },
  { title: 'MORPHO Surge', date: 'Feb 2026', magnitude: '+81%', query: 'MORPHO surged 81% in February 2026' },
]

// === Research Logs (Page 2) ===
export const researchLogs = [
  { time: '10:00:01', agent: 'Price Agent', icon: 'search', agentColor: 'var(--text-primary)', message: 'Confirmed event: PENDLE +283%, $2.41 → $9.24, Mar 1-15 2025', isHighlight: false },
  { time: '10:00:02', agent: 'Price Agent', icon: 'search', agentColor: 'var(--text-primary)', message: 'Fetching 7-day pre-event price data...', isHighlight: false },
  { time: '10:00:03', agent: 'On-Chain Agent', icon: 'anchor', agentColor: 'var(--signal-onchain)', message: 'Scanning Top 500 whale wallets for PENDLE activity...', isHighlight: false },
  { time: '10:00:05', agent: 'On-Chain Agent', icon: 'anchor', agentColor: 'var(--signal-onchain)', message: 'Found: 0x7a3...f2c accumulated 1.8M PENDLE (Feb 23-27)', isHighlight: true },
  { time: '10:00:06', agent: 'On-Chain Agent', icon: 'anchor', agentColor: 'var(--signal-onchain)', message: 'Found: 0xb91...e4d withdrew 950K PENDLE from Binance (Feb 25)', isHighlight: true },
  { time: '10:00:08', agent: 'On-Chain Agent', icon: 'anchor', agentColor: 'var(--signal-onchain)', message: 'Found: 0x4e2...a1b opened new PENDLE/ETH LP position (Feb 26)', isHighlight: true },
  { time: '10:00:09', agent: 'On-Chain Agent', icon: 'anchor', agentColor: 'var(--signal-onchain)', message: 'Scan complete. 3 relevant on-chain signals found.', isHighlight: false },
  { time: '10:00:11', agent: 'Social Agent', icon: 'message-circle', agentColor: 'var(--signal-social)', message: 'Scanning 500 KOL accounts for PENDLE mentions...', isHighlight: false },
  { time: '10:00:13', agent: 'Social Agent', icon: 'message-circle', agentColor: 'var(--signal-social)', message: 'Found: @DeFiResearcher (72% hit rate) first mentioned PENDLE (Feb 27)', isHighlight: true },
  { time: '10:00:14', agent: 'Social Agent', icon: 'message-circle', agentColor: 'var(--signal-social)', message: 'Found: @YieldMaxi posted PENDLE tokenomics deep-dive (Feb 28)', isHighlight: true },
  { time: '10:00:15', agent: 'Social Agent', icon: 'message-circle', agentColor: 'var(--signal-social)', message: 'Scan complete. 2 relevant social signals found.', isHighlight: false },
  { time: '10:00:17', agent: 'Market Agent', icon: 'bar-chart-2', agentColor: 'var(--signal-market)', message: 'Checking volume and derivatives data...', isHighlight: false },
  { time: '10:00:18', agent: 'Market Agent', icon: 'bar-chart-2', agentColor: 'var(--signal-market)', message: 'Found: Feb 28 volume 4.7x 30-day average, price only +2%', isHighlight: true },
  { time: '10:00:19', agent: 'Market Agent', icon: 'bar-chart-2', agentColor: 'var(--signal-market)', message: 'Scan complete. 1 relevant market signal found.', isHighlight: false },
  { time: '10:00:21', agent: 'Governance Agent', icon: 'landmark', agentColor: 'var(--signal-governance)', message: 'Checking Snapshot and Tally proposals...', isHighlight: false },
  { time: '10:00:22', agent: 'Governance Agent', icon: 'landmark', agentColor: 'var(--signal-governance)', message: 'Found: Snapshot proposal #47 (fee redistribution) submitted Feb 24, passed Feb 26', isHighlight: true },
  { time: '10:00:23', agent: 'Governance Agent', icon: 'landmark', agentColor: 'var(--signal-governance)', message: 'Scan complete. 1 relevant governance signal found.', isHighlight: false },
  { time: '10:00:25', agent: 'System', icon: 'check-circle', agentColor: 'var(--accent-primary)', message: 'Research complete. 8 precursor signals found across 5 sources.', isHighlight: true },
]

// Signal index: which log index triggers which signal
export const signalTriggerMap = [
  { logIndex: 3, signalIndex: 0 },
  { logIndex: 4, signalIndex: 2 },
  { logIndex: 5, signalIndex: 3 },
  { logIndex: 8, signalIndex: 4 },
  { logIndex: 9, signalIndex: 5 },
  { logIndex: 12, signalIndex: 6 },
  { logIndex: 15, signalIndex: 1 },
]

export const signals = [
  { date: 'Feb 23', type: 'onchain', description: 'Whale 0x7a3 started accumulating PENDLE', relevance: 0.88 },
  { date: 'Feb 24', type: 'governance', description: 'Snapshot proposal #47 submitted', relevance: 0.72 },
  { date: 'Feb 25', type: 'onchain', description: '0xb91 withdrew 950K PENDLE from Binance', relevance: 0.85 },
  { date: 'Feb 26', type: 'onchain', description: '0x4e2 opened new LP position', relevance: 0.65 },
  { date: 'Feb 27', type: 'social', description: '@DeFiResearcher first mention', relevance: 0.91 },
  { date: 'Feb 28', type: 'social', description: '@YieldMaxi posted deep-dive', relevance: 0.68 },
  { date: 'Feb 28', type: 'market', description: 'Volume 4.7x anomaly, price flat', relevance: 0.82 },
]

// Price data for PENDLE Feb 22 - Mar 15
export const priceData = [
  { date: 'Feb 22', price: 2.31 }, { date: 'Feb 23', price: 2.38 },
  { date: 'Feb 24', price: 2.35 }, { date: 'Feb 25', price: 2.42 },
  { date: 'Feb 26', price: 2.40 }, { date: 'Feb 27', price: 2.45 },
  { date: 'Feb 28', price: 2.50 }, { date: 'Mar 1', price: 2.85 },
  { date: 'Mar 2', price: 3.20 }, { date: 'Mar 3', price: 3.90 },
  { date: 'Mar 4', price: 4.50 }, { date: 'Mar 5', price: 5.10 },
  { date: 'Mar 6', price: 5.80 }, { date: 'Mar 7', price: 6.30 },
  { date: 'Mar 8', price: 6.90 }, { date: 'Mar 9', price: 7.50 },
  { date: 'Mar 10', price: 8.20 }, { date: 'Mar 11', price: 8.70 },
  { date: 'Mar 12', price: 8.90 }, { date: 'Mar 13', price: 9.10 },
  { date: 'Mar 14', price: 9.20 }, { date: 'Mar 15', price: 9.24 },
]

// === Pattern Data (Page 3) ===
export const patternData = {
  id: '#P-2025-031',
  name: 'Silent Accumulation + Catalyst',
  signals: [
    { id: 'A', timeWindow: 'Day -7 to -4', sourceType: 'onchain', description: '2+ independent whale wallets accumulate target token' },
    { id: 'B', timeWindow: 'Day -5 to -3', sourceType: 'governance', description: 'Governance proposal OR dev release published' },
    { id: 'C', timeWindow: 'Day -3 to -1', sourceType: 'social', description: 'First high-SNR KOL mention (historical accuracy >60%)' },
    { id: 'D', timeWindow: 'Day -1 to 0', sourceType: 'market', description: 'Volume spike >3x average, price flat' },
  ],
  metadata: { window: '7 days', minSignals: '3 of 4 (Signal A mandatory)', sourceEvent: 'PENDLE +283%, Mar 2025' },
  reasoning: 'These four signals appeared in strict chronological order during the PENDLE event. Whale accumulation always appears first — they have information advantage and act before the market. The catalyst (governance proposal passing) confirms the fundamental change in the middle. KOL mention is a leading indicator of retail attention. The final volume-price divergence signals that informed players are building positions while price hasn\'t reacted. This four-phase sequence is not coincidence — each step logically triggers the next.',
}

// === Validation Logs (Page 4) ===
export const validationLogs = [
  // Phase: setup
  { time: '11:00:01', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Starting validation of Pattern #P-2025-031 "Silent Accumulation + Catalyst"', isHighlight: false, highlightColor: null, phase: 'setup' },
  { time: '11:00:02', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Scanning all >50% pump events in past 12 months... Found 47', isHighlight: false, highlightColor: null, phase: 'setup' },
  { time: '11:00:03', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Checking which events were preceded by this pattern...', isHighlight: false, highlightColor: null, phase: 'setup' },

  // Phase: positive — PENDLE
  { time: '11:00:05', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Checking event #1: PENDLE +283%, Mar 2025', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:06', agent: 'On-Chain', icon: 'anchor', agentColor: 'var(--signal-onchain)', message: '→ Found 2 whale wallets accumulating → Signal A ✅', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:07', agent: 'Governance', icon: 'landmark', agentColor: 'var(--signal-governance)', message: '→ Found governance proposal → Signal B ✅', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:08', agent: 'Social', icon: 'message-circle', agentColor: 'var(--signal-social)', message: '→ Found high-SNR KOL mention → Signal C ✅', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:09', agent: 'Market', icon: 'bar-chart-2', agentColor: 'var(--signal-market)', message: '→ Found volume anomaly → Signal D ✅', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:10', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'PENDLE: 4/4 signals matched → ✅ HIT', isHighlight: true, highlightColor: 'green', phase: 'positive', event: { token: 'PENDLE', date: 'Mar 2025', change: '+283%', matched: 4, type: 'hit' } },

  // AAVE
  { time: '11:00:12', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Checking event #2: AAVE +92%, Nov 2024', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:13', agent: 'On-Chain', icon: 'anchor', agentColor: 'var(--signal-onchain)', message: '→ Found 2 whale wallets accumulating → Signal A ✅', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:14', agent: 'Governance', icon: 'landmark', agentColor: 'var(--signal-governance)', message: '→ Found governance proposal → Signal B ✅', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:15', agent: 'Social', icon: 'message-circle', agentColor: 'var(--signal-social)', message: '→ Found @CryptoKOL first mention → Signal C ✅', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:16', agent: 'Market', icon: 'bar-chart-2', agentColor: 'var(--signal-market)', message: '→ No volume anomaly found → Signal D ❌', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:17', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'AAVE: 3/4 signals matched → ✅ HIT', isHighlight: true, highlightColor: 'green', phase: 'positive', event: { token: 'AAVE', date: 'Nov 2024', change: '+92%', matched: 3, type: 'hit' } },

  // UNI
  { time: '11:00:19', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Checking event #3: UNI +67%, Sep 2024', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:20', agent: 'On-Chain', icon: 'anchor', agentColor: 'var(--signal-onchain)', message: '→ Found 3 whale wallets accumulating → Signal A ✅', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:21', agent: 'Social', icon: 'message-circle', agentColor: 'var(--signal-social)', message: '→ Found high-SNR KOL mention → Signal C ✅', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:22', agent: 'Market', icon: 'bar-chart-2', agentColor: 'var(--signal-market)', message: '→ Found volume spike → Signal D ✅', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:23', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'UNI: 3/4 signals matched → ✅ HIT', isHighlight: true, highlightColor: 'green', phase: 'positive', event: { token: 'UNI', date: 'Sep 2024', change: '+67%', matched: 3, type: 'hit' } },

  // LDO
  { time: '11:00:25', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Checking event #4: LDO +54%, Aug 2024', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:26', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'LDO: 3/4 signals matched → ✅ HIT', isHighlight: true, highlightColor: 'green', phase: 'positive', event: { token: 'LDO', date: 'Aug 2024', change: '+54%', matched: 3, type: 'hit' } },

  // COMP
  { time: '11:00:28', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Checking event #5: COMP +78%, Jul 2024', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:29', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'COMP: 3/4 signals matched → ✅ HIT', isHighlight: true, highlightColor: 'green', phase: 'positive', event: { token: 'COMP', date: 'Jul 2024', change: '+78%', matched: 3, type: 'hit' } },

  // SNX — MISS
  { time: '11:00:31', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Checking event #6: SNX +61%, Jun 2024', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:32', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'SNX: 2/4 signals matched (below threshold 3) → ❌ MISS', isHighlight: true, highlightColor: 'gray', phase: 'positive', event: { token: 'SNX', date: 'Jun 2024', change: '+61%', matched: 2, type: 'miss' } },

  // CRV — MISS
  { time: '11:00:34', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Checking event #7: CRV +89%, May 2024', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:35', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'CRV: 2/4 signals matched (below threshold 3) → ❌ MISS', isHighlight: true, highlightColor: 'gray', phase: 'positive', event: { token: 'CRV', date: 'May 2024', change: '+89%', matched: 2, type: 'miss' } },

  // MKR — MISS
  { time: '11:00:37', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Checking event #8: MKR +112%, Apr 2024', isHighlight: false, highlightColor: null, phase: 'positive' },
  { time: '11:00:38', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'MKR: 2/4 signals matched (below threshold 3) → ❌ MISS', isHighlight: true, highlightColor: 'gray', phase: 'positive', event: { token: 'MKR', date: 'Apr 2024', change: '+112%', matched: 2, type: 'miss' } },

  { time: '11:00:40', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Positive scan complete: 8 pattern appearances, 5 hits', isHighlight: false, highlightColor: null, phase: 'positive' },

  // Phase: negative
  { time: '11:00:42', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Searching for pattern appearances with no >50% pump within 14 days...', isHighlight: false, highlightColor: null, phase: 'negative' },
  { time: '11:00:44', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Oct 2024: SUSHI — 3/4 signals → 14 days later +8% → ❌ FALSE POSITIVE', isHighlight: true, highlightColor: 'red', phase: 'negative', event: { token: 'SUSHI', date: 'Oct 2024', change: '+8%', matched: 3, type: 'falsePositive' } },
  { time: '11:00:46', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Jul 2024: BAL — 3/4 signals → 14 days later -3% → ❌ FALSE POSITIVE', isHighlight: true, highlightColor: 'red', phase: 'negative', event: { token: 'BAL', date: 'Jul 2024', change: '-3%', matched: 3, type: 'falsePositive' } },
  { time: '11:00:48', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Apr 2024: YFI — 3/4 signals → 14 days later +12% → ❌ FALSE POSITIVE', isHighlight: true, highlightColor: 'red', phase: 'negative', event: { token: 'YFI', date: 'Apr 2024', change: '+12%', matched: 3, type: 'falsePositive' } },
  { time: '11:00:50', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Negative scan complete: 3 false positives', isHighlight: false, highlightColor: null, phase: 'negative' },

  // Phase: result
  { time: '11:00:52', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Hit Rate: 5/8 = 62.5% (threshold >50%) → ✅ PASS', isHighlight: true, highlightColor: 'green', phase: 'result' },
  { time: '11:00:53', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'False Positive Rate: 3/8 = 37.5% (threshold <40%) → ✅ PASS', isHighlight: true, highlightColor: 'green', phase: 'result' },
  { time: '11:00:54', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Lift: 62.5% / 19.1% baseline = 3.27x (threshold >2x) → ✅ PASS', isHighlight: true, highlightColor: 'green', phase: 'result' },
  { time: '11:00:55', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--text-primary)', message: 'Sample Size: 8 (threshold ≥5) → ✅ PASS', isHighlight: true, highlightColor: 'green', phase: 'result' },
  { time: '11:00:57', agent: 'Validator', icon: 'flask-conical', agentColor: 'var(--accent-primary)', message: '══ PATTERN VALIDATED ══', isHighlight: true, highlightColor: 'green', phase: 'result' },
]

// Scatter data for backtest chart — events positioned by date
export const backtestEvents = [
  { date: 'Mar 2025', x: 11, token: 'PENDLE', change: '+283%', matched: 4, type: 'hit' },
  { date: 'Nov 2024', x: 7, token: 'AAVE', change: '+92%', matched: 3, type: 'hit' },
  { date: 'Sep 2024', x: 5, token: 'UNI', change: '+67%', matched: 3, type: 'hit' },
  { date: 'Aug 2024', x: 4, token: 'LDO', change: '+54%', matched: 3, type: 'hit' },
  { date: 'Jul 2024', x: 3, token: 'COMP', change: '+78%', matched: 3, type: 'hit' },
  { date: 'Jun 2024', x: 2, token: 'SNX', change: '+61%', matched: 2, type: 'miss' },
  { date: 'May 2024', x: 1, token: 'CRV', change: '+89%', matched: 2, type: 'miss' },
  { date: 'Apr 2024', x: 0, token: 'MKR', change: '+112%', matched: 2, type: 'miss' },
  { date: 'Oct 2024', x: 6, token: 'SUSHI', change: '+8%', matched: 3, type: 'falsePositive' },
  { date: 'Jul 2024', x: 3.3, token: 'BAL', change: '-3%', matched: 3, type: 'falsePositive' },
  { date: 'Apr 2024', x: 0.3, token: 'YFI', change: '+12%', matched: 3, type: 'falsePositive' },
]

export const validationMetrics = [
  { label: 'Hit Rate', value: 62.5, unit: '%', threshold: '>50%', passed: true },
  { label: 'False Positive Rate', value: 37.5, unit: '%', threshold: '<40%', passed: true },
  { label: 'Lift', value: 3.27, unit: 'x', threshold: '>2x', passed: true },
  { label: 'Sample Size', value: 8, unit: '', threshold: '≥5', passed: true },
]

// === Action Card Data (Page 5) — multiple opportunities ===
export const actionCards = [
  {
    token: 'PENDLE',
    matchProgress: { confirmed: 3, total: 4 },
    signals: [
      { name: 'Whale accumulation', status: 'confirmed', detail: '0x7a3 accumulated 1.8M PENDLE (Feb 23-27)' },
      { name: 'Governance proposal', status: 'confirmed', detail: 'Snapshot #47 fee redistribution (Feb 24)' },
      { name: 'KOL first mention', status: 'confirmed', detail: '@DeFiResearcher posted analysis (Feb 27)' },
      { name: 'Volume spike', status: 'waiting', detail: '>3x average volume, price flat' },
    ],
    winRate: 62.5,
    avgMove: '+127%',
    avgLead: '4.2 days',
    sourceCases: ['PENDLE Mar\'25', 'AAVE Nov\'24'],
    alertDate: 'Feb 28',
    moveDate: 'Mar 1',
    proofText: 'If you received this Alert on Feb 28, 2025, PENDLE started moving 3 days later and ultimately pumped +283%.',
  },
  {
    token: 'EIGEN',
    matchProgress: { confirmed: 3, total: 4 },
    signals: [
      { name: 'Whale accumulation', status: 'confirmed', detail: '0xd4f accumulated 2.1M EIGEN across 3 wallets' },
      { name: 'Governance proposal', status: 'confirmed', detail: 'EIP proposal for restaking rewards passed' },
      { name: 'KOL first mention', status: 'confirmed', detail: '@EigenInsider posted thread on tokenomics' },
      { name: 'Volume spike', status: 'waiting', detail: '>3x average volume, price flat' },
    ],
    winRate: 62.5,
    avgMove: '+127%',
    avgLead: '4.2 days',
    sourceCases: ['AAVE Nov\'24', 'COMP Jul\'24'],
    alertDate: null,
    moveDate: null,
    proofText: null,
  },
  {
    token: 'ETHFI',
    matchProgress: { confirmed: 2, total: 4 },
    signals: [
      { name: 'Whale accumulation', status: 'confirmed', detail: '0xa21 withdrew 800K ETHFI from Binance' },
      { name: 'Governance proposal', status: 'waiting', detail: 'Governance proposal OR dev release' },
      { name: 'KOL first mention', status: 'confirmed', detail: '@LidoMaxi posted ETHFI analysis' },
      { name: 'Volume spike', status: 'waiting', detail: '>3x average volume, price flat' },
    ],
    winRate: 62.5,
    avgMove: '+127%',
    avgLead: '4.2 days',
    sourceCases: ['LDO Aug\'24', 'UNI Sep\'24'],
    alertDate: null,
    moveDate: null,
    proofText: null,
  },
]

export const proofPriceData = priceData
