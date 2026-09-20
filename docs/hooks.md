# Hooks

Viserys core skills tidak membutuhkan runtime. Hooks bersifat optional dan menambah behavior otomatis pada harness yang mendukungnya.

## SessionStart

`hooks/session-start.sh` memuat meta-skill `using-agent-skills` saat sesi dimulai sehingga agent mengecek skill sebelum bekerja.

Dependencies:

- Bash-compatible shell.
- `jq` untuk parsing envelope tertentu.

Tanpa hook, skills tetap tersedia; agent hanya tidak mendapat automatic SessionStart injection dari hook tersebut.

## SDD cache

Lihat [`../hooks/SDD-CACHE.md`](../hooks/SDD-CACHE.md) untuk mekanisme cache spec-driven development.

## Simplify ignore

Lihat [`../hooks/SIMPLIFY-IGNORE.md`](../hooks/SIMPLIFY-IGNORE.md) untuk ignore behavior pada code simplification.

## Safety

- Review hook sebelum menjalankannya pada checkout asing.
- Jangan menyimpan secret di hook config atau output.
- Pastikan command tersedia pada OS target.
- Hook failure tidak boleh diam-diam dianggap verification success.
