// ==UserScript==
// @name         GitHub Timestamp Format Fixer
// @namespace    https://github.com/EvilSquirrelGuy/
// @version      2025.07.02b
// @description  Replaces timestamps on GitHub with d/m/y formatted dates and 24h time
// @author       EvilSquirrelGuy
// @match        https://github.com/*
// @icon         https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f5d3.png
// @grant        none
// @updateURL    https://github.com/EvilSquirrelGuy/Userscripts/raw/refs/heads/main/github/dateFixer.js
// @downloadURL  https://github.com/EvilSquirrelGuy/Userscripts/raw/refs/heads/main/github/dateFixer.js
// ==/UserScript==

const genericDateRegex = /(?<!\d(th|st|nd|rd)?\s)(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|June?|Jul?|Aug(ust)?|Sept?(ember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s([0-3]?\d(th|st|nd|rd)?\b(-[0-3]?\d)?)(,?)(\s\d{4})?/g
function fixDates() {
    'use strict';
    // find all the times
    let relativeTimes = document.getElementsByTagName("relative-time");

    for (let rt of relativeTimes) {
      // cast to time
      const date = new Date(rt.getAttribute("datetime"));
      // make a short dd MMM date
      const shortFmt = `${date.toLocaleDateString("en-GB", {day: "2-digit", month: "short"})}`;

      // replace the hover title
      rt.title = date.toLocaleString("en-GB", {dateStyle: "medium" ,timeStyle: "long"});

      // check the special hidden stuff
      let shadowText = rt.shadowRoot?.textContent;
      // if it's an 'on' date, replace element contents
      if (shadowText && shadowText.startsWith("on")) {
        let hasYear = /\d{4}$/.test(shadowText);
        // replace contents, optionally adding year if it was originally present
        rt.shadowRoot.textContent = "on " + shortFmt + (hasYear ? ` ${date.getFullYear()}` : "");
      }
    }

    let times = document.getElementsByTagName("time");

    for (let tm of times) {
      // make the date
      const date = new Date(tm.getAttribute("datetime") ?? tm.textContent);
      // quick format
      const shortFmt = `${date.toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric"})}`;
      // do we have the year?
      // let hasYear = /\d{4}$/.test(tm.textContent);
      tm.textContent = shortFmt;
    }

    // look into level-3 headings (i.e. commit grouping thingies) that don't have the tags, also tooltips
    let elements = Array.from(document.getElementsByTagName("h3"));
    elements.push(...Array.from(document.getElementsByTagName("tool-tip")));

    for (let element of elements) {
      if (Array.from(element.children).some(ch => ch.tagName.toLowerCase() == "relative-time")) continue;
      if (genericDateRegex.test(element.textContent)) {
        element.textContent = element.textContent.replace(genericDateRegex, "$12 $2$16")
      }
    }
}

// const fixedElements = new WeakSet();

// debounce util — delays calls so fixDates runs max once per 250ms
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// run initially
fixDates();

// then watch for new stuff being added
const observer = new MutationObserver(debounce((mutations) => {
    fixDates(); // reapply formatting whenever DOM changes
}, 250));

// watch for DOM changes so timestamps can instantly be fixed again
observer.observe(document.body, {
    childList: true,
    subtree: true
});
