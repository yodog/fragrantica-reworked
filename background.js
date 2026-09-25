// background.js - service worker
// orchestrate: inject page script -> open .com tab -> wait Cloudflare -> inject reader -> send data back

const CLOUDFLARE_TIMEOUT = 30000;

console.log('fragrantica-bg: service worker loaded');

// inject main-world files into .com.br pages when they load
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete') return;
    if (!tab.url || !tab.url.includes('fragrantica.com.br')) return;

    console.log('fragrantica-bg: injecting main-world scripts into tab', tabId);
    chrome.scripting.executeScript({
        target: { tabId },
        files: ['layout.js', 'events.js', 'reviews.js', 'bootstrap.js'],
        world: 'MAIN'
    }).then(() => {
        console.log('fragrantica-bg: main-world scripts injected successfully');
    }).catch(err => {
        console.log('fragrantica-bg: error injecting main-world scripts', err);
    });
});

// handle fetchEN requests from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log('fragrantica-bg: received message', msg);
    if (msg.action === 'fetchEN') {
        console.log('fragrantica-bg: handling fetchEN for', msg.url);
        handleFetchEN(msg.url)
            .then(data => {
                console.log('fragrantica-bg: fetchEN success, reviews:', data?.reviews?.length, 'prosCons:', !!data?.prosCons);
                sendResponse(data);
            })
            .catch(err => {
                console.log('fragrantica-bg: fetchEN error', err.message);
                sendResponse({ error: err.message });
            });
        return true;
    }
});

async function handleFetchEN(brUrl) {
    const enUrl = brUrl.replace('.com.br', '.com') + '#all-reviews';
    console.log('fragrantica-bg: enUrl', enUrl);
    let tabId;

    try {
        console.log('fragrantica-bg: creating tab...');
        const tab = await chrome.tabs.create({ url: enUrl, active: false });
        tabId = tab.id;
        console.log('fragrantica-bg: tab created, id:', tabId);

        console.log('fragrantica-bg: waiting for Cloudflare...');
        await waitForCloudflare(tabId);
        console.log('fragrantica-bg: Cloudflare resolved');

        console.log('fragrantica-bg: waiting 2s for JS to settle...');
        await new Promise(r => setTimeout(r, 2000));

        console.log('fragrantica-bg: injecting content-en.js...');
        const results = await chrome.scripting.executeScript({
            target: { tabId },
            files: ['content-en.js']
        });
        console.log('fragrantica-bg: executeScript returned', results);

        const data = results?.[0]?.result || { reviews: [], prosCons: null };
        console.log('fragrantica-bg: final data, reviews:', data?.reviews?.length, 'prosCons:', !!data?.prosCons);
        return data;

    } catch (err) {
        console.log('fragrantica-bg: handleFetchEN error', err);
        throw err;
    } finally {
        if (tabId) {
            console.log('fragrantica-bg: closing tab', tabId);
            chrome.tabs.remove(tabId).catch(e => console.log('fragrantica-bg: tab close error', e));
        }
    }
}

function waitForCloudflare(tabId) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            chrome.tabs.onUpdated.removeListener(listener);
            console.log('fragrantica-bg: Cloudflare TIMEOUT for tab', tabId);
            reject(new Error('Cloudflare timeout'));
        }, CLOUDFLARE_TIMEOUT);

        function listener(updatedTabId, changeInfo) {
            if (updatedTabId !== tabId) return;
            console.log('fragrantica-bg: tab', updatedTabId, 'status:', changeInfo.status);
            if (changeInfo.status === 'complete') {
                clearTimeout(timer);
                chrome.tabs.onUpdated.removeListener(listener);
                resolve();
            }
        }

        chrome.tabs.onUpdated.addListener(listener);
    });
}
