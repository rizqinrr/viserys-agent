# Skill Catalog

Viserys memiliki 29 skills. Deskripsi di `SKILL.md` menentukan kapan agent memuat workflow secara otomatis.

## DEFINE

| Skill | Gunakan ketika |
|---|---|
| `get-prd` | Memulai aplikasi/sistem dan membutuhkan interview + PRD |
| `idea-refine` | Ide masih kasar dan membutuhkan alternatif |
| `interview-me` | Intent belum jelas dan perlu pertanyaan satu per satu |
| `spec-driven-development` | Feature/perubahan signifikan belum punya spec |
| `constraint-driven-development` | Quality bar belum tertulis atau checks sedang disiasati |

## PLAN

| Skill | Gunakan ketika |
|---|---|
| `get-schema` | PRD approved membutuhkan desain database |
| `get-tasks` | PRD/spec perlu dipecah menjadi task files |
| `planning-and-task-breakdown` | Spec perlu task terurut dengan acceptance criteria |

## BUILD

| Skill | Gunakan ketika |
|---|---|
| `incremental-implementation` | Perubahan multi-file perlu thin slices |
| `test-driven-development` | Mengubah behavior atau memperbaiki bug |
| `context-engineering` | Context perlu ditata atau kualitas output menurun |
| `source-driven-development` | Correctness bergantung pada official docs |
| `doubt-driven-development` | Stakes tinggi atau keputusan perlu adversarial review |
| `get-design` | Visual direction belum selesai atau UI perlu anti-AI-slop review |
| `frontend-ui-engineering` | Mengimplementasikan UI berdasarkan design direction approved |
| `api-and-interface-design` | Mendesain API, contract, atau module boundary |

## VERIFY

| Skill | Gunakan ketika |
|---|---|
| `browser-testing-with-devtools` | Memverifikasi browser behavior dan rendered UI |
| `debugging-and-error-recovery` | Test/build gagal atau behavior tidak sesuai |

## REVIEW

| Skill | Gunakan ketika |
|---|---|
| `code-review-and-quality` | Sebelum merge |
| `code-simplification` | Behavior benar tetapi kode terlalu kompleks |
| `security-and-hardening` | Menangani input, auth, data, atau integration |
| `performance-optimization` | Ada requirement atau regression performa |

## SHIP

| Skill | Gunakan ketika |
|---|---|
| `git-workflow-and-versioning` | Mengatur perubahan, commit, branch, version |
| `ci-cd-and-automation` | Membuat/modifikasi pipeline |
| `deprecation-and-migration` | Menghapus sistem lama atau memigrasikan users |
| `documentation-and-adrs` | Mendokumentasikan keputusan atau public API |
| `observability-and-instrumentation` | Menambah logs, metrics, traces, alerts |
| `shipping-and-launch` | Menyiapkan production rollout dan rollback |

## META

| Skill | Gunakan ketika |
|---|---|
| `using-agent-skills` | Memilih workflow yang tepat |

## Cara invoke

Automatic:

```text
Audit landing page ini karena layoutnya terasa generic dan AI-generated.
```

Explicit:

```text
Gunakan get-design critique untuk landing page ini.
```

Command wrapper:

```text
/get-design critique landing page
```

Tidak semua skill memiliki command. Command adalah shortcut, bukan syarat untuk memakai skill.
