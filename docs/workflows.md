# Workflow Recipes

Viserys tidak memaksa semua task melewati seluruh lifecycle. Gunakan workflow terkecil yang tetap memberi bukti cukup.

## Aplikasi atau sistem baru

```text
/get-prd
→ /get-schema bila ada persistent data
→ /get-tasks
→ incremental-implementation
→ test-driven-development
→ /review
→ /ship
```

### Output

- PRD approved.
- Schema document bila relevan.
- Task files dengan dependencies dan acceptance criteria.
- Implementasi per vertical slice.
- Verification evidence dan launch decision.

`get-schema` opsional untuk produk tanpa database atau ketika schema sudah approved.

## Feature dengan requirement yang cukup jelas

```text
/spec → /plan → /build → /test → /review → /ship
```

Gunakan ini ketika feature scope sudah cukup dipahami dan tidak membutuhkan product discovery panjang.

### Output canonical

```text
SPEC.md atau docs/SPEC.md
tasks/plan.md
tasks/todo.md
```

## Bug fix

```text
debugging-and-error-recovery
→ test-driven-development
→ code-review-and-quality
```

Urutannya:

1. Reproduce.
2. Localize root cause.
3. Tulis regression test yang gagal.
4. Implement minimum fix.
5. Jalankan focused dan full tests.
6. Review perubahan.

## UI baru atau redesign

```text
/get-design shape <target>
→ frontend-ui-engineering
→ browser-testing-with-devtools
→ /review
→ /webperf bila relevan
→ /ship
```

`get-design` menentukan visual direction dan anti-AI-slop quality. `frontend-ui-engineering` mengimplementasikan component architecture, state, accessibility, dan responsive behavior. `browser-testing-with-devtools` memberi runtime evidence.

Untuk evaluasi tanpa edit:

```text
/get-design critique <target>
/get-design audit <target>
```

## Security-sensitive feature

```text
/spec atau /get-prd
→ security-and-hardening
→ doubt-driven-development
→ incremental-implementation
→ test-driven-development
→ security-auditor
→ /ship
```

Gunakan explicit human gates untuk auth, permissions, destructive migrations, payments, secrets, dan tindakan irreversible.

## API atau public interface

```text
/spec
→ api-and-interface-design
→ planning-and-task-breakdown
→ incremental-implementation
→ test-driven-development
→ documentation-and-adrs
→ /review
```

Dokumentasikan compatibility, error contract, versioning, dan migration path.

## Pre-release web application

```text
/review
→ /webperf
→ /ship
```

`/webperf` terpisah karena tidak semua project memiliki browser-facing output. `/ship` menggabungkan code quality, security, test coverage, infrastructure, documentation, dan rollback readiness.

## High-stakes decision

Tambahkan `doubt-driven-development` ketika correctness lebih penting daripada kecepatan, terutama pada codebase asing, production migration, security logic, atau tindakan irreversible.

## Automatic routing versus command

Gunakan command ketika kamu ingin workflow dan output tertentu. Gunakan natural-language routing ketika kamu ingin Viserys menentukan workflow:

```text
Bantu aku membuat API pagination yang backward-compatible.
```

Agent dapat memilih:

```text
spec-driven-development
→ api-and-interface-design
→ incremental-implementation
→ test-driven-development
```

## Checkpoints

Setiap workflow selesai hanya bila:

- acceptance criteria terpenuhi;
- test/build/typecheck/lint yang relevan lulus;
- runtime behavior diverifikasi bila ada UI atau integration;
- perubahan tetap dalam scope;
- residual risk disebutkan;
- rollback tersedia untuk perubahan berisiko.
