const themeToggle = document.getElementById('theme-toggle');
const themeStatus = document.getElementById('theme-status');

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
