// layout.js - page layout: CSS, ads blocking, social card, lazy/srcset fix
// runs in MAIN world. Shares global scope with events.js, reviews.js, bootstrap.js.

function injectCSSGeneral() {
    console.log('fragrantica-page: injectCSSGeneral called');
    const css = `
        main.container { max-width: unset !important ; }
        .max-w-7xl { max-width: unset !important ; }
        a.group.flex-shrink-0 { width: 12% ; min-width: 80px ; }
        img.h-14 { height: unset ; width: -moz-available ; width: -webkit-fill-available ; }
    `;
    jQuery('<style>').attr('type', 'text/css').text(css).appendTo('head');
    console.log('fragrantica-page: general CSS injected');
}

function injectCSSPerfume() {
    console.log('fragrantica-page: injectCSSPerfume called');
    const css = `
        main.container { max-width: unset !important ; }
        .fr-review-injetado { border-left: 3px solid #0d6efd; padding-left: 10px; margin-top: 1em; background: rgba(13,110,253,0.05); padding: 0.5em; }
    `;
    jQuery('<style>').attr('type', 'text/css').text(css).appendTo('head');
    console.log('fragrantica-page: perfume CSS injected');
}

function blockAds() {
    console.log('fragrantica-page: blockAds called');
    window.freestarAdSlots = [];
    window.freestar.config = { enabled: false };
    window.yaContextCb = [];
    jQuery('[id*="yandex"], [id*="freestar"]').remove();
    console.log('fragrantica-page: ads blocked');
}

function socialCard() {
    if (!(window.location.href).includes('/perfume')) return;
    console.log('fragrantica-page: socialCard called');
    const socialcardlink = jQuery('a[href*="social-card"]').attr('href');
    if (!socialcardlink) { console.log('fragrantica-page: socialcard not found'); return; }
    const original = jQuery('picture.max-w-full img.max-w-full[itemprop=image], picture.w-full img.w-full[itemprop=image]').parent();
    if (!original.length) { console.log('fragrantica-page: original image not found'); return; }
    const clone = original.clone(true).insertAfter(original);
    original.find('source').remove();
    original.find('img[itemprop=image]').attr('src', socialcardlink).removeAttr('srcset height width');
    console.log('fragrantica-page: socialcard injected', socialcardlink);
}

function fixLazyLoading() {
    console.log('fragrantica-page: fixLazyLoading called');
    const root = getScopeRoot();
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                node.querySelectorAll('img[loading="lazy"]').forEach(img => {
                    img.removeAttribute('loading');
                });
                node.querySelectorAll('picture > source').forEach(source => {
                    const oldSrcset = source.getAttribute('srcset');
                    if (!oldSrcset) return;
                    const parts = oldSrcset.split(', ');
                    if (parts.length < 2) return;
                    const url_2x = parts[0].split(' ')[0];
                    const url_s = url_2x.replace(/-[a-z]+(?=\.\d+\.)/, '-s');
                    source.setAttribute('srcset', url_s);
                });
            });
        });
    });
    observer.observe(root, { childList: true, subtree: true });
    console.log('fragrantica-page: lazy loading fix active');
}