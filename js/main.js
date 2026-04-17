/**
 * Git 가이드 - 메인 인터랙션 스크립트
 */

/* ===== 테마 토글 ===== */
(function initTheme() {
  const saved = localStorage.getItem('git-guide-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('git-guide-theme', next);

  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}

/* ===== 프로그레스바 ===== */
function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = Math.min(progress, 100) + '%';
}

/* ===== 사이드바 네비게이션 ===== */
function initSidebar() {
  const sections = document.querySelectorAll('.guide-section[id]');
  const navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const isActive = link.getAttribute('data-section') === id;
            link.classList.toggle('active', isActive);
          });
        }
      });
    },
    { rootMargin: '-10% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));

  // 클릭 시 스크롤
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-section');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // 모바일: 사이드바 닫기
        closeMobileMenu();
      }
    });
  });
}

/* ===== 모바일 메뉴 ===== */
function toggleMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const toggle = document.querySelector('.menu-toggle');

  if (!sidebar) return;

  const isOpen = sidebar.classList.toggle('open');
  toggle?.classList.toggle('open', isOpen);
  overlay?.classList.toggle('visible', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const toggle = document.querySelector('.menu-toggle');

  sidebar?.classList.remove('open');
  toggle?.classList.remove('open');
  overlay?.classList.remove('visible');
  document.body.style.overflow = '';
}

/* ===== 탭 그룹 ===== */
function initTabs() {
  document.querySelectorAll('.tab-group').forEach((group) => {
    const buttons = group.querySelectorAll('.tab-btn');
    const panes = group.querySelectorAll('.tab-pane');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');

        buttons.forEach((b) => b.classList.remove('active'));
        panes.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = group.querySelector(`.tab-pane[data-tab="${target}"]`);
        if (targetPane) targetPane.classList.add('active');
      });
    });
  });
}

/* ===== 아코디언 ===== */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      if (item) item.classList.toggle('open');
    });
  });
}

/* ===== 코드블록 복사 버튼 ===== */
function initCodeCopy() {
  document.querySelectorAll('.code-block').forEach((block) => {
    const code = block.querySelector('code');
    const btn = block.querySelector('.code-copy-btn');
    if (!code || !btn) return;

    btn.addEventListener('click', async () => {
      const text = code.innerText || code.textContent;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // 폴백
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      btn.classList.add('copied');
      btn.innerHTML = '✓ 복사됨';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '📋 복사';
      }, 2000);
    });
  });
}

/* ===== 힌트 토글 ===== */
function initHints() {
  document.querySelectorAll('.hint-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      if (!content) return;

      const isOpen = content.classList.toggle('open');
      btn.innerHTML = isOpen ? '🔼 힌트 숨기기' : '💡 힌트 보기';
    });
  });
}

/* ===== 체크리스트 (localStorage) ===== */
function initChecklists() {
  const STORAGE_KEY = 'git-guide-checklist';
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  // 저장된 상태 복원
  document.querySelectorAll('.checklist input[type="checkbox"]').forEach((cb) => {
    const id = cb.id;
    if (id && saved[id] !== undefined) {
      cb.checked = saved[id];
    }

    cb.addEventListener('change', () => {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      current[cb.id] = cb.checked;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      updateSidebarProgress();
    });
  });

  updateSidebarProgress();
}

function updateSidebarProgress() {
  const all = document.querySelectorAll('.checklist input[type="checkbox"]');
  const checked = document.querySelectorAll('.checklist input[type="checkbox"]:checked');
  const total = all.length;
  const done = checked.length;

  const label = document.querySelector('.sidebar-progress-label');
  const value = document.querySelector('.sidebar-progress-value');

  if (label) label.textContent = `${done} / ${total} 완료`;
  if (value) value.textContent = total > 0 ? Math.round((done / total) * 100) + '%' : '0%';
}

/* ===== 초기화 ===== */
document.addEventListener('DOMContentLoaded', () => {
  // 테마 버튼 초기 아이콘
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    const theme = document.documentElement.getAttribute('data-theme');
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  initSidebar();
  initTabs();
  initAccordions();
  initCodeCopy();
  initHints();
  initChecklists();

  // 오버레이 클릭 시 메뉴 닫기
  document.querySelector('.sidebar-overlay')?.addEventListener('click', closeMobileMenu);
});

// 스크롤 이벤트
window.addEventListener('scroll', updateProgressBar, { passive: true });
updateProgressBar();
