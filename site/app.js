// Viserys — Interactive Showcase Script

document.addEventListener('DOMContentLoaded', () => {
  // 1. Copy to Clipboard for Install Command
  const copyBtn = document.getElementById('copy-btn');
  const installCmd = document.getElementById('install-cmd');

  if (copyBtn && installCmd) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(installCmd.innerText.trim());
        copyBtn.classList.add('copied');
        copyBtn.querySelector('.copy-text').innerText = 'Copied!';
        copyBtn.querySelector('.copy-icon').innerText = '✓';

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.querySelector('.copy-text').innerText = 'Copy';
          copyBtn.querySelector('.copy-icon').innerText = '📋';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    });
  }

  // 2. Tab Switcher for 3-Pillar Interactive Simulator
  const tabs = document.querySelectorAll('.sim-tab');
  const panels = document.querySelectorAll('.sim-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      // Update tabs active state
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels active state
      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
});

