// Copyright 2022 Robert Irelan <rirelan@gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

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
