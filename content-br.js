// content-br.js - relay between page script (main world) and background
// runs in isolated world, communicates with page script via postMessage

console.log('fragrantica-br: content script loaded, registering listener');

window.addEventListener('message', e => {
    if (e.data?.type !== 'fragrantica-ext-request') return;
    const { id, url } = e.data;
    console.log('fragrantica-br: received request from page script, id:', id, 'url:', url);
    chrome.runtime.sendMessage({ action: 'fetchEN', url }, response => {
        console.log('fragrantica-br: got response from background', response);
        window.postMessage({ type: 'fragrantica-ext-response', id, data: JSON.parse(JSON.stringify(response)) }, '*');
        console.log('fragrantica-br: posted response to page script');
    });
});

console.log('fragrantica-br: listener registered');
