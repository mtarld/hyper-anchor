let toastEnabled = true;

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get({toastEnabled: true}, (items) => {
    toastEnabled = items.toastEnabled;
  });
});

const toast = (message, type) => {
  const consoleMessage = `[HyperAnchor] ${message}`;

  if ('error' === type) {
    console.error(consoleMessage);
  } else if ('warning' === type) {
    console.warn(consoleMessage);
  } else {
    console.log(consoleMessage);
  }

  if (toastEnabled !== true) {
    return;
  }

  let toastElement = document.querySelector('#toast');
  if (null === toastElement) {
    toastElement = createToast();
  }

  toastElement.innerText = message;
  toastElement.classList.add('toast-show');
  toastElement.classList.add(`toast-${type}`);

  setTimeout(() => {
    toastElement.innerText = '';
    toastElement.removeAttribute('class');
  }, 3000);
}

const createToast = () => {
  const toastElement = document.createElement('div');
  toastElement.id = 'toast';
  toastElement.setAttribute('role', 'alert')

  document.documentElement.appendChild(toastElement);

  return toastElement;
}
