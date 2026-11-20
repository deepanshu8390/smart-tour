# Mentor Roadmap — MENTOR-ONLY (not published on the docs site)

Learner: you may open this, but it spoils the struggle. Please don't.

This is the backbone the mentor (any AI) uses to decide **what comes next**.
It is a plan, not a contract: adapt based on struggle logs, hint levels, incidents and
checkpoint results. Ticket text is always written fresh against the current code using
`MENTOR_PROMPT.md` section 12. Never show the "hidden concepts" column to the learner.

---

## A. Ticket backlog (seeds) — first ~3 months

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

## B. Phase backbone (months 4–12) — expand into seeds when Section A runs low

| Phase | Product goal | Families to repeat | AI thread | Ambient environment deepens |
|---|---|---|---|---|
| 4 | Fast & reliable | Slowness, Partial failure | RAG over policies/FAQs with citations, "I don't know" | load testing, profiling, metrics/alarms, RDS |
| 5 | Money moves | Duplicates, Partial failure, Trust | evals for assistant + RAG in CI | payments, saga, reconciliation SQL, Lambda, Secrets Manager |
| 6 | Split the monolith | Contracts, Partial failure | MCP server for Smart Tour | services, gateway, tracing, ECS/ECR, ALB |
| 7 | Production on AWS | Contracts, Trust | AI cost/latency, provider fallback, LLM caching | Terraform, VPC, IAM deep, on-call drills, billing incident |
| 8 | Scale | Race, Stale data, Slowness | streaming responses, AI batch jobs via queues | replicas, distributed locks, WebSockets, autoscaling, K8s basics |
| 9 | Smart Tour AI | Trust, Partial failure | trip-planner agent with human confirmation, prompt-injection defense | system design practice |
| 10 | AI you can trust | Trust, Slowness | agent tracing, eval harness, single vs multi-agent | observability for agents |
| 11 | Hardening | all | security review of AI features | DR restore, zero-downtime migrations, chaos drills, revisit month-1 code |
| 12 | Show it | all | — | final full-day incident exam, interview stories, mock interviews |

## C. Ambient environment ladder (never a ticket of its own; arrives inside tickets)

Git/PR (from ST-001) → Docker compose (ST-001) → CI (ST-006) → EC2 + CloudWatch + Parameter Store (ST-018) →
S3 (ST-017) → RDS (phase 4) → SQS vs RabbitMQ comparison (inside a messaging ticket) → Lambda (phase 5) →
ECS/ECR/ALB (phase 6) → Terraform/VPC (phase 7). Always: billing alarm before the first AWS resource.

## D. Interview DSA pairing

Daily practice uses the pattern the learner just met: sliding window (ST-005), hashing (ST-017),
intervals (ST-011), heap/top-K (ST-023), queues/BFS (messaging), graphs/topological sort (phase 6),
binary search & two pointers (phase 4 performance work), DP basics (phase 5).
