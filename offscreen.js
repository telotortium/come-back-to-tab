// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Based on
// https://github.com/GoogleChrome/chrome-extensions-samples/blob/f608c65e61c2fbf3749ccba88ddce6fafd65e71f/functional-samples/cookbook.offscreen-dom/offscreen.js

// Registering this listener when the script is first executed ensures that the
// offscreen document will be able to receive messages when the promise returned
// by `offscreen.createDocument()` resolves.
chrome.runtime.onMessage.addListener(handleMessages);

// This function performs basic filtering and error checking on messages before
// dispatching the message to a more specific message handler.
async function handleMessages(message) {
  // Return early if this message isn't meant for the offscreen document.
  if (message.target !== 'offscreen') {
    return false;
  }

  // Dispatch the message to an appropriate handler.
  switch (message.type) {
    case 'notification-sound':
      await playNotificationSound();
      break;
    default:
      console.warn(`Unexpected message type received: '${message.type}'.`);
      return false;
  }
}

async function playNotificationSound(htmlString) {
  // Royalty-free sound "Bells 1" from
  // https://pixabay.com/sound-effects/bells-1-72261/
  const audio = new Audio("bells-1-72261.mp3");
  audio.volume = 0.2;
  try {
    await audio.play();
    sendToBackground(
      'notification-sound-result',
      'success'
    );
  } catch (ex) {
    sendToBackground(
      'notification-sound-result',
      `exception: ${ex}`
    );
  }
}

function sendToBackground(type, data) {
  chrome.runtime.sendMessage({
    type,
    target: 'background',
    data
  });
}
