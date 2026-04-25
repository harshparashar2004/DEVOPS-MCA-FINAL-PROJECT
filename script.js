const themeToggle = document.getElementById('theme-toggle');
const themeStatus = document.getElementById('theme-status');
const loginScreen = document.getElementById('login-screen');
const googleLoginBtn = document.getElementById('google-login-btn');
const phoneLoginBtn = document.getElementById('phone-login-btn');
const phoneInput = document.getElementById('phone-input');
const userBadge = document.getElementById('user-badge');
const userNameText = document.getElementById('user-name-text');
const sidebar = document.getElementById('user-sidebar');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const sidebarClose = document.getElementById('sidebar-close');
const sidebarUsername = document.getElementById('sidebar-username');
const helpBtn = document.getElementById('help-btn');
const userDetailsBtn = document.getElementById('user-details-btn');
const passwordResetBtn = document.getElementById('password-reset-btn');

function setTheme(isDark) {
  document.body.classList.toggle('dark-theme', isDark);
  themeStatus.textContent = isDark ? 'Dark Mode' : 'Light Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function updateUserUI(username) {
  const userLabel = username ? username : 'Login';
  userNameText.textContent = userLabel;
  sidebarUsername.textContent = username ? username : 'Guest';
  userBadge.classList.toggle('logged-in', Boolean(username));
}

function showLoginScreen() {
  loginScreen.classList.add('active');
}

function hideLoginScreen() {
  loginScreen.classList.remove('active');
}

function openSidebar() {
  sidebar.classList.add('open');
  sidebarBackdrop.classList.add('active');
  sidebar.setAttribute('aria-hidden', 'false');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarBackdrop.classList.remove('active');
  sidebar.setAttribute('aria-hidden', 'true');
}

function loginUser(username, phone) {
  localStorage.setItem('loggedInUser', username);
  if (phone) localStorage.setItem('loggedInPhone', phone);
  updateUserUI(username);
  hideLoginScreen();
}

function getStoredUser() {
  return localStorage.getItem('loggedInUser');
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

const storedUser = getStoredUser();
if (storedUser) {
  updateUserUI(storedUser);
  hideLoginScreen();
} else {
  updateUserUI(null);
  showLoginScreen();
}

themeToggle.addEventListener('change', () => {
  setTheme(themeToggle.checked);
});

googleLoginBtn.addEventListener('click', () => {
  const username = prompt('Enter your name for Google login');
  if (!username) return;
  loginUser(username, 'Google account');
});

phoneLoginBtn.addEventListener('click', () => {
  const phone = phoneInput.value.trim();
  if (!phone) {
    alert('Please enter a valid phone number.');
    return;
  }
  const username = prompt('Enter a username to associate with this phone number');
  if (!username) return;
  loginUser(username, phone);
});

userBadge.addEventListener('click', () => {
  if (getStoredUser()) {
    openSidebar();
  } else {
    showLoginScreen();
  }
});

sidebarClose.addEventListener('click', closeSidebar);
sidebarBackdrop.addEventListener('click', closeSidebar);

helpBtn.addEventListener('click', () => {
  closeSidebar();
  alert('Help:\n- Use the login screen to sign in.\n- Click your username to open the user menu.');
});

userDetailsBtn.addEventListener('click', () => {
  const username = getStoredUser();
  const phone = localStorage.getItem('loggedInPhone') || 'Not available';
  closeSidebar();
  alert(`User Details:\nName: ${username}\nPhone: ${phone}`);
});

passwordResetBtn.addEventListener('click', () => {
  const username = getStoredUser();
  if (!username) return;
  const newName = prompt('Enter a new username', username);
  if (newName) {
    loginUser(newName, localStorage.getItem('loggedInPhone'));
    closeSidebar();
  }
});

// Smooth scrolling for navigation links
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
