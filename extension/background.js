const MENU_ID = 'transvela-protect-link';

function menuTitle() {
  const lang = (chrome.i18n.getUILanguage() || 'en').toLowerCase();
  return lang.startsWith('zh') ? '用 Transvela 保护此链接' : 'Protect this link with Transvela';
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: menuTitle(),
    contexts: ['link']
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== MENU_ID || !info.linkUrl) return;

  await chrome.storage.session.set({ pendingUrl: info.linkUrl });

  try {
    await chrome.action.openPopup();
  } catch {
    // Older Chromium builds restrict programmatic popup opening; fall back
    // to a normal tab running the same popup UI.
    await chrome.tabs.create({ url: chrome.runtime.getURL('popup/popup.html?standalone=1') });
  }
});
