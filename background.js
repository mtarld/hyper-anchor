chrome.contextMenus.create({
  id: 'create-hyper-anchor',
  title: 'Copy hyper anchor to clipboard',
  type: 'normal',
  contexts: ['selection'],
});

chrome.contextMenus.onClicked.addListener(() => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {method: 'copyHyperAnchor'});
  });
});
