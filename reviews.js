// reviews.js - format review dates + merge EN reviews + pros/cons
// runs in MAIN world. Shares global scope with layout.js, events.js, bootstrap.js.

function formatReviewDates(container) {
    container.querySelectorAll('[itemprop="review"]').forEach(div => {
        const span = div.querySelector('span[itemprop="datePublished"]');
        if (!span) return;
        span.classList.remove('hidden');
        const rawDate = span.textContent.trim() || span.getAttribute('content') || '';
        const date = Date.create(rawDate);
        const formatted = date?.isValid() ? date.format('{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}') : '';
        if (formatted) { span.textContent = formatted; span.setAttribute('content', formatted); }
    });
}

// Idempotent single-span formatter (used by the reactive observer): writes only when it changes.
function formatReviewDateSpan(span) {
    if (span.dataset.yodogFormatted) return;
    span.classList.remove('hidden');
    const rawDate = span.textContent.trim() || span.getAttribute('content') || '';
    const date = Date.create(rawDate);
    const formatted = date?.isValid() ? date.format('{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}') : '';
    if (formatted) {
        span.textContent = formatted;
        span.setAttribute('content', formatted);
        span.dataset.yodogFormatted = 'true';
    }
}

// EN cache: fetched once at pageload; injected as soon as #all-reviews exists.
let enCache = null;
let enFetchStarted = false;

function requestENReviews() {
    if (enFetchStarted) return;
    enFetchStarted = true;
    console.log('fragrantica-page: fetchENReviews called');
    const requestId = Date.now();
    const url = window.location.href;

    window.addEventListener('message', function handler(e) {
        if (e.data?.type !== 'fragrantica-ext-response' || e.data.id !== requestId) return;
        window.removeEventListener('message', handler);
        const data = e.data.data;
        console.log('fragrantica-page: EN data received, reviews:', data?.reviews?.length, 'prosCons:', !!data?.prosCons);
        enCache = data;
        // If #all-reviews already exists (fast path), merge right away.
        const anchor = getScopeRoot()?.querySelector('#all-reviews');
        if (anchor && !anchor.dataset.yodogReviewsMerged) mergeReviews(anchor);
    });

    window.postMessage({ type: 'fragrantica-ext-request', id: requestId, url }, '*');
    console.log('fragrantica-page: fetchEN request dispatched (pageload)');
}

// Merge cached EN data into the given #all-reviews container.
function mergeReviews(container) {
    if (!enCache) return; // not arrived yet; observer/will-run again? no: response path retries.
    console.log('fragrantica-page: mergeReviews called');
    if (enCache.reviews?.length) injectReviews(enCache.reviews, container);
    if (enCache.prosCons) injectProsCons(enCache.prosCons, container);
    formatReviewDates(container);
}

function injectProsCons(prosConsHTML, container) {
    console.log('fragrantica-page: injectProsCons called');
    if (!prosConsHTML || !container) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'fr-review-injetado';
    wrapper.innerHTML = prosConsHTML;
    container.prepend(wrapper);
    container.dataset.yodogProsconsMerged = 'true';
    console.log('fragrantica-page: pros/cons injected');
}

function injectReviews(enReviews, container) {
    console.log('fragrantica-page: injectReviews called');
    const parser = new DOMParser();

    const enElements = enReviews.map(r => {
        const doc = parser.parseFromString(r.outerHTML, 'text/html');
        const div = doc.body.firstChild;
        div.classList.add('fr-review-injetado');
        const date = Date.create(r.date);
        return { div, date };
    });

    const localEls = container.querySelectorAll('[itemprop="review"]');
    const localElements = Array.from(localEls).map(div => {
        const span = div.querySelector('span[itemprop="datePublished"]');
        const rawDate = span ? (span.textContent.trim() || span.getAttribute('content')) : '';
        const date = Date.create(rawDate);
        return { div, date };
    });

    const allSorted = enElements.concat(localElements).sort((a, b) => b.date - a.date);

    container.querySelectorAll('[itemprop="review"]').forEach(el => el.remove());
    container.dataset.yodogReviewsMerged = 'true';
    allSorted.forEach(({ div }) => container.appendChild(div));

    console.log('fragrantica-page: injected', allSorted.length, 'total reviews (EN + local)');
}

// Reactive reviews watcher, scoped to the reviews region.
//  - formatting: on ANY new [itemprop="review"], format its date span (idempotent, no loop).
//  - merge: sites the EN fetch once (guarded) when #all-reviews appears.
function setupReviews() {
    const root = getScopeRoot();
    if (!root || !window.location.href.includes('/perfume')) return;

    // Start the EN fetch immediately at pageload; results cached in enCache.
    requestENReviews();

    // Format whatever is already rendered (safe on first run).
    const existing = root.querySelector('#all-reviews');
    if (existing) formatReviewDates(existing);

    createScopedObserver(root, [
        { selector: '#all-reviews', apply: el => {
            // If cache already arrived, merge now; otherwise the fetch
            // response handler will call mergeReviews when data lands.
            if (enCache && !el.dataset.yodogReviewsMerged) mergeReviews(el);
            formatReviewDates(el);
        } },
        { selector: '[itemprop="review"] [itemprop="datePublished"]', apply: formatReviewDateSpan }
    ]);

    kickLazyReviews();
    console.log('fragrantica-page: setupReviews active');
}

// Force the site's own lazy loader to render the reviews section now,
// instead of waiting for the user to scroll down to it.
function kickLazyReviews(attempt) {
    attempt = attempt || 0;
    const lazy = document.querySelector('lazy-section-new[section-id="reviews"]');
    if (!lazy) {
        // placeholder may itself appear late; retry a few times
        if (attempt < 10) setTimeout(() => kickLazyReviews(attempt + 1), 300);
        return;
    }
    if (lazy.querySelector('#all-reviews')) return; // already rendered
    if (window.scrollY > 100) return; // user already scrolled; don't steal it

    console.log('fragrantica-page: kicking lazy reviews section (scroll nudge)');
    lazy.scrollIntoView({ block: 'center' });
    setTimeout(() => window.scrollTo(0, 0), 400);
}