// content-en.js - injected into .com pages to read reviews + pros-cons
// returns data to background.js which forwards to content-br.js
// vanilla JS only - jQuery not available on .com pages

(() => {
    console.log('fragrantica-en: injected');

    const container = document.querySelector('#all-reviews');
    console.log('fragrantica-en: #all-reviews found:', !!container);
    if (!container) return { reviews: [], prosCons: null };

    const reviewEls = container.querySelectorAll('[itemprop="review"]');
    console.log('fragrantica-en: review elements found:', reviewEls.length);

    const reviews = Array.from(reviewEls).slice(0, 10).map(el => {
        const authorEl = el.querySelector('[itemprop="author"] [itemprop="name"]');
        const dateEl = el.querySelector('[itemprop="datePublished"]');
        const bodyEl = el.querySelector('[itemprop="reviewBody"]');
        return {
            outerHTML: el.outerHTML,
            author: (authorEl && (authorEl.getAttribute('content') || authorEl.textContent.trim())) || 'unknown',
            date: (dateEl && (dateEl.textContent.trim() || dateEl.getAttribute('content') || dateEl.getAttribute('unixtime'))) || '',
            body: (bodyEl && bodyEl.textContent.trim()) || '',
        };
    });

    console.log('fragrantica-en: reviews parsed:', reviews.length);
    reviews.forEach((r, i) => console.log('fragrantica-en: review', i, r.author, r.date));

    let prosConsEl = document.querySelector('[section-id="pros-cons"]');
    if (!prosConsEl) {
        const h3 = Array.from(document.querySelectorAll('h3'))
            .find(h => h.textContent.includes('What People Say'));
        if (h3?.parentElement?.parentElement) {
            prosConsEl = h3.parentElement.parentElement;
        }
    }
    const prosCons = prosConsEl ? prosConsEl.outerHTML : null;
    console.log('fragrantica-en: prosCons found:', !!prosCons);

    return { reviews, prosCons };
})();
