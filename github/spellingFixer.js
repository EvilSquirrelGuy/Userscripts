// ==UserScript==
// @name         GitHub British Spellings
// @namespace    https://github.com/EvilSquirrelGuy/
// @version      2025.06.26g
// @description  Replaces American spellings on GitHub with British ones
// @author       EvilSquirrelGuy
// @match        https://github.com/*
// @icon         https://cdn.jsdelivr.net/gh/jdecked/twemoji@14.0.2/assets/72x72/1f1ec-1f1e7.png
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @updateURL    https://github.com/EvilSquirrelGuy/Userscripts/raw/refs/heads/main/github/spellingFixer.js
// @downloadURL  https://github.com/EvilSquirrelGuy/Userscripts/raw/refs/heads/main/github/spellingFixer.js
// ==/UserScript==

// common replacement rules
const patterns = [
  { regex: /(?<=\w[blmpv])or(?=\w*\b)/g, replaceWith: "our", ignore: ["collaborat", "elaborat"]}, // [col]or -> our
  { regex: /(?<=\w[cdglmnrstv])([iy])z(?=[eai])/g, replaceWith: "$1s" }, // [organ]ize -> ise, [anal]yze -> yse
  { regex: /(?<=\b([Dd]ef|[Oo]ff|[Ll]ic))ense(?=s?\b)/g, replaceWith: "ence" }, // [def]ense -> ence
  { regex: /(?<=\b[Cc]ent|[Mm]et)er(?=s?\b)/g, replaceWith: "re" }, // [cent]er -> centre
  { regex: /(?<=\b[Cc]ent)er(?=(ed|ing))/g, replaceWith: "r" }, // [cent]ered/ering -> centred/centring
  { regex: /(?<=\w[ea])l(?=(ed|ing|er|ation)s?)/g, replaceWith: "ll" }, // [cance]l[ed] -> [cance]ll[ed],
  { regex: /(?<=[Ee]nro)ll(?=(ment|ing|ed|s|)\b)/g, replaceWith: "l" }, // [enro]ll[ment] -> [enro]l[ment]
  { regex: /(?<=([Cc]ata|[Dd]ia))log(?=s?\b)/g, replaceWith: "logue" }, // [cata]log -> [cata]logue
  { regex: /(?<=([Cc]ata|[Dd]ia))log(?=(ing|ed|ers?)\b)/g, replaceWith: "logu" }, //[cata]log[ing] -> [cata]logu[ing]
  { regex: /(?<=[Aa]lumi)num(?=\b)/g, replaceWith: "nium"}, // aluminium -> aluminium
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
    {
      acceptNode: (node) => {
        const parent = node.parentNode;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.nodeName.toLowerCase();

        // ignore code-y stuff
        if (
          ["script", "style", "code", "pre", "noscript", "textarea", "input"].includes(tag) || // code stuff
          ([...parent.classList || []].some(cls => cls.startsWith("DirectoryContent"))) // github directory view
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  while (walker.nextNode()) {
    fixTextInNode(walker.currentNode);
  }
}

// function that runs it on everything (including shadow stuff)
function fixAllTextContent() {
  walkAndFix(document.body);
  document.querySelectorAll('*').forEach(el => {
    if (el.shadowRoot) {
      walkAndFix(el.shadowRoot);
    }
  });
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
