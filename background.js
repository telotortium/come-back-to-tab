// Copyright 2022 Robert Irelan <rirelan@gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

chrome.alarms.onAlarm.addListener(async (alarm) => {
    let matches = alarm.name.match(/^comeBackToTab-(\d+)$/);
    if (matches === null) {
        return;
    }
    let tabId = parseInt(matches[1]);
    let tab = await chrome.tabs.get(tabId);
    chrome.notifications.create(alarm.name, {
        type: 'basic',
        iconUrl: 'come-back-to-tab-icon-128.png',
        title: 'Come back to tab',
        message: `Click to go back to tab for ${tab.url}`,
        priority: 0,
        requireInteraction: true
    });
    // Play audio file. Cannot play in Service Worker, so use Chrome APIs to
    // open an HTML document in the background to play it.
    if (!(await hasDocument())) {
        await chrome.offscreen.createDocument({
            url: OFFSCREEN_DOCUMENT_PATH,
            reasons: ['AUDIO_PLAYBACK'],
            justification: 'notification',
        });
    }
    chrome.runtime.sendMessage({
        type: 'notification-sound',
        target: 'offscreen',
        data: {}
    });
    chrome.alarms.clear(alarm.name);
});

chrome.notifications.onClicked.addListener(async (notificationId) => {
    let matches = notificationId.match(/^comeBackToTab-(\d+)$/);
    if (matches === null) {
        return;
    }
    let tabId = parseInt(matches[1]);
    let tab = await chrome.tabs.get(tabId);
    await chrome.tabs.update(tabId, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
    chrome.notifications.clear(notificationId);
});

async function hasDocument() {
  // Check all windows controlled by the service worker if one of them is the offscreen document
  const matchedClients = await clients.matchAll();
  for (const client of matchedClients) {
    if (client.url.endsWith(OFFSCREEN_DOCUMENT_PATH)) {
      return true;
    }
  }
  return false;
}
