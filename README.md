# Alpha Archaeologist

**Autonomous alpha discovery engine for crypto markets.**

Alpha Archaeologist is an AI-powered research system that reverse-engineers historical crypto pump events, extracts repeatable patterns, validates them against 12 months of on-chain data, and scans the live market for tokens currently matching those patterns.

## How It Works

The system runs a 6-stage autonomous pipeline:

### 1. Dig
Multi-agent research swarm (on-chain, social, market, news) simultaneously analyzes a historical pump event. Each agent surfaces precursor signals — whale accumulations, KOL mentions, volume anomalies, governance proposals — that appeared before the price move.

### 2. Extract
Distills 30-70 raw signals into a structured 3-4 condition pattern with specific time windows, strength thresholds, and signal categories. Each pattern is a testable hypothesis about what precedes a significant pump.

### 3. Validate (Autoresearch)
Backtests the pattern against all >30% pump events in the past 12 months using SQL-driven on-chain screening. The autoresearch engine autonomously tunes condition thresholds across multiple iterations — tightening whale transfer ratios, adjusting volume multipliers, relaxing or removing weak conditions — until the pattern achieves statistical significance (>40% hit rate, >4x lift vs. baseline).

### 4. Scan
Deploys the validated pattern as a real-time market scanner. SQL queries check current on-chain activity, DEX volumes, and social signals across 2,800+ tokens. Tokens matching 2+ conditions are flagged as candidates.

### 5. Act
Generates actionable alerts ranked by match quality. Each card shows confirmed vs. pending conditions, historical win rate, average move size, and average lead time. Designed for immediate use in a trading workflow.

## Architecture

- **Backend**: Python (FastAPI + Uvicorn), SSE streaming, multi-threaded pipeline
- **Frontend**: React + Vite, Framer Motion animations, Recharts, real-time SSE integration
- **Data Sources**: On-chain SQL (Ethereum, Base, Arbitrum), social sentiment APIs, market structure feeds, news aggregation
- **Validation**: Parameterized backtesting with autonomous threshold optimization (autoresearch)

## Evaluation & Backtesting

Every pattern produced by Alpha Archaeologist is rigorously validated before deployment. The system includes a full evaluation harness (`eval_harness.py`) that runs systematic backtests across large token sets:

- **13-case test suite** covering tokens across DeFi, L2, AI, and memecoin sectors (MORPHO, VIRTUAL, EDGE, HYPE, AERO, KAITO, AIXBT, etc.)
- **Multi-round evaluation**: each case runs the full Dig → Extract → Validate pipeline, with results compared across runs for consistency
- **SQL-driven screening** against 12 months of on-chain data across Ethereum, Base, and Arbitrum — no synthetic or simulated data
- **Autoresearch**: autonomous parameter tuning (up to 10 iterations per pattern) that mutates threshold values, tests against real outcomes, and keeps only statistically significant improvements
- **Outcome verification**: every pattern match is checked against actual price data — did the token pump >30% within 14 days? No forward-looking bias.
- **Confidence tiers**: matches are scored by multi-condition alignment (2+ SQL conditions), social confirmation, and single-condition signals, with results reported separately per tier

The validation pipeline produces a full audit trail: SQL queries executed, candidates screened, outcome results per token, autoresearch mutations tried, and final pass/fail metrics (hit rate, false positive rate, lift, sample size).

## Quick Start

```bash
# Backend
pip install -r requirements.txt
python server.py  # Runs on :8888

# Frontend
cd frontend
npm install
npm run dev  # Runs on :5173
```

Click any example card on the homepage for an instant cached demo, or type any token name to trigger a live pipeline run.

## Built With

Built at a hackathon in one session. Powered by [Surf](https://surf.tech) data infrastructure.
