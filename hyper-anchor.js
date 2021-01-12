chrome.extension.onMessage.addListener((request) => {
  if ('copyHyperAnchor' === request.method) {
    const selection = window.getSelection();

    if (null === selection.anchorNode || null === selection.focusNode) {
      return;
    }

    const hyperAnchorData = {
      anchor: nodeNormalizer.normalize(selection.anchorNode),
      anchorOffset: selection.anchorOffset,
      focus: nodeNormalizer.normalize(selection.focusNode),
      focusOffset: selection.focusOffset,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    };

    const url = new URL(window.location.href);
    url.searchParams.set('hyper-anchor', base65536.encode(msgpack.encode(hyperAnchorData)));

    copyToClipboard(url.toString());
    toast('Copied!', 'success');
  }
});

docReady(() => {
  const hyperAnchorQueryParam = (new URL(window.location.href)).searchParams.get('hyper-anchor');
  if (null === hyperAnchorQueryParam) {
    return;
  }

  let hyperAnchorData;
  try {
    hyperAnchorData = msgpack.decode(base65536.decode(hyperAnchorQueryParam));
  } catch (error) {
    toast('hyper-anchor query parameter corrupted.', 'error');

    return;
  }

  try {
    window.getSelection().setBaseAndExtent(
      nodeNormalizer.denormalize(hyperAnchorData.anchor),
      hyperAnchorData.anchorOffset,
      nodeNormalizer.denormalize(hyperAnchorData.focus),
      hyperAnchorData.focusOffset,
    );
  } catch (error) {
    toast('Cannot find hyper anchor.', 'warning');

    return;
  }

    window.scrollTo(hyperAnchorData.scrollX, hyperAnchorData.scrollY);
});

function copyToClipboard(value) {
  const tmpInput = document.createElement('input');
  tmpInput.value = value;

  document.body.appendChild(tmpInput);
  tmpInput.select();
  document.execCommand('copy');

  document.body.removeChild(tmpInput);
}

function docReady(callback) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(callback, 1);
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}
