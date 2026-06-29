document.getElementById('saveBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.storage.sync.get(['serverUrl', 'apiKey'], async (config) => {
    const serverUrl = config.serverUrl || 'http://localhost:3000';
    
    status.textContent = 'Saving...';
    
    try {
      const res = await fetch(`${serverUrl}/api/bookmarks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {})
        },
        body: JSON.stringify({
          url: tab.url,
          title: tab.title,
        }),
        credentials: 'include'
      });
      
      if (res.ok) {
        status.textContent = '✓ Bookmark saved!';
        document.getElementById('saveBtn').textContent = 'Saved';
        document.getElementById('saveBtn').disabled = true;
      } else {
        status.textContent = '✗ Failed to save. Check settings.';
      }
    } catch (err) {
      status.textContent = '✗ Connection error';
    }
  });
});

document.getElementById('optionsBtn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
