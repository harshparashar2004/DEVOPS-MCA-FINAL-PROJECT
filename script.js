const themeToggle = document.getElementById('theme-toggle');
const themeStatus = document.getElementById('theme-status');

// Apply theme and save preference.
function setTheme(isDark) {
  document.body.classList.toggle('dark-theme', isDark);
  themeStatus.textContent = isDark ? 'Dark Mode' : 'Light Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  themeToggle.checked = true;
  setTheme(true);
} else {
  themeToggle.checked = false;
  setTheme(false);
}

themeToggle.addEventListener('change', () => {
  setTheme(themeToggle.checked);
});

// Smooth scrolling for same-page navigation links.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
