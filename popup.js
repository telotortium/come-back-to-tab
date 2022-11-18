// Copyright 2022 Robert Irelan <rirelan@gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

async function setAlarm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);
    let minutes = parseFloat(formProps.delay);
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tab !== undefined) {
        chrome.alarms.create(`comeBackToTab-${tab.id}`, { delayInMinutes: minutes });
    }
    window.close();
}

function clearAlarm() {
    chrome.alarms.clearAll();
    window.close();
}

//An Alarm delay of less than the minimum 1 minute will fire
// in approximately 1 minute increments if released
document.getElementById('popup').addEventListener('submit', setAlarm);
document.getElementById('delayField').focus();
document.getElementById('delayField').select();
