// ==UserScript==
// @name         GitHub British Spellings
// @namespace    https://github.com/EvilSquirrelGuy/
// @version      2025.06.26a
// @description  Replaces American spellings on GitHub with British ones
// @author       EvilSquirrelGuy
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hibbard.eu
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

// common replacement rules
const patterns = [
  { regex: /(?<=[lbmv])or(?=[asfyi]|\b)/g, replaceWith: "our" }, // [col]or -> our
  { regex: /(?<=\w[cdglmnrstv])([iy])z(?=[eai])/g, replaceWith: "$1s" }, // [organ]ize -> ise, [anal]yze -> yse
  { regex: /(?<=\b([Dd]ef|[Oo]ff|[Ll]ic))ense(?=s?\b)/g, replaceWith: "ence" }, // [def]ense -> ence
  { regex: /(?<=\b[Cc]ent|[Mm]et)er(?=s?\b)/g, replaceWith: "re" }, // [cent]er -> centre
  { regex: /(?<=\b[Cc]ent)er(?=(ed|ing))/g, replaceWith: "r" }, // [cent]ered/ering -> centred/centring
  { regex: /(?<=\w[ea])l(?=(ed|ing|er|ation)s?)/g, replaceWith: "ll" }, // [cance]l[ed] -> [cance]ll[ed],
  { regex: /(?<=[Ee]nro)ll(?=(ment|ing|ed|s|)\b)/g, replaceWith: "l" }, // [enro]ll[ment] -> [enro]l[ment]
  { regex: /(?<=([Cc]ata|[Dd]ia))log(?=s?\b)/g, replaceWith: "logue" }, // [cata]log -> [cata]logue
  { regex: /(?<=([Cc]ata|[Dd]ia))log(?=(ing|ed|ers?)\b)/g, replaceWith: "logu" }, //[cata]log[ing] -> [cata]logu[ing]
  { regex: /(?<=[Aa]lumi)num(?=\b)/g, replaceWith: "nium"}, // aluminum -> aluminium
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
        if (["script", "style", "code", "pre", "noscript"].includes(tag)) {
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

walkAndFix()
