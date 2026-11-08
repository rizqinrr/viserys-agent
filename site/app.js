// Viserys: Interactive Control Plane & GSAP Choreography

document.addEventListener('DOMContentLoaded', () => {
  // 1. DATA DICTIONARIES FOR INTERACTIVE MODULES
  const PILLAR_DATA = {
    prd: {
      when: 'Memulai aplikasi, sistem, atau fitur baru saat belum ada dokumen kebutuhan.',
      mech: 'Design-tree interview satu pertanyaan per giliran, hipotesis eksplisit, pemetaan entitas data, dan NFR.',
      out: 'docs/PRD.md'
    },
    tasks: {
      when: 'Setelah docs/PRD.md disetujui dan siap dipecah menjadi langkah eksekusi.',
      mech: 'Dekomposisi irisan vertikal (vertical slices), urutan blokir eksplisit, dan lima gerbang verifikasi TDD.',
      out: 'tasks/<feature>/plan.md & task-*.md'
    },
    design: {
      when: 'Merancang antarmuka web, dashboard, atau aplikasi sebelum menulis komponen UI.',
      mech: 'Wawancara estetika produk, eliminasi klise AI-slop, penetapan token warna, tipografi, dan state interaktif.',
      out: 'docs/design.md'
    }
  };

  const PERSONA_DATA = {
    strategist: {
      file: 'agents/strategist.md',
      desc: 'Menyusun grafik dependensi penuh, memecah fitur menjadi irisan vertikal, dan menulis kriteria penerimaan yang dapat diuji.'
    },
    maester: {
      file: 'agents/maester.md',
      desc: 'Memeriksa kebenaran logika, keterbacaan arsitektur, batas modul, dan kesesuaian kode terhadap spesifikasi PRD.'
    },
    kingsguard: {
      file: 'agents/kingsguard.md',
      desc: 'Melakukan pemodelan ancaman (threat modeling), validasi input, pemeriksaan autentikasi, dan pencegahan kebocoran rahasia.'
    },
    prover: {
      file: 'agents/prover.md',
      desc: 'Menegakkan pola prove-it: memastikan setiap perubahan dibuktikan oleh tes otomatis yang gagal sebelum perbaikan dan lulus sesudahnya.'
    },
    racer: {
      file: 'agents/racer.md',
      desc: 'Mengaudit Core Web Vitals (LCP, INP, CLS), efisiensi kueri database, ukuran bundel, dan penghindaran render-blocking.'
    },
    artisan: {
      file: 'agents/artisan.md',
      desc: 'Menjaga hierarki visual, kontras WCAG AA, navigasi papan ketik, responsivitas lintas layar, dan kelengkapan state UI.'
    },
    chronicler: {
      file: 'agents/chronicler.md',
      desc: 'Menulis Architecture Decision Records (ADR), catatan migrasi, dokumentasi API, dan pembaruan changelog rilis.'
    }
  };

  const WORKBENCH_STAGES = {
    prd: {
      file: 'docs/PRD.md',
      confidence: 'Confidence: 90%',
      dialogue: [
        {
          role: 'user',
          speaker: 'Developer',
          text: 'Saya ingin membuat aplikasi pencatat stok gudang untuk kasir toko ritel kecil.'
        },
        {
          role: 'agent',
          speaker: 'Viserys (get-prd)',
          hypothesis: 'HIPOTESIS: Sistem pencatatan stok masuk/keluar satu layar dengan pencarian barcode cepat. CONFIDENCE AWAL: 35%.',
          text: 'Pertanyaan 1: Apakah kasir menginput barang menggunakan pemindai barcode USB di komputer kasir atau kamera ponsel di ruang gudang?',
          rec: 'Rekomendasi: Komputer kasir dengan pemindai USB karena transaksi berlangsung cepat di meja pembayaran.'
        },
        {
          role: 'user',
          speaker: 'Developer',
          text: 'Komputer meja kasir dengan scanner USB, dan harus tetap jalan walau internet toko putus sebentar.'
        },
        {
          role: 'agent',
          speaker: 'Viserys (get-prd)',
          text: 'Keyakinan naik ke 90%. Mengunci entitas Product, StockEntry, serta syarat antrean lokal (offline queue) ke dalam docs/PRD.md.'
        }
      ],
      code: `# PRD: Retail Counter Inventory Ledger

## 1. Problem Statement
Kasir toko ritel kecil sering mengalami selisih stok fisik karena pencatatan barang masuk dan keluar terpisah dari meja transaksi dan gagal tersimpan saat koneksi internet tidak stabil.

## 2. Target User & Operating Context
- Pengguna Utama: Kasir toko di meja pembayaran.
- Perangkat: Desktop browser (1280px+) dengan pemindai barcode USB (keyboard wedge).

## 3. Core Data & Entity Model
| Entity | Key Attributes | Relationships |
|---|---|---|
| Product | id (uuid), barcode (unique), name, min_stock | 1-to-many StockEntries |
| StockEntry | id, product_id, delta_qty, reason, synced_at | belongs-to Product |
| LocalQueue | id, payload_json, retry_count, status | 1-to-1 StockEntry |

## 4. Non-Functional Requirements (NFRs)
- Pencarian barcode lokal wajib selesai di bawah 50ms (IndexedDB cache).
- Mutasi stok saat offline disimpan di LocalQueue dan disinkronkan otomatis saat jaringan pulih.`
    },
    tasks: {
      file: 'tasks/inventory/task-02.md',
      confidence: '4 Vertical Slices Locked',
      dialogue: [
        {
          role: 'agent',
          speaker: 'Viserys (get-tasks)',
          hypothesis: 'MEMBACA: docs/PRD.md terverifikasi. Memetakan 3 entitas dan 2 syarat NFR ke dalam grafik tugas.',
          text: 'Memecah spesifikasi menjadi 4 irisan vertikal mandiri: Task 01 (Skema & IndexedDB), Task 02 (Pencarian Barcode <50ms), Task 03 (Mutasi Stok & Offline Queue), Task 04 (Indikator Sinkronisasi).',
          rec: 'Setiap file task dilengkapi kriteria penerimaan dan perintah verifikasi TDD.'
        },
        {
          role: 'user',
          speaker: 'Developer',
          text: 'Pastikan Task 02 menguji batas waktu pencarian 50ms dan sanitasi input barcode.'
        },
        {
          role: 'agent',
          speaker: 'Viserys (get-tasks)',
          text: 'Menulis tasks/inventory/plan.md dan tasks/inventory/task-02.md dengan gerbang pengujian performa serta keamanan input.'
        }
      ],
      code: `# Task 02: Fast Barcode Lookup Service

## Source
PRD section: "3. Core Data & Entity Model" and "4. Non-Functional Requirements"

## What This Delivers
Layanan pencarian produk berbasis IndexedDB yang mengembalikan detail barang dari pemindaian barcode USB dalam waktu kurang dari 50ms.

## Acceptance Criteria
- [ ] findByBarcode(code) mengembalikan objek Product lengkap ketika kode ditemukan.
- [ ] Mengembalikan status NOT_FOUND yang jelas ketika kode belum terdaftar.
- [ ] Menolak karakter non-alfanumerik di luar standar EAN-13/CODE-128.

## Verification Gates
- [ ] Unit test lulus: node --test tests/lookup.test.js
- [ ] Benchmark lokal: p95 waktu baca IndexedDB < 50ms untuk 25.000 SKU
- [ ] Pemeriksaan keamanan: sanitasi string input terhadap injeksi kueri

## Blocked By
Task 01 (Database Schema & IndexedDB Store Initialization)`
    },
    design: {
      file: 'docs/design.md',
      confidence: 'WCAG AAA Verified',
      dialogue: [
        {
          role: 'agent',
          speaker: 'Viserys (get-design)',
          hypothesis: 'KONTEKS VISUAL: Meja kasir di bawah lampu neon terang, operasi fokus papan ketik dan pemindai barcode.',
          text: 'Menolak pola AI-slop: tidak memakai gradien dekoratif, tidak memakai kartu melayang berbayangan tebal, dan memaksimalkan kepadatan tabel.',
          rec: 'Menggunakan angka monospace tabular agar kolom kuantitas stok sejajar sempurna.'
        },
        {
          role: 'user',
          speaker: 'Developer',
          text: 'Buat kontrasnya sangat tajam supaya kasir langsung sadar kalau ada stok yang kritis.'
        },
        {
          role: 'agent',
          speaker: 'Viserys (get-design)',
          text: 'Menetapkan token Valyrian Obsidian, indikator stok menipis dengan ikon peringatan + label teks eksplisit (bukan warna saja), dan menulis docs/design.md.'
        }
      ],
      code: `# Design Specification: Retail Counter Inventory Ledger

## 1. Aesthetic Direction & Context
- Lingkungan Kerja: Meja kasir ritel dengan pencahayaan ruang terang; navigasi penuh melalui papan ketik (Tab, Enter, Escape).
- Karakter Visual: Utilitarian, kepadatan tinggi, batas garis 1px tegas tanpa dekorasi kosong.

## 2. Design Tokens
- Base Surface: #0A0B0E (Rasio kontras teks utama 17.59:1, lolos WCAG AAA)
- Elevated Row: #12141A (Garis batas #282C37)
- Primary Accent: #E5B85B (Fokus aktif & tombol konfirmasi utama)
- Low-Stock Alert: #F87171 disertai label teks "[STOK MENIPIS]"

## 3. Typography & Scannability
- Heading & Label: Plus Jakarta Sans (600, 14px)
- Barcode & Kuantitas: JetBrains Mono (font-variant-numeric: tabular-nums)

## 4. Interactive States & Breakpoints
- Baris Input Barcode: Default, Focus Ring (2px solid #E5B85B), Offline Queued Badge, Error Banner.
- Responsivitas: Desktop 1280px (Tabel + Panel Riwayat), Tablet 768px (Satu Kolom Padat), Mobile 390px (Mode Audit Cepat).`
    }
  };

  const ADAPTER_DATA = {
    claude: {
      title: 'Claude Code Plugin & Slash Commands',
      desc: 'Mendukung penuh manifest plugin di .claude-plugin/plugin.json, lifecycle hooks, dan slash command langsung seperti /get-prd, /get-tasks, dan /get-design.',
      cmd: 'npx skills add rizqinrr/viserys-agent --agent claude-code'
    },
    antigravity: {
      title: 'Antigravity Native TOML Commands',
      desc: 'Menyediakan kontrak perintah TOML di direktori commands/ serta struktur skill standar yang langsung dikenali oleh agent.',
      cmd: 'npx skills add rizqinrr/viserys-agent --agent antigravity'
    },
    opencode: {
      title: 'OpenCode Primary Agent Adapter',
      desc: 'Buka repositori di OpenCode, tekan Tab, lalu pilih agent viserys. Konfigurasi opencode.json otomatis memuat instruksi dan jalur skill.',
      cmd: 'npx skills add rizqinrr/viserys-agent --agent opencode'
    },
    cursor: {
      title: 'Cursor & Windsurf (Agent Skills Standard)',
      desc: 'Menginstal 3 core skills langsung ke direktori aturan proyek sehingga agent merutekan permintaan spesifikasi, task, dan desain secara otomatis.',
      cmd: 'npx skills add rizqinrr/viserys-agent --agent cursor'
    },
    gemini: {
      title: 'Gemini CLI TOML Adapter',
      desc: 'Dilengkapi adaptor perintah di .gemini/commands/ yang telah tervalidasi secara struktural oleh skrip pengujian repositori.',
      cmd: 'npx skills add rizqinrr/viserys-agent --agent gemini-cli'
    }
  };

  // 2. MOBILE NAVIGATION TOGGLE (R-03, R-26, R-32)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const primaryNav = document.getElementById('primary-nav');

  if (mobileMenuBtn && primaryNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        primaryNav.classList.remove('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.focus();
      }
    });
  }

  // 3. THEME TOGGLE (ICON ONLY): OBSIDIAN DARK & CITADEL LIGHT (R-21, R-34)
  const themeToggle = document.getElementById('theme-toggle');
  const themeIconMoon = document.getElementById('theme-icon-moon');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const rootHtml = document.documentElement;

  function applyTheme(theme) {
    rootHtml.setAttribute('data-theme', theme);
    if (themeIconMoon && themeIconSun) {
      // In light mode: show moon icon (to switch to dark)
      // In dark mode: show sun icon (to switch to light)
      themeIconMoon.hidden = (theme !== 'light');
      themeIconSun.hidden = (theme !== 'dark');
    }
  }

  const savedTheme = localStorage.getItem('viserys-theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = rootHtml.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('viserys-theme', next);
    });
  }

  // 4. CLIPBOARD COPY UTILITY (ICON ONLY STATE TOGGLE)
  async function copyToClipboard(text, buttonEl) {
    const defIcon = buttonEl.querySelector('.icon-copy-default');
    const checkIcon = buttonEl.querySelector('.icon-copy-check');

    function showSuccess() {
      buttonEl.classList.add('copied');
      if (defIcon) defIcon.hidden = true;
      if (checkIcon) checkIcon.hidden = false;
      setTimeout(() => {
        buttonEl.classList.remove('copied');
        if (defIcon) defIcon.hidden = false;
        if (checkIcon) checkIcon.hidden = true;
      }, 1600);
    }

    try {
      await navigator.clipboard.writeText(text);
      showSuccess();
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showSuccess();
    }
  }

  const copyBtn = document.getElementById('copy-btn');
  const installCmd = document.getElementById('install-cmd');

  if (copyBtn && installCmd) {
    copyBtn.addEventListener('click', () => {
      copyToClipboard(installCmd.textContent.trim(), copyBtn);
    });
  }

  // 5. BENTO CELL 1: 3 CORE PILLARS SELECTOR
  const pillarBtns = document.querySelectorAll('.pillar-btn');
  const pillarWhen = document.getElementById('pillar-when');
  const pillarMech = document.getElementById('pillar-mech');
  const pillarOut = document.getElementById('pillar-out');

  pillarBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      pillarBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const key = btn.getAttribute('data-pillar');
      const info = PILLAR_DATA[key];
      if (info && pillarWhen && pillarMech && pillarOut) {
        pillarWhen.textContent = info.when;
        pillarMech.textContent = info.mech;
        pillarOut.textContent = info.out;
      }
    });
  });

  // 6. BENTO CELL 2: 7 SPECIALIST PERSONAS SELECTOR
  const councilItems = document.querySelectorAll('.council-item');
  const mandateFile = document.getElementById('mandate-file');
  const mandateDesc = document.getElementById('mandate-desc');

  councilItems.forEach((item) => {
    item.addEventListener('click', () => {
      councilItems.forEach((i) => {
        i.classList.remove('active');
        i.setAttribute('aria-selected', 'false');
      });
      item.classList.add('active');
      item.setAttribute('aria-selected', 'true');
      const key = item.getAttribute('data-persona');
      const data = PERSONA_DATA[key];
      if (data && mandateFile && mandateDesc) {
        mandateFile.innerHTML = `File: <code>${data.file}</code>`;
        mandateDesc.textContent = data.desc;
      }
    });
  });

  // 7. INTERACTIVE WORKBENCH (STAGE TABS + UI STATES + STREAMING PAUSE)
  const wbTabs = document.querySelectorAll('.wb-tab');
  const stateBtns = document.querySelectorAll('.state-btn');
  const wbViewReady = document.getElementById('wb-view-ready');
  const wbViewEmpty = document.getElementById('wb-view-empty');
  const wbViewError = document.getElementById('wb-view-error');
  const wbDialogueList = document.getElementById('wb-dialogue-list');
  const wbFileLabel = document.getElementById('wb-file-label');
  const wbCodeContent = document.getElementById('wb-code-content');
  const wbConfidence = document.getElementById('wb-confidence');
  const wbStatusDot = document.getElementById('wb-status-dot');
  const wbStatusText = document.getElementById('wb-status-text');
  const pauseStreamBtn = document.getElementById('pause-stream-btn');
  const copyArtifactBtn = document.getElementById('copy-artifact-btn');
  const emptyStartBtn = document.getElementById('empty-start-btn');
  const errorRecoverBtn = document.getElementById('error-recover-btn');

  let currentStage = 'prd';
  let currentUiState = 'ready';
  let streamTimer = null;
  let isStreamPaused = false;
  let streamCursor = 0;

  function stopStreamTimer() {
    if (streamTimer) {
      clearInterval(streamTimer);
      streamTimer = null;
    }
    isStreamPaused = false;
    if (pauseStreamBtn) {
      pauseStreamBtn.hidden = true;
      pauseStreamBtn.textContent = 'Jeda';
    }
  }

  function renderDialogue(items) {
    if (!wbDialogueList) return;
    wbDialogueList.innerHTML = '';
    items.forEach((item) => {
      const div = document.createElement('div');
      div.className = `dialogue-item role-${item.role}`;

      const speaker = document.createElement('span');
      speaker.className = 'dialogue-speaker';
      speaker.textContent = item.speaker;
      div.appendChild(speaker);

      if (item.hypothesis) {
        const hyp = document.createElement('div');
        hyp.className = 'hypothesis-box';
        hyp.textContent = item.hypothesis;
        div.appendChild(hyp);
      }

      const p = document.createElement('p');
      p.textContent = item.text;
      div.appendChild(p);

      if (item.rec) {
        const rec = document.createElement('p');
        rec.className = 'dialogue-rec';
        rec.textContent = item.rec;
        div.appendChild(rec);
      }

      wbDialogueList.appendChild(div);
    });
  }

  function updateWorkbench() {
    stopStreamTimer();
    const stageData = WORKBENCH_STAGES[currentStage];
    if (!stageData) return;

    if (wbFileLabel) wbFileLabel.textContent = stageData.file;
    if (wbConfidence) wbConfidence.textContent = stageData.confidence;
    renderDialogue(stageData.dialogue);

    if (currentUiState === 'empty') {
      if (wbViewReady) wbViewReady.hidden = true;
      if (wbViewEmpty) wbViewEmpty.hidden = false;
      if (wbViewError) wbViewError.hidden = true;
      if (wbStatusDot) wbStatusDot.className = 'status-indicator-dot';
      if (wbStatusText) wbStatusText.textContent = 'Menunggu inisialisasi dokumen spesifikasi (Empty State).';
      return;
    }

    if (currentUiState === 'error') {
      if (wbViewReady) wbViewReady.hidden = true;
      if (wbViewEmpty) wbViewEmpty.hidden = true;
      if (wbViewError) wbViewError.hidden = false;
      if (wbStatusDot) wbStatusDot.className = 'status-indicator-dot is-error';
      if (wbStatusText) wbStatusText.textContent = 'Eksekusi ditahan oleh gerbang verifikasi (Error State).';
      return;
    }

    if (wbViewReady) wbViewReady.hidden = false;
    if (wbViewEmpty) wbViewEmpty.hidden = true;
    if (wbViewError) wbViewError.hidden = true;

    if (currentUiState === 'streaming') {
      if (wbStatusDot) wbStatusDot.className = 'status-indicator-dot is-streaming';
      if (wbStatusText) wbStatusText.textContent = `Menulis artefak ${stageData.file} secara bertahap...`;
      if (pauseStreamBtn) pauseStreamBtn.hidden = false;

      const fullText = stageData.code;
      streamCursor = 0;
      if (wbCodeContent) wbCodeContent.textContent = '';

      streamTimer = setInterval(() => {
        if (isStreamPaused) return;
        streamCursor += 18;
        if (wbCodeContent) {
          wbCodeContent.textContent = fullText.slice(0, streamCursor);
        }
        if (streamCursor >= fullText.length) {
          stopStreamTimer();
          if (wbStatusDot) wbStatusDot.className = 'status-indicator-dot';
          if (wbStatusText) wbStatusText.textContent = `Penulisan ${stageData.file} selesai dan terverifikasi.`;
        }
      }, 30);
    } else {
      if (wbStatusDot) wbStatusDot.className = 'status-indicator-dot';
      if (wbStatusText) wbStatusText.textContent = `Artefak ${stageData.file} terverifikasi dan siap digunakan.`;
      if (wbCodeContent) wbCodeContent.textContent = stageData.code;
    }
  }

  wbTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      wbTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentStage = tab.getAttribute('data-stage') || 'prd';
      updateWorkbench();
    });
  });

  stateBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      stateBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentUiState = btn.getAttribute('data-state') || 'ready';
      updateWorkbench();
    });
  });

  if (pauseStreamBtn) {
    pauseStreamBtn.addEventListener('click', () => {
      isStreamPaused = !isStreamPaused;
      pauseStreamBtn.textContent = isStreamPaused ? 'Lanjutkan' : 'Jeda';
      if (wbStatusText) {
        wbStatusText.textContent = isStreamPaused
          ? 'Penulisan artefak dijeda oleh pengguna.'
          : `Melanjutkan penulisan ${WORKBENCH_STAGES[currentStage].file}...`;
      }
    });
  }

  if (emptyStartBtn) {
    emptyStartBtn.addEventListener('click', () => {
      currentStage = 'prd';
      currentUiState = 'streaming';
      wbTabs.forEach((t) => {
        const isPrd = t.getAttribute('data-stage') === 'prd';
        t.classList.toggle('active', isPrd);
        t.setAttribute('aria-selected', String(isPrd));
      });
      stateBtns.forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-state') === 'streaming');
      });
      updateWorkbench();
    });
  }

  if (errorRecoverBtn) {
    errorRecoverBtn.addEventListener('click', () => {
      currentUiState = 'ready';
      stateBtns.forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-state') === 'ready');
      });
      updateWorkbench();
    });
  }

  if (copyArtifactBtn) {
    copyArtifactBtn.addEventListener('click', () => {
      const code = WORKBENCH_STAGES[currentStage]?.code || '';
      copyToClipboard(code, copyArtifactBtn);
    });
  }

  // 8. CROSS-HARNESS ADAPTER SWITCHER
  const adapterBtns = document.querySelectorAll('.adapter-btn');
  const adapterTitle = document.getElementById('adapter-title');
  const adapterDesc = document.getElementById('adapter-desc');
  const adapterCmd = document.getElementById('adapter-cmd');
  const copyAdapterBtn = document.getElementById('copy-adapter-btn');

  if (copyAdapterBtn && adapterCmd) {
    copyAdapterBtn.addEventListener('click', () => {
      copyToClipboard(adapterCmd.textContent.trim(), copyAdapterBtn);
    });
  }

  adapterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      adapterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const key = btn.getAttribute('data-harness');
      const data = ADAPTER_DATA[key];
      if (data && adapterTitle && adapterDesc && adapterCmd) {
        adapterTitle.textContent = data.title;
        adapterDesc.textContent = data.desc;
        adapterCmd.textContent = data.cmd;
      }
    });
  });

  // 9. GSAP + SCROLLTRIGGER CHOREOGRAPHY
  if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    function splitTextNodes() {
      document.querySelectorAll('[data-split]').forEach((el) => {
        if (el.dataset.splitDone === 'true') return;
        const mode = el.getAttribute('data-split');
        const rawText = el.textContent.trim();
        el.setAttribute('aria-label', rawText);
        el.textContent = '';

        const words = rawText.split(/\s+/);
        words.forEach((word, wIdx) => {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'split-word';
          wordSpan.setAttribute('aria-hidden', 'true');

          if (mode === 'chars') {
            Array.from(word).forEach((ch) => {
              const charSpan = document.createElement('span');
              charSpan.className = 'split-char';
              charSpan.textContent = ch;
              wordSpan.appendChild(charSpan);
            });
          } else {
            wordSpan.textContent = word;
          }

          el.appendChild(wordSpan);
          if (wIdx < words.length - 1) {
            el.appendChild(document.createTextNode(' '));
          }
        });

        el.dataset.splitDone = 'true';
      });
    }

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      splitTextNodes();

      // Effect 1: Parallax Scrolling on Hero Image
      const heroImg = document.getElementById('hero-parallax-img');
      if (heroImg) {
        gsap.fromTo(
          heroImg,
          { yPercent: -6, scale: 1.1 },
          {
            yPercent: 18,
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: '#hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }

      // Effect 2: Split Text Reveal (Chars on Hero, Words on Section Titles)
      const heroChars = document.querySelectorAll('.hero-headline .split-char');
      if (heroChars.length > 0) {
        gsap.fromTo(
          heroChars,
          { yPercent: 105, opacity: 0, rotateX: -40 },
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.75,
            stagger: 0.018,
            ease: 'power3.out',
            delay: 0.1
          }
        );
      }

      document.querySelectorAll('.section-title[data-split="words"]').forEach((heading) => {
        const words = heading.querySelectorAll('.split-word');
        if (words.length > 0) {
          gsap.fromTo(
            words,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              stagger: 0.06,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: heading,
                start: 'top 86%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      });

      // Effect 3: Bento Grid Staggered Reveal
      const bentoCells = gsap.utils.toArray('.bento-cell');
      if (bentoCells.length > 0) {
        gsap.set(bentoCells, { y: 40, opacity: 0 });
        ScrollTrigger.batch(bentoCells, {
          start: 'top 88%',
          onEnter: (batch) => {
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              duration: 0.75,
              stagger: 0.12,
              ease: 'power3.out',
              overwrite: true
            });
          }
        });
      }

      // Ledger Comparison Cards Reveal
      const ledgerCols = gsap.utils.toArray('.ledger-col');
      if (ledgerCols.length > 0) {
        gsap.fromTo(
          ledgerCols,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.ledger-comparison',
              start: 'top 85%'
            }
          }
        );
      }

      // Effect 4: Magnetic Buttons with Elastic Spring Physics
      const magneticBtns = document.querySelectorAll('.magnetic-btn');
      magneticBtns.forEach((btn) => {
        const strength = parseFloat(btn.getAttribute('data-strength') || '20');
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.45, ease: 'elastic.out(1, 0.35)' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.45, ease: 'elastic.out(1, 0.35)' });

        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          xTo(relX * (strength * 0.45));
          yTo(relY * (strength * 0.45));
        });

        btn.addEventListener('mouseleave', () => {
          xTo(0);
          yTo(0);
        });
      });
    });
  }
});
