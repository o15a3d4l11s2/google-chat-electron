import {ipcRenderer} from 'electron';

const iframeSelector: string = 'iframe[aria-label="Chat"]';
const homeShortcutSelector: string = 'div[aria-label^="Home shortcut"]';

const getMessageCount = (): number => {
  let counter = 0;

  const iframe: HTMLObjectElement | null = document.querySelector(iframeSelector);
  const iframeDocument = iframe?.contentDocument ?? iframe?.contentWindow?.document ?? null;
  const homeShortcut = iframeDocument?.body.querySelector(homeShortcutSelector) ?? null;
  const homeShortcutCounter = homeShortcut?.lastChild?.lastChild ?? null;
  if (homeShortcutCounter) {
    counter += Number(homeShortcutCounter.textContent);
  }

  return counter;
}

let previousCount = -1;
const emitCount = () => {
  const count = getMessageCount();
  if (previousCount === count) {
    return
  }

  previousCount = count;
  ipcRenderer.send('unreadCount', getMessageCount())
}

let interval: NodeJS.Timeout;
window.addEventListener('DOMContentLoaded', () => {
  clearInterval(interval)
  interval = setInterval(emitCount, 1000)
});

