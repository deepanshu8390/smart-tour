# [PREREQUISITE] Platform Stage 1 — brief for the coding agent

Paste this to the coding agent **after ST-001 is merged**.

```
ROLE: You are building the "existing company platform" for a learning project.
Repo: smart-tour (FastAPI + MongoDB + Next.js). Work on branch platform/stage-1.
Open a PR at the end. Small, meaningful commits.

GOAL: Make the system look like a real startup's backend, written quickly
and NAIVELY. Simple, conventional code. Do NOT add robustness.

BUILD:
1. Use the dependency setup created in ST-001; add only what you need.
2. docker-compose profiles. The default profile must stay under ~3 GB RAM
   (the laptop has 6 GB):
   - default: api, mongo, redis
   - events:  redpanda (single node, low memory), rabbitmq, mailpit, workers
   - db:      postgres (empty, unused for now)
3. On successful booking creation, publish a JSON event "booking.created"
   to Kafka (redpanda) directly from the service. NO outbox pattern.
4. Consumers, each as a separate worker process:
   - notification-consumer: reads booking.created, pushes a message to a
     RabbitMQ queue "emails"
   - email-worker: reads "emails", sends via SMTP to mailpit
   - invoice-consumer: reads booking.created, stores a simple invoice record
   - analytics-consumer: counts bookings per location
   Use auto-commit/auto-ack defaults. No retries, no DLQ, no dedup.
5. Redis cache for GET /locations/{id} with a 10-minute TTL.
   No invalidation on update.
6. scripts/traffic.py: continuously creates users/bookings via the API.
7. Two smoke tests (health, create booking) + a GitHub Actions workflow
   that runs them.
8. README: how to run each profile; a simple architecture diagram.

DO NOT:
- Fix OTP/auth, add rate limiting, add seat capacity or transactions,
  migrate Mongo to Postgres, add idempotency/outbox/retries/DLQ,
  add cache invalidation, or write a broad test suite.
- Change existing business logic except adding the event publish call.
- Intentionally plant bugs.
```

After merge: the learner skims the PR like another team's code (who talks to whom),
then the mentor rewrites upcoming tickets against the new platform.
