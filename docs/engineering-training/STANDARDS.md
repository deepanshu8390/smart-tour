# Engineering Standards — non-negotiable

"It works" is not done. A solution that works but violates these standards is
**rejected in review** and redone. When two standards conflict, write the trade-off
in the design note and get it approved.

## 1. Design principles

- **Single responsibility**: one reason to change per class/module. Routers stay thin;
  business rules live in services; storage lives behind repositories.
- **SOLID**, applied with judgment — no abstraction without a second real use case (YAGNI).
- **Composition over inheritance** unless there is a true "is-a" relationship.
- **Dependency injection** at boundaries; no hidden global state, no import-time side effects.
- **DRY with care**: remove duplicated *knowledge*, not coincidentally similar lines.
- **Explicit over clever**. Readable names, small functions, no magic values.
- **Fail fast, fail loud**: validate at the boundary, never swallow exceptions silently.
- **Design for change**: ask "what happens when this requirement changes?" in every design note.

## 2. API standards

- REST resource naming, correct HTTP methods and status codes (RFC 9110 semantics).
- One consistent error format (RFC 9457 "Problem Details" style: type, title, status, detail).
- Pagination, filtering and sorting on every list endpoint; cursor pagination at scale.
- Idempotency for unsafe retried operations (Idempotency-Key).
- Backward compatibility: never break existing clients; version (`/v1`) or expand-and-contract.
- OpenAPI docs accurate and generated from code.

## 3. Data standards

- Schema changes only through migrations; every migration reversible or with a rollback plan.
- Constraints in the database (NOT NULL, UNIQUE, FK, CHECK), not only in code.
- Every query on a hot path has an index justified by `EXPLAIN`.
- Transactions around multi-step writes; state the isolation level and why.
- Store time in UTC; money as integer minor units (paise) or Decimal, never float.

## 4. Security (OWASP API Top 10 as the baseline)

- Authorization checked on every resource access (no IDOR).
- Secrets only from environment/secret manager; never in code, logs or git.
- Hash secrets and one-time codes; least-privilege IAM; rate limits on abuse-prone endpoints.
- Validate and sanitise all input, including files (CSV injection, size limits).

## 5. Code quality

- Python: PEP 8, type hints everywhere, `ruff` lint + format clean, `mypy` clean for new code.
- JavaScript: ESLint clean; no unused code.
- No commented-out code, no TODO without a ticket number.

## 6. Testing

- Test pyramid: many unit tests, fewer integration tests, few end-to-end tests.
- Every bug fix ships with a regression test that failed before the fix.
- Edge cases from the design note's test-case list are all covered.
- Tests are deterministic: no real network, no sleeping, no order dependence.

## 7. Observability and operations

- Structured logs (JSON) with request/correlation IDs; never log secrets or personal data.
- Metrics and alarms for every new critical path; health and readiness checks.
- Runbook entry for every new failure mode.
- Twelve-Factor App configuration (config in env, stateless processes, logs as streams).

## 8. Git and delivery

- Branch per ticket; never commit to `master`.
- Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`), messages say *what and why*.
- PR template: summary · why · design link · testing done · risk · blast radius · rollback.
- CI must be green before merge. Small PRs (< ~400 changed lines) where possible.

## 9. Design documents

Required for any ticket that adds a component, changes a data model, or crosses services.

```
1. Problem & context        6. Detailed design (API, data model, flows, diagrams)
2. Requirements             7. Scale estimate (QPS, storage, growth) & bottlenecks
   (functional / non-func)  8. Failure modes & how each is handled
3. Non-goals                9. Security & privacy
4. Alternatives considered  10. Rollout, migration & rollback plan
5. Chosen approach + why    11. Metrics that prove it works
```

Significant decisions are also recorded as an **ADR** in `decisions/ADR-xxx.md`
(context · decision · alternatives · consequences).
