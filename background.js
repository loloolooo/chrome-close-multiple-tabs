/**
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/
 * @see https://developer.chrome.com/docs/extensions/reference/commands/
 * @see https://github.com/GoogleChrome/chrome-extensions-samples
 */

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getSpecificTabs(queryOptions) {
  let tabs = await chrome.tabs.query(queryOptions);
  return tabs;
}

chrome.commands.onCommand.addListener(async (command) => {
  const currentWindow = await chrome.windows.getCurrent();
  const currentTab = await getCurrentTab();
  const currentTabIndex = currentTab.index;
  const specificTabs = await getSpecificTabs({ active: false, pinned: false, windowId: currentWindow.id });

  let closeTabIds = null;

  switch (command) {
    case 'close-other-tabs':
      closeTabIds = specificTabs.map((tab) => tab.id);
      break;
    case 'close-right-tabs':
      closeTabIds = specificTabs.filter((tab) => tab.index > currentTabIndex).map((tab) => tab.id);
      break;
    case 'close-left-tabs':
      closeTabIds = specificTabs.filter((tab) => tab.index < currentTabIndex).map((tab) => tab.id);
      break;
  }

  chrome.tabs.remove(closeTabIds);
});
