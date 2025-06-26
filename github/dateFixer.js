// ==UserScript==
// @name         GitHub Timestamp Format Fixer
// @namespace    https://github.com/EvilSquirrelGuy/
// @version      2025.06.26d
// @description  Replaces timestamps on GitHub with d/m/y formatted dates and 24h time
// @author       EvilSquirrelGuy
// @match        https://github.com/*
// @icon         https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f5d3.png
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @updateURL    https://github.com/EvilSquirrelGuy/Userscripts/raw/refs/heads/main/github/dateFixer.js
// @downloadURL  https://github.com/EvilSquirrelGuy/Userscripts/raw/refs/heads/main/github/dateFixer.js
// ==/UserScript==

function fixDates() {
    'use strict';
    // find all the times
    let relativeTimes = document.getElementsByTagName("relative-time");

    for (let rt of relativeTimes) {
      // cast to time
      const date = new Date(rt.datetime);
      // make a short dd MMM date
      const shortFmt = `${date.toLocaleDateString("en-GB", {day: "2-digit", month: "short"})}`;

      // replace the hover title
      rt.title = date.toLocaleString("en-GB", {dateStyle: "medium" ,timeStyle: "long"});

      // check the special hidden stuff
      let shadowText = rt.shadowRoot?.textContent;
      // if it's an 'on' date, replace element contents
      if (shadowText.startsWith("on")) {
        let hasYear = /\d{4}$/.test(shadowText);
        // replace contents, optionally adding year if it was originally present
        rt.shadowRoot.textContent = "on " + shortFmt + (hasYear ? ` ${date.getFullYear()}` : "");
      }
    }

    let times = document.getElementsByTagName("time");

    for (let tm of times) {
      // make the date
      const date = new Date(tm.textContent);
      // quick format
      const shortFmt = `${date.toLocaleDateString("en-GB", {day: "2-digit", month: "short"})}`;
      // do we have the year?
      let hasYear = /\d{4}$/.test(shadowText);
      tm.textContent = shortFmt + (hasYear ? ` ${date.getFullYear()}` : "");
    }
}


// run initially
fixDates();

// then watch for new stuff being added
const observer = new MutationObserver(() => {
    fixDates(); // reapply formatting whenever DOM changes
});

// watch for DOM changes so timestamps can instantly be fixed again
observer.observe(document.body, {
    childList: true,
    subtree: true
});
