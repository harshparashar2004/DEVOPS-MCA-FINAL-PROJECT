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

// AI chatbot logic
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatWindow = document.getElementById('chat-window');
const chatToggle = document.getElementById('chatbot-toggle');
const chatClose = document.getElementById('chatbot-close');
const chatPanel = document.getElementById('chatbot-panel');

function addChatMessage(text, type) {
  if (!chatWindow) return;
  const message = document.createElement('div');
  message.className = `chat-message ${type}`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function setChatPanelOpen(isOpen) {
  if (!chatPanel) return;
  chatPanel.classList.toggle('open', isOpen);
  chatPanel.setAttribute('aria-hidden', String(!isOpen));
}

if (chatToggle) {
  chatToggle.addEventListener('click', () => {
    setChatPanelOpen(true);
    chatInput?.focus();
  });
}

if (chatClose) {
  chatClose.addEventListener('click', () => {
    setChatPanelOpen(false);
    chatToggle?.focus();
  });
}

function getBotReply(message) {
  const normalized = message.trim().toLowerCase();

  if (!normalized) {
    return 'Please type a question so I can help you with DevOps or this project.';
  }

  if (normalized.includes('register') || normalized.includes('signup')) {
    return 'The registration page collects your name, email, and password. If it gets stuck, open the site through the local server and check the browser console for any errors.';
  }

  if (normalized.includes('devops')) {
    return 'DevOps focuses on automation, monitoring, and continuous delivery. This project uses Node.js, Express, and MongoDB to simulate a modern DevOps web application.';
  }

  if (normalized.includes('docker') || normalized.includes('container')) {
    return 'Docker lets you package apps and their dependencies together. This app is ready for Docker-based deployment once the backend and frontend are working.';
  }

  if (normalized.includes('mongodb') || normalized.includes('database')) {
    return 'MongoDB is the database behind registration. Make sure your Atlas IP whitelist includes your current address, or use a local MongoDB connection string if needed.';
  }

  if (normalized.includes('hello') || normalized.includes('hi')) {
    return 'Hello! I am your DevOps assistant bot. Ask me anything about this project, deployment, or registration.';
  }

  if (normalized.includes('help') || normalized.includes('support')) {
    return 'I can help with registration issues, deployment questions, and general DevOps guidance. Try asking something like “How do I deploy?” or “Why is registration stuck?”.';
  }

  return 'I am still learning. For now, I can help with DevOps, registration, MongoDB, and deployment guidance. Try asking something specific.';
}

if (chatForm && chatInput && chatWindow) {
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addChatMessage(userMessage, 'user-message');
    chatInput.value = '';
    chatInput.disabled = true;

    setTimeout(() => {
      addChatMessage(getBotReply(userMessage), 'bot-message');
      chatInput.disabled = false;
      chatInput.focus();
    }, 600);
  });
}
