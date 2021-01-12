document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get({toastEnabled: true}, (items) => {
    document.getElementById('toast-enabled').checked = items.toastEnabled;
  });
});

document.getElementById('toast-enabled').addEventListener('click', () => {
  chrome.storage.sync.set({toastEnabled: document.getElementById('toast-enabled').checked});
});
