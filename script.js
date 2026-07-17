// Global System Constants
const OWNER_EXTENSION_ID = 'dhlbaceabnkhadingphphnabofonfial';

// Target Document Objects
const noteInput = document.getElementById('noteInput');
const clearBtn = document.getElementById('clearBtn');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');

// Configuration Interface Objects
const configToggleBtn = document.getElementById('configToggleBtn');
const configPanel = document.getElementById('configPanel');
const loginBtn = document.getElementById('loginBtn');
const editionSelect = document.getElementById('editionSelect');
const versionBadge = document.getElementById('versionBadge');
const demoWarning = document.getElementById('demoWarning');
const payRow = document.getElementById('payRow');
const payBtn = document.getElementById('payBtn');

// 1. Ownership & Payment Visibility Logic
const currentId = chrome.runtime.id;
if (currentId !== OWNER_EXTENSION_ID) {
  payRow.classList.remove('hidden');
}

payBtn.addEventListener('click', () => {
  window.open('https://your-payment-gateway-link.com', '_blank');
});

// 2. Options UI Toggle System
configToggleBtn.addEventListener('click', () => {
  configPanel.classList.toggle('hidden');
});

// 3. Dynamic Text Metric Processing Engine
function updateStats(text) {
  charCount.textContent = `${text.length} chars`;
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  wordCount.textContent = `${words.length} words`;
}

// 4. Edition State Switch Engine 
function applyEdition(edition) {
  document.body.setAttribute('data-edition', edition);
  
  const labels = {
    demo: 'Demo',
    legacy: 'Legacy',
    plus: 'Plus',
    pro: 'Pro',
    developer: 'Developer',
    insider: 'Insider'
  };
  
  versionBadge.textContent = labels[edition] || 'Pro';
  
  // Apply immediate text truncation rules if user toggled down to Demo
  if (edition === 'demo') {
    demoWarning.classList.remove('hidden');
    if (noteInput.value.length > 50) {
      noteInput.value = noteInput.value.substring(0, 50);
      updateStats(noteInput.value);
      chrome.storage.local.set({ savedNote: noteInput.value });
    }
  } else {
    demoWarning.classList.add('hidden');
  }
}

// Capture manual user version switches
editionSelect.addEventListener('change', () => {
  const selectedEdition = editionSelect.value;
  applyEdition(selectedEdition);
  chrome.storage.local.set({ savedEdition: selectedEdition });
});

// 5. App Launch Initialization Sequencing (Chrome Storage Load)
chrome.storage.local.get(['savedNote', 'savedEdition'], (result) => {
  if (result.savedNote) {
    noteInput.value = result.savedNote;
    updateStats(result.savedNote);
  }
  if (result.savedEdition) {
    editionSelect.value = result.savedEdition;
    applyEdition(result.savedEdition);
  } else {
    applyEdition('pro');
  }
});

// 6. Reactive Keystroke Capturing System (Continuous Auto-Save)
noteInput.addEventListener('input', () => {
  let currentText = noteInput.value;
  
  // Real-time constraints check for demo restrictions
  if (editionSelect.value === 'demo' && currentText.length > 50) {
    noteInput.value = currentText.substring(0, 50);
    currentText = noteInput.value;
  }
  
  chrome.storage.local.set({ savedNote: currentText });
  updateStats(currentText);
});

// 7. Data Cleansing Routine with Flash Animation Elements
clearBtn.addEventListener('click', () => {
  noteInput.value = '';
  chrome.storage.local.remove('savedNote');
  updateStats('');
  
  noteInput.classList.add('fade-out');
  setTimeout(() => {
    noteInput.classList.remove('fade-out');
  }, 400);
});

// 8. Framework Identity Hook placeholder
loginBtn.addEventListener('click', () => {
  alert('Account integration portal goes here!');
});
