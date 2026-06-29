document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['serverUrl', 'apiKey'], (config) => {
    document.getElementById('serverUrl').value = config.serverUrl || 'http://localhost:3000';
    document.getElementById('apiKey').value = config.apiKey || '';
  });
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const serverUrl = document.getElementById('serverUrl').value;
  const apiKey = document.getElementById('apiKey').value;
  
  chrome.storage.sync.set({ serverUrl, apiKey }, () => {
    document.getElementById('status').textContent = '✓ Settings saved';
  });
});
