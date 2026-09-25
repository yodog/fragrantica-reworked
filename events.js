// events.js - scoped MutationObserver + one-shot event rules
// runs in MAIN world. Shares global scope with layout.js, reviews.js, bootstrap.js.
//
// Scope philosophy (was: observe document.body everywhere):
//   perfume -> <main class="container ..."> (contains reviews, pyramid, newreview, carousel)
//   profile -> #member-tabs-section (tabs where content is re-rendered)
//   other   -> <main> or body as fallback
// We observe a narrow stable ancestor, then apply selector rules inside it.

function getScopeRoot() {
    if (window.location.href.includes('/perfume')) {
        return document.querySelector('main') || document.body;
    }
    if (window.location.href.includes('@') || document.querySelector('#member-tabs-section')) {
        return document.querySelector('#member-tabs-section') || document.querySelector('main') || document.body;
    }
    return document.querySelector('main') || document.body;
}

// Single scoped observer for a batch of selector rules.
// rules: [{ selector, apply(el), once? }]
// Uses the data-yodog-processed guard for idempotency (safe on Vue re-renders).
function createScopedObserver(root, rules) {
    const observer = new MutationObserver(() => {
        rules.forEach(rule => {
            root.querySelectorAll(rule.selector).forEach(el => {
                if (el.dataset.yodogProcessed) return;
                el.dataset.yodogProcessed = 'true';
                rule.apply(el);
            });
        });
    });
    observer.observe(root, { childList: true, subtree: true });
    return observer;
}

function stripReadmore() {
    console.log('fragrantica-page: stripReadmore called');
    createScopedObserver(getScopeRoot(), [{
        selector: '.review-readmore',
        apply: el => {
            console.log('fragrantica-page: stripping .review-readmore');
            jQuery(el).replaceWith(function() {
                return jQuery(this).find('.tw-review-prose');
            });
        }
    }]);
}

function registerEvents() {
    if (!(window.location.href).includes('/perfume')) return;
    console.log('fragrantica-page: registerEvents called');
    createScopedObserver(getScopeRoot(), [
        { selector: '#showDiagram:not(:checked)', once: true, apply: el => el.click() },
        { selector: '#idIframeMMM', once: true, apply: el => el.remove() },
        { selector: '#idIframeAAA', once: true, apply: el => el.remove() },
        { selector: 'sup', once: true, apply: el => {
            if (el.textContent.trim().includes('Sponsored')) {
                el.closest('div.mb-4, div.items-start')?.remove();
            }
        } },
        { selector: 'div.carousel, div.perfume-carousel-scroll', once: true, apply: el => {
            const target = document.querySelector('#newreview');
            if (target) target.prepend(el.closest('div.mb-6'));
        } },
        { selector: 'div#pyramid button.group', once: true, apply: el => {
            if (el.textContent.trim().includes('Mostrar votos')) el.click();
        } }
    ]);
    console.log('fragrantica-page: events registered');
}