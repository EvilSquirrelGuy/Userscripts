// ==UserScript==
// @name         GitHub British Spellings
// @namespace    https://github.com/EvilSquirrelGuy/
// @version      2025.08.21a
// @description  Replaces American spellings on GitHub with British ones
// @author       EvilSquirrelGuy
// @match        https://github.com/*
// @icon         https://cdn.jsdelivr.net/gh/jdecked/twemoji@14.0.2/assets/72x72/1f1ec-1f1e7.png
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @updateURL    https://github.com/EvilSquirrelGuy/Userscripts/raw/refs/heads/main/github/spellingFixer.user.js
// @downloadURL  https://github.com/EvilSquirrelGuy/Userscripts/raw/refs/heads/main/github/spellingFixer.user.js
// ==/UserScript==

// common replacement rules
const patterns = [
  {
    regex: /(?<=\w(dis|in|mis|multi|non|pre|re|sub|un|re|de|bi|tri)?)(arm|behavi|clam|col|endeav|fav|flav|harb|hon|lab|neighb|od|rum|savi|val|vap)or(?=[abefi]?)/g,
    replaceWith: "$1ur"
  }, // [col]or -> our
  { regex: /(?<=\w[cdglmnrstv])([iy])z(?=[eai])/gi, replaceWith: "$1s" }, // [organ]ize -> ise, [anal]yze -> yse
  { regex: /(?<=\b([Dd]ef|[Oo]ff|[Ll]ic))ense(?=s?\b)/gi, replaceWith: "ence" }, // [def]ense -> ence
  { regex: /(?<=\b[Cc]ent|[Mm]et)er(?=s?\b)/gi, replaceWith: "re" }, // [cent]er -> centre
  { regex: /(?<=\b[Cc]ent)er(?=(ed|ing))/gi, replaceWith: "r" }, // [cent]ered/ering -> centred/centring
  { regex: /(?<=\w[ea])l(?=(ed|ing|er|ation)s?)/gi, replaceWith: "ll" }, // [cance]l[ed] -> [cance]ll[ed],
  { regex: /(?<=enro)ll(?=(ment|s|)\b)/gi, replaceWith: "l" }, // [enro]ll[ment] -> [enro]l[ment]
  { regex: /(?<=(cata|dia))log(?=s?\b)/gi, replaceWith: "logue" }, // [cata]log -> [cata]logue
  { regex: /(?<=(cata|dia))log(?=(ing|ed|ers?)\b)/gi, replaceWith: "logu" }, //[cata]log[ing] -> [cata]logu[ing]
  { regex: /(?<=alumi)num(?=\b)/gi, replaceWith: "nium"}, // aluminum -> aluminium
  // fix stuff that previous ones may have broken
  { regex: /(?<=([Cc]ollab|[Ee]lab))our(?=a)/g, replaceWith: "or" } // collaborate, elaborate
]


// applies spelling fix rules to a specified bit of text
function applySpellingFixes(text) {
  for (const { regex, replaceWith } of patterns) {
    text = text.replace(regex, replaceWith);
  }
  return text;
}

// fixes all text in a specified node
function fixTextInNode(node) {
  const original = node.textContent;
  const updated = applySpellingFixes(original);
  if (original !== updated) node.textContent = updated;
}

// walk through the document body and fix spellings
function walkAndFix(root = document.body) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
      (node) => {
        const parent = node.parentNode;
        if (!parent) return NodeFilter.FILTER_REJECT;

        let el = node.parentNode;

        while (el) {

          if (["script", "style", "code", "pre", "noscript", "textarea", "input", "file-attachment"].includes(el.nodeName.toLowerCase())) {
            return NodeFilter.FILTER_REJECT;
          }

          if (el.classList && Array.from(el.classList).some(cls => [/^react-code-text$/, /^LatestCommit/, /^DirectoryContent/, /^cm-(line|content|editor)$/].some(regex => regex.test(cls)))) {
            return NodeFilter.FILTER_REJECT;
          }

          if (el.id && ["repos-header-breadcrumb"].includes(el.id)) {
            return NodeFilter.FILTER_REJECT;
          }
        el = el.parentNode;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
  );

  while (walker.nextNode()) {
    fixTextInNode(walker.currentNode);
  }
}

// function that runs it on everything (including shadow stuff)
function fixAllTextContent() {
  walkAndFix(document.body);
  //document.querySelectorAll('*').forEach(el => {
    //if (el.shadowRoot) {
    //  walkAndFix(el.shadowRoot);
    //}
  //});
}

// watch the dom
function observeDomChanges() {
  const observer = new MutationObserver(() => {
    fixAllTextContent(); // update page spellings
    document.title = applySpellingFixes(document.title); // also update page title
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// run once loaded
window.addEventListener('load', setTimeout(() => {
  fixAllTextContent();
  observeDomChanges();
}, 280));
