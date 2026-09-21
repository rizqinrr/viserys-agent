# Hooks

Viserys core skills tidak membutuhkan runtime. Hooks bersifat optional dan menambah automatic behavior hanya pada harness yang mendukung lifecycle hook tersebut. Repository saat ini menyediakan konfigurasi hook yang terutama ditujukan untuk Claude plugin lifecycle.

## Wiring

`hooks/hooks.json` mendaftarkan event `SessionStart` dan mencoba menjalankan:

```text
${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh
```

Bila file tidak ditemukan, config mencoba fallback project path:

```text
${CLAUDE_PROJECT_DIR}/.claude/hooks/session-start.sh
```

Command diakhiri `|| true`, sehingga kegagalan locating atau execution tidak memblokir session. Konsekuensinya: session dapat tetap berjalan tanpa context injection; keberhasilan session bukan bukti bahwa hook berhasil.

## SessionStart behavior

`hooks/session-start.sh` membaca `skills/using-agent-skills/SKILL.md`, lalu menghasilkan standard SessionStart JSON envelope dengan meta-skill sebagai `additionalContext`.

Tujuan hook:

- mengingatkan agent untuk memeriksa skill sebelum bekerja;
- mempertahankan skill routing discipline sejak awal sesi;
- tidak mengubah behavior atau source project.

## Prerequisite

- Bash-compatible shell.
- `jq` pada `PATH` untuk membangun JSON envelope yang valid.
- Plugin/project path environment variables yang sesuai dengan harness.

Pada Windows, PowerShell saja tidak cukup untuk menjalankan shell script; gunakan environment yang menyediakan Bash dan `jq` bila hook dibutuhkan.

## Ketika `jq` tidak tersedia

Script mengembalikan envelope valid yang menjelaskan bahwa `jq` tidak ditemukan, lalu exit `0`. Skills tetap tersedia secara individual; hanya automatic meta-skill injection yang tidak terjadi.

## Ketika meta-skill tidak ditemukan

Script tetap mengembalikan envelope valid dengan warning bahwa `using-agent-skills` tidak ditemukan. Karena hook config bersifat non-blocking, session terus berjalan.

## Testing

Jalankan hook tests dari Bash-compatible environment:

```bash
bash hooks/session-start-test.sh
bash hooks/simplify-ignore-test.sh
```

CI utama saat ini berfokus pada validators dan Claude plugin installation; hook test dapat dijalankan lokal bila perubahan menyentuh `hooks/`.

## SDD cache

Lihat [`../hooks/SDD-CACHE.md`](../hooks/SDD-CACHE.md) untuk mekanisme cache spec-driven development dan batas freshness-nya.

## Simplify ignore

Lihat [`../hooks/SIMPLIFY-IGNORE.md`](../hooks/SIMPLIFY-IGNORE.md) untuk ignore behavior pada code simplification.

## Harness boundaries

- **Claude Code:** config dan environment variable hook dirancang untuk plugin/project lifecycle Claude.
- **OpenCode, Gemini, Antigravity, OMP, Codex:** jangan menganggap hook otomatis aktif. Gunakan mechanism lifecycle masing-masing hanya setelah adapter khusus tersedia dan diverifikasi.
- Skills, commands, dan personas tidak bergantung pada keberhasilan hook.

## Safety

- Review hook sebelum menjalankannya pada checkout asing.
- Jangan menyimpan secret di hook config atau output.
- Pastikan Bash dan `jq` berasal dari environment terpercaya.
- Bedakan session success dari hook success karena config menelan failure dengan `|| true`.
- Bila hook output diperlukan sebagai evidence, jalankan script/test secara langsung dan periksa envelope-nya.
