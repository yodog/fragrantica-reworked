// bootstrap.js - entry point: loads jQuery + Sugar, then bootstraps all modules
// runs in MAIN world. Must be loaded LAST (functions from layout/events/reviews are global).
// Shares global scope with layout.js, events.js, reviews.js.

function ensureSugar(callback) {
    if (typeof Sugar !== 'undefined') {
        Sugar.Date.extend();
        return callback();
    }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/sugar/2.0.6/sugar.min.js';
    s.onload = () => { Sugar.Date.extend(); callback(); };
    document.head.appendChild(s);
}

function initAll() {
    blockAds();
    fixLazyLoading();
    injectCSSGeneral();
    stripReadmore();
    setupReviews();

    if (window.location.href.includes('/perfume')) {
        injectCSSPerfume();
        socialCard();
        registerEvents();
    }
}

console.log('fragrantica-page: script loaded');
if (typeof jQuery !== 'undefined' && typeof jQuery.fn !== 'undefined') {
    console.log('fragrantica-page: jQuery found on page');
    ensureSugar(initAll);
} else {
    console.log('fragrantica-page: jQuery NOT found, loading from CDN');
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
    script.onload = () => {
        console.log('fragrantica-page: jQuery loaded from CDN');
        ensureSugar(initAll);
    };
    document.head.appendChild(script);
}