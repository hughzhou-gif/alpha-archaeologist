# Alpha Archaeologist — Frontend PRD

## Overview

Alpha Archaeologist is an auto-research system for crypto alpha discovery. Users input a past crypto event, and the system runs a 6-step pipeline: research the event's precursor signals, extract a recurring pattern, validate it against history, scan the current market for matches, and present actionable alerts.

The frontend is a 6-page linear presentation, designed for hackathon demo. No backend — all data is mocked. Desktop-only (1440px+).

## Tech Stack

React 18, Vite, Tailwind CSS 4, Recharts, Framer Motion, Lucide React

## Design System

Uses the Surf Design System (dark theme). Key principles:
- Glassmorphism reserved for featured elements only (pattern card, action cards, metric cards)
- Secondary containers use flat dark backgrounds
- Lucide outline icons throughout (no emoji)
- All spacing on 4px grid
- Phase-specific accent colors: blue (Dig), green/red (Validate), pink (Scan/Act)

## Navigation

6 pages in fixed linear order. Navigation methods:
- Step indicator dots at top center (6 dots with hover tooltips showing page names)
- Keyboard arrow keys (left/right)
- "Next step" buttons that appear after each page's animation completes
- "Skip" buttons on animation-heavy pages for instant completion

Page transitions: horizontal slide with opacity fade, 400ms.

---

## Page 1: Input

**Goal**: User describes a past crypto alpha event to analyze.

**Flow**:
1. User sees title "Alpha Archaeologist", tagline, and a search input
2. User types a custom event description, OR clicks one of 3 preset example cards
3. Submitting (Enter / arrow button / example click) advances to Page 2

**Components**:
- Text input (640px wide) with inline submit button
- 3 example cards: PENDLE +283% Mar 2025, AI16Z +500% Jan 2025, ENA +45% Feb 2025
- Footer: "Powered by Surf"

**Entry animations**: Title fades in, input slides up, example cards stagger in.

---

## Page 2: Dig (Research)

**Goal**: Show the AI agent system researching what happened before the event. This is the first of three auto-research demonstrations.

**Flow**:
1. Page loads and log playback starts automatically
2. Left panel: research log streams 18 entries from 5 agents (Price, On-Chain, Social, Market, Governance)
3. Right panel: price chart (PENDLE Feb 22–Mar 15) is always visible. Below it, signal cards appear in sync with log discoveries
4. Each time a log entry discovers a signal, the corresponding signal card springs into the right panel
5. Bottom progress bar tracks agent completion
6. When all logs finish: progress bar shows "Research complete. 8 signals found across 5 sources.", "Extract Pattern" button appears

**Components**:
- ResearchLog: terminal-style scrolling log. Highlighted rows have colored left border matching the agent
- Signal Timeline: Recharts area chart + signal card list
- Progress bar with shimmer animation
- Skip button (top-right, visible during playback)

**Agents and their icons**:
- Price Agent (Search icon) — confirms the event
- On-Chain Agent (Anchor icon) — scans whale wallets
- Social Agent (MessageCircle icon) — scans KOL mentions
- Market Agent (BarChart2 icon) — checks volume anomalies
- Governance Agent (Landmark icon) — checks proposals

**Signal data (7 signals)**:
1. Feb 23, on-chain: Whale 0x7a3 started accumulating PENDLE (88% relevance)
2. Feb 24, governance: Snapshot proposal #47 submitted (72%)
3. Feb 25, on-chain: 0xb91 withdrew 950K from Binance (85%)
4. Feb 26, on-chain: 0x4e2 opened LP position (65%)
5. Feb 27, social: @DeFiResearcher first mention (91%)
6. Feb 28, social: @YieldMaxi deep-dive (68%)
7. Feb 28, market: Volume 4.7x anomaly, price flat (82%)

**Log playback**: 800–1500ms random interval per entry. Skip button instantly completes.

**Accent color**: Blue (progress bar, next button use signal-onchain color)

---

## Page 3: Extract (Pattern Card)

**Goal**: Present the distilled pattern as a structured, collectible-style card.

**Flow**:
1. Page loads, card flips in (3D rotateY animation)
2. 4 signal nodes appear one at a time with animated dashed connectors between them
3. Metadata grid shows at bottom of card: Time Window, Min Signals, Source Event
4. "Why this pattern?" toggle below the card (collapsed by default)
5. After all nodes appear, "Validate Pattern" button fades in

**Components**:
- Pattern card (600px) with gradient border (pink → purple)
- 4 SignalNode items with colored left borders by source type
- Dashed animated connectors between nodes
- Collapsible reasoning panel
- Skip not needed (animation is short)

**Pattern data**:
- ID: #P-2025-031
- Name: "Silent Accumulation + Catalyst"
- Signal A: Day -7 to -4, on-chain — 2+ whale wallets accumulate
- Signal B: Day -5 to -3, governance — proposal or dev release
- Signal C: Day -3 to -1, social — first high-SNR KOL mention (accuracy >60%)
- Signal D: Day -1 to 0, market — volume spike >3x, price flat
- Min signals: 3 of 4 (Signal A mandatory)

**Reasoning text**: Explains the causal chain — whales act first (information advantage), catalyst confirms fundamental change, KOL signals retail attention, volume-price divergence = informed positioning before price reaction.

---

## Page 4: Validate (Backtest)

**Goal**: Run a second auto-research pass — this time validating the pattern against 12 months of historical data. Demonstrates that the system uses research to validate research.

**Flow**:
1. Log playback starts automatically (3 phases)
2. Phase 1 — Positive Scan: checks 8 events that matched the pattern. For each: logs agent checks, then verdict (HIT or MISS). Event card appears on right panel.
3. Phase 2 — Negative Scan (Control Test): checks 3 cases where pattern appeared but no pump followed (FALSE POSITIVE).
4. Phase 3 — Results: 4 pass/fail metrics calculated live.
5. After logs complete: bottom section slides up with 4 metric cards (count-up animation) + verdict banner.

**Components**:
- ValidateLog: terminal log with phase separators ("Positive Scan", "Negative Scan", "Results")
- Backtest event card list: each card shows token name, price change, 4-dot signal match bar, HIT/MISS/FALSE POS badge
- Empty state: "Waiting for results..." with spinner (shown before first event card appears)
- 4 MetricCards with count-up animation and green/red pass/fail borders
- VerdictBanner: green "PATTERN VALIDATED" or red "PATTERN REJECTED"
- Skip button

**Backtest data (11 events)**:
- Hits (5): PENDLE +283% 4/4, AAVE +92% 3/4, UNI +67% 3/4, LDO +54% 3/4, COMP +78% 3/4
- Misses (3): SNX +61% 2/4, CRV +89% 2/4, MKR +112% 2/4
- False positives (3): SUSHI +8% 3/4, BAL -3% 3/4, YFI +12% 3/4

**Final metrics**:
- Hit Rate: 62.5% (>50%) PASS
- False Positive Rate: 37.5% (<40%) PASS
- Lift: 3.27x (>2x) PASS
- Sample Size: 8 (>=5) PASS
- Verdict: PATTERN VALIDATED

**Log playback**: 400–800ms per entry (faster pace than Dig). Skip button instantly completes.

---

## Page 5: Scan (Market Scanner)

**Goal**: Third auto-research pass — scans the current market for tokens actively matching the validated pattern.

**Flow**:
1. Log playback starts automatically
2. Left panel: scan log shows the scanner checking each signal type across candidate tokens
3. Right panel: starts empty with spinner "Scanning 2,847 tokens...", then token cards appear as they're discovered
4. 3 tokens found: PENDLE (3/4), EIGEN (3/4), ETHFI (2/4)
5. After completion: "View Alerts" button appears

**Components**:
- ScanLog: terminal log (21 entries)
- Token cards: each shows token name, match count badge, mini progress bar, colored signal type tags (On-Chain, Gov, Social, + pending count)
- Scan progress bar at bottom with percentage
- Loading spinner placeholder
- Skip button

**Scan log sequence**:
1. Scanner loads the validated pattern
2. On-Chain agent scans 500 tokens → finds 5 with whale accumulation
3. Governance agent checks 5 candidates → 2 have proposals (PENDLE, EIGEN)
4. Social agent scans KOLs → 3 have mentions (PENDLE, EIGEN, ETHFI)
5. Market agent checks volume → no spikes yet (all pending)
6. Final: 3 tokens matching

**Log playback**: 500–1000ms per entry. Skip button instantly completes.

---

## Page 6: Act (Action Cards)

**Goal**: Present the final output — an actionable feed of tokens currently matching the pattern, ranked by signal completion.

**Flow**:
1. Title: "3 tokens matching Pattern #P-2025-031"
2. 3 accordion-style action cards appear one at a time
3. First card (PENDLE) auto-expands after all cards appear
4. User can click any card to expand/collapse (one at a time)

**Components**:
- ActionCard (accordion): collapsed = token name + progress bar + match count. Expanded = signal list + stats + proof chart
- MatchProgressBar: 4-segment bar, filled segments solid, unfilled segments pulse
- Signal rows: confirmed signals show CircleCheck icon + detail text, waiting signals show Clock icon + "waiting..."
- Stats row: Win Rate, Avg Move, Avg Lead
- Proof mini-chart (PENDLE only): price chart with two dashed vertical lines marking "Alert sent" (Feb 28) and "Price moved" (Mar 1), with shaded area between them
- First card has gradient border (pink → green), others have subtle default border

**Action card data (3 tokens)**:
1. PENDLE — 3/4 confirmed (whale + governance + social, volume waiting). Has proof chart showing the historical validation.
2. EIGEN — 3/4 confirmed (whale + governance + social, volume waiting). No proof chart.
3. ETHFI — 2/4 confirmed (whale + social, governance + volume waiting). No proof chart.

**Shared stats**: Win Rate 62.5%, Avg Move +127%, Avg Lead 4.2 days

**This is the final page. No "next" button.**

---

## Three-Layer Auto-Research Narrative

The core demo narrative for hackathon judges:

| Step | Research Target | Research Question | Page |
|------|----------------|-------------------|------|
| Dig | A single event | "What signals preceded this event?" | Page 2 |
| Validate | The pattern itself | "Does this pattern recur reliably in history?" | Page 4 |
| Scan | Current market | "Which tokens are matching this pattern right now?" | Page 5 |

Each step is a complete auto-research loop. Each step's conclusion feeds into the next. This is recursive automated research — the system uses research to validate research to scan for new opportunities.

---

## Global UX Patterns

**Skip buttons**: Pages 2, 4, 5 have "Skip" buttons (top-right) that instantly complete the log animation and show the final state. Critical for demo replay.

**Step indicator tooltips**: Hovering over any navigation dot shows the page name (Input, Dig, Extract, Validate, Scan, Act).

**Keyboard navigation**: Left/Right arrow keys move between pages. Enter/Space activates focused buttons and accordion cards.

**Icon system**: All UI icons use Lucide React (outline style, 14–16px, strokeWidth 1.5). No emoji in UI. Agent types each have a distinct Lucide icon.

**Log playback pattern**: Used on 3 pages (2, 4, 5). Each follows the same structure: auto-start on mount → entries appear at random intervals → highlights on key discoveries → skip button for instant completion → next-step button appears on finish.
