# Mentor Roadmap — MENTOR-ONLY (not published on the docs site)

Learner: you may open this, but it spoils the struggle. Please don't.

This is the backbone the mentor (any AI) uses to decide **what comes next**.
It is a plan, not a contract: adapt based on struggle logs, hint levels, incidents and
checkpoint results. Ticket text is always written fresh against the current code using
`MENTOR_PROMPT.md` section 12. Never show the "hidden concepts" column to the learner.

---

## A. Ticket seeds

### Batch 1 (written 2026-11-20) — covers months 1–3

Order is the default sequence. Each seed: symptom-style title · family (occurrence) · hidden concepts.
Mix rule: never 3 tickets in a row from the same area.

| # | Seed title (business problem) | Family | Hidden concepts |
|---|---|---|---|
| ST-001 | A new developer can't run the project | Contracts-1 | git history/recovery, deps pinning, venv, env config, docker-compose |
| — | **[PREREQUISITE] Platform stage 1** by coding agent (`platform-brief.md`) | — | learner skims PR like another team's code |
| ST-002 | Security: anyone can log in with any code (Sev2) | Trust-1 | OTP generation, hashing, expiry, attempt limits, race on verify |
| ST-003 | Users get logged out at random | Race-1 | refresh-token rotation, single-flight on client, token lifetimes |
| ST-004 | Content team needs 200 destination descriptions; AI output is sometimes broken | Partial failure-1 | LLM API, structured output, Pydantic validation, retries, timeouts, cost |
| ST-005 | SMS bill spiked; login endpoint is being abused | Trust-2 | rate limiting, sliding window (DSA), Redis counters |
| ST-006 | Last week a change broke login and nobody noticed for 2 days | Contracts-2 | pytest, fixtures, mocking, API tests, CI on PR |
| ST-007 | Business wants reports Mongo can't answer easily → design the relational model | — (design doc) | schema design, normalization, constraints, ERD, design-doc format |
| ST-008 | Move live data to PostgreSQL while traffic keeps flowing | Partial failure-2 | SQLAlchemy, Alembic, dual-write/backfill, checksums, rollback plan |
| ST-009 | Tour with 20 seats sold 23 | Race-2 | transactions, row locks vs optimistic locking, parallel-request proof |
| ST-010 | Mobile team asked to rename a booking field; invoices started failing | Contracts-3 | Kafka consumers, event schema contracts, expand/contract, replay |
| ST-011 | A user booked two trips with overlapping dates | Time-1 | intervals (DSA), SQL overlap queries, constraints |
| ST-012 | Booking for "today" rejected late at night | Time-2 | UTC vs local time, time zones end to end |
| ST-013 | User A can cancel user B's booking | Trust-3 | IDOR, ownership checks, authz tests, booking state machine actually used |
| ST-014 | Customers receive 2–3 confirmation emails | Duplicates-1 | at-least-once delivery, consumer idempotency, dedup keys, RabbitMQ acks |
| ST-015 | Price changed but website shows the old price for 10 minutes | Stale data-1 | cache invalidation, cache-aside, TTL trade-offs |
| ST-016 | Reference+Sibling: (AI) streaming bookings CSV export → (you) admin locations export | Slowness-1 | generators, StreamingResponse, memory |
| ST-017 | Admin uploads a 2-lakh-row locations CSV; it crashes or creates duplicates | Duplicates-2 | HashSet dedup (DSA), row-level errors, batch inserts, CSV injection, S3 upload |
| ST-018 | First deploy to staging: works locally, fails on the server | Contracts-4 | EC2, security groups, SSH, env/secrets (Parameter Store), CloudWatch logs |
| ST-019 | PR Review: AI-written bookings list PR (has N+1 and a missing index) | Slowness-2 | N+1, eager loading, EXPLAIN, code review |
| ST-020 | Admin search over 1 lakh locations takes 4 seconds | Slowness-3 | EXPLAIN ANALYZE, composite indexes, keyset pagination, full-text search |
| ST-021 | Owner wants revenue per month and top destinations | — (data) | GROUP BY, window functions, CTEs |
| ST-022 | Support assistant: "show my bookings / cancel my Goa trip" | Trust-4 | LLM tool calling, agent loop, guardrails, authz inside tools |
| ST-023 | "Recommended for you": top 3 matches out of 1 lakh tours, page must stay fast | Slowness-4 | heap / top-K (DSA), precomputation vs on-the-fly |
| ST-024 | Invoices are 40 minutes behind and the gap grows | Slowness-5 | consumer lag, partitions, consumer groups, scaling consumers |
| ST-025 | Reference+Sibling: (AI) email notification channel → (you) WhatsApp channel | — (LLD) | interfaces, composition, Strategy/Adapter, templates, reuse discovery |
| ST-026 | Some bookings never got an invoice | Partial failure-3 | dual-write problem, outbox pattern |
| ST-027 | One bad message stopped all invoice processing | Partial failure-4 | poison messages, retries with backoff, DLQ/dead-letter exchange |
| ST-028 | "Cancelled" processed before "created" | Race-3 | ordering, partition keys, state checks in consumers |
| ST-029 | "Calm beach trip under ₹20k" search returns nothing | — (AI) | embeddings, pgvector, hybrid search |
| ST-030 | Payment webhook delivered twice; customer charged once but booked twice | Duplicates-3 | webhook signatures, idempotency, payment flow (test mode) |

Checkpoints: at each month boundary (by date), run a 3-hour broken-system exam built from that
month's families. Checkpoint 3 = messaging exam (duplicate emails, growing lag, missing invoices).

## B. Monthly outcomes — the fixed target; tickets are generated from these

Each month = an outcome the learner must be able to **demonstrate** (checkpoint exam).
Outcomes are fixed; tickets are not. "Month" means "until the checkpoint is passed",
not the calendar — if a checkpoint fails, the month extends.

| Month | Product goal | By the checkpoint, the learner can… | Families | AI thread | Environment deepens | System design |
|---|---|---|---|---|---|---|
| 1 | Make it real | run & ship via PRs; secure OTP/JWT auth; design a relational schema and migrate live data; prevent double booking with transactions (proved by parallel test); write pytest + CI; call an LLM with validated structured output | Trust, Race, Contracts, Partial failure | structured output | Git, Docker, CI | first design doc + ADR |
| 2 | The company grows | work inside an event-driven system; fix cache staleness; build a tool-calling assistant with authz guardrails; deploy to a Linux server and debug "works locally, fails on server"; answer SDE-1 fundamentals interviews | Duplicates, Stale, Contracts, Time | tool calling / first agent | EC2, CloudWatch, S3, Parameter Store | flash-sale "scale it" |
| 3 | Messaging under fire | fix consumer lag, poison messages, duplicates, ordering, lost events (outbox); replay safely; evolve event schemas; choose Kafka vs RabbitMQ and defend it; build semantic search | Duplicates, Partial failure, Race, Slowness | embeddings + pgvector | CI/CD auto-deploy, SQS comparison | 1M-notification fan-out |
| 4 | Fast & reliable | find bottlenecks with numbers (load test, profile, EXPLAIN); add retries/timeouts/circuit breakers; metrics + alarms; build RAG with citations and honest "I don't know" | Slowness, Partial failure | RAG | RDS, metrics/alarms | read-heavy scaling |
| 5 | Money moves | integrate payments (test mode) with verified webhooks; keep booking/payment/invoice consistent (saga); reconcile with SQL; evaluate AI quality in CI | Duplicates, Partial failure, Trust | evals, hallucination measurement | Lambda, Secrets Manager | payments system mock |
| 6 | Split the monolith | extract services (and justify when not to); trace requests across services; ship an MCP server for Smart Tour | Contracts, Partial failure | MCP | ECS/ECR, ALB, tracing | service boundaries |
| 7 | Production on AWS | rebuild infra from code; handle on-call incidents and rollbacks; control AI cost/latency with caching and provider fallback | Contracts, Trust | AI in production | Terraform, VPC, IAM | multi-region "scale it" |
| 8 | Scale | scale horizontally without single-server assumptions; distributed locks/rate limits; live updates via WebSockets; streaming AI responses | Race, Stale, Slowness | streaming, AI batch via queues | autoscaling, replicas, K8s basics | 10× traffic redesign |
| 9 | Smart Tour AI | build a multi-step trip-planner agent with human confirmation; defend against prompt injection | Trust, Partial failure | agents, guardrails | — | design mocks (45 min) |
| 10 | AI you can trust | debug agents via traces; measure and improve agent success rate; choose single vs multi-agent | Trust, Slowness | tracing, eval harness | agent observability | design mocks |
| 11 | Hardening | restore from disaster; change schemas under traffic; run a security review; refactor month-1 code | all | AI security review | DR, chaos drills | design mocks |
| 12 | Show it | pass a full-day cross-stack incident exam; tell incident stories; pass DSA/LLD/system-design/behavioral mocks | all | — | — | final mocks |

## B2. Batch generation — how new tickets are created

- Section A is **batch 1**. When fewer than 5 seeds remain un-started, generate the **next batch**:
  ~12–15 seeds covering the remaining outcomes of the current month and the next one.
- Inputs: the current/next month outcomes (B), progress and struggle logs, incident-log
  times-to-root-cause per family, concept-tracker gaps, the learner's ideas inbox, and the current code.
- Each seed: title (symptom) · family (occurrence #) · area · difficulty 1–5 · prerequisites · hidden concepts.
- Check the batch covers **every** "can…" clause of the target month at least once (twice for weak areas)
  and keeps the weekly mix (backend / data / AI / infra-incident).
- Append the batch to Section A with a heading `### Batch N (generated YYYY-MM-DD)`. Keep finished seeds; mark them done.

## C. Ambient environment ladder (never a ticket of its own; arrives inside tickets)

Git/PR (from ST-001) → Docker compose (ST-001) → CI (ST-006) → EC2 + CloudWatch + Parameter Store (ST-018) →
S3 (ST-017) → RDS (phase 4) → SQS vs RabbitMQ comparison (inside a messaging ticket) → Lambda (phase 5) →
ECS/ECR/ALB (phase 6) → Terraform/VPC (phase 7). Always: billing alarm before the first AWS resource.

## D2. System design ladder (woven in; never a lecture)

- ST-007 is the first design doc (relational model) and first ADR.
- ST-008, ST-022, ST-025, ST-026 require design docs.
- "Scale it" tickets (insert roughly every 6–8 tickets):
  - after ST-009: "Flash sale: 10,000 users want 500 seats in 60 seconds" (inventory, queues, locking at scale)
  - after ST-017: "Bulk imports from 50 partner agencies daily" (async pipelines, S3, backpressure)
  - after ST-024: "Notifications for 1M users in 5 minutes" (fan-out, partitions, rate limits of providers)
  - after ST-030: "Smart Tour in 3 regions" (replication, consistency, latency)
- Phase 5+: 45-minute interview-format mocks (URL shortener → ticket booking → payments → feed → chat),
  always compared back to what was actually built in Smart Tour.
- After every COE: "which design would have prevented this?" → candidate ADR.

## D. Interview DSA pairing

Daily practice uses the pattern the learner just met: sliding window (ST-005), hashing (ST-017),
intervals (ST-011), heap/top-K (ST-023), queues/BFS (messaging), graphs/topological sort (phase 6),
binary search & two pointers (phase 4 performance work), DP basics (phase 5).
