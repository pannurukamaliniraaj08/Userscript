// ==UserScript==
// @name         YouTube Declutter & Speed Control
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes YouTube feed ads and Shorts, and adds video speed control shortcuts.
// @author       pannurukamaliniraaj08
// @match        https://www.youtube.com/*
// @grant        none
// ==UserScript==

function onEach(selector, callback) {
  const seen = new WeakSet();

  const check = () => {
    for (const el of document.querySelectorAll(selector)) {
      if (seen.has(el)) continue;
      seen.add(el);
      callback(el);
    }
  };

  check();
  new MutationObserver(check).observe(document.body, { childList: true, subtree: true });
}

const hide = (el) => { if (el) el.style.display = 'none'; };
const CARD = 'ytd-rich-item-renderer, ytd-video-renderer, ytd-ad-slot-renderer';

// Ads: hide the whole card, not just the headline text
onEach('.ytwFeedAdMetadataViewModelHostTextsStyleStandardHeadline', (el) => hide(el.closest(CARD)));
onEach('.ytwTopBannerImageTextIconButtonedLayoutViewModelHostBannerImage', (el) => hide(el.parentElement));
onEach('a[href*="googleadservices.com"]', (el) => hide(el.closest(CARD)));
onEach('ytd-ad-slot-renderer', hide);

// Shorts: shelves, sidebar entries
onEach('ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts]', hide);
onEach('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer', (el) => {
  if (el.querySelector('a[title="Shorts"]') || el.getAttribute('aria-label') === 'Shorts') hide(el);
});

// Speed: press ] to speed up, [ to slow down
document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;
  const v = document.querySelector('video');
  if (!v) return;
  if (e.key === ']') v.playbackRate = Math.min(v.playbackRate + 0.25, 4);
  if (e.key === '[') v.playbackRate = Math.max(v.playbackRate - 0.25, 0.25);
});
