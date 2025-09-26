// ==UserScript==
// @name         Timestamp Format Fixer
// @namespace    https://github.com/EvilSquirrelGuy/
// @version      2025.09.26b
// @description  Replaces timestamps on most websites with d/m/y formatted dates and 24h time
// @author       EvilSquirrelGuy
// @match        https://*/*
// @match        http://*/*
// @exclude      https://github.com/*
// @icon         https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f5d3.png
// @grant        none
// @require      https://git.io/waitForKeyElements.js
// @updateURL    https://github.com/EvilSquirrelGuy/Userscripts/raw/refs/heads/main/dateFixer.user.js
// @downloadURL  https://github.com/EvilSquirrelGuy/Userscripts/raw/refs/heads/main/dateFixer.user.js
// ==/UserScript==

const genericDateRegex = /(?<!\d(th|st|nd|rd)?\s)(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|June?|July?|Aug(ust)?|Sept?(ember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s([0-3]?\d(th|st|nd|rd)?\b(-[0-3]?\d)?)(,?)(\s\d{4})?/g

const generic12hTimeRegex = /\b(?<hr>1[0-2]|0?[0-9])[:.]?(?<min>\d\d)?[:.]?(?<sec>\d\d)?\s?(?<tt>[ap]\.?m\.?)/gi

function fixDates(text) {
  text = text.replace(genericDateRegex, "$12 $2$16");
  return text;
}

function fixTimes(text) {

  text = text.replace(
    generic12hTimeRegex,
    (_, hr, min, sec, tt) => {
      const h = hr.padStart(2, "0");
      const m = min ?? "00";
      const s = sec ?? "00";
      const mer = tt.toUpperCase().replaceAll(".", "");

      const date = new Date(`1970-01-01 ${h}:${m}:${s} ${mer}`);
      return date.toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: min ? "2-digit" : undefined,
        second: sec ? "2-digit" : undefined,
      })
    })

  return text;
}

// fix all text in the node
function fixTextInNode(node) {
  const original = node.textContent;
  let updated = fixDates(original);
  updated = fixTimes(updated);
  if (original !== updated) node.textContent = updated;
}

// walk through all text nodes on page
function walkAndFix(root = document.body) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
  )

  while (walker.nextNode()) {
    fixTextInNode(walker.currentNode);
  }
}

// run once loaded
window.addEventListener('load', setTimeout(() => {
  walkAndFix();
//  observeDomChanges();
}, 300));

// run on iframes too
// from: https://stackoverflow.com/a/65249968
waitForKeyElements("iframe, frame", function(frame) {
  frame.addEventListener("load", function () {
    frame.removeAttribute("wfke_found");
  });
  walkAndFix(frame.contentDocument.root);
});
