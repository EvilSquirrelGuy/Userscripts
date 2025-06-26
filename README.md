# Evil's Userscripts

A nice collection of userscripts that I wrote to fix various things on sites that mildly annoy me.

## Scripts

Scripts are organised into folders based on what website(s) they target. Any scripts in the root of the repository can be assumed to be generic (i.e. run on all sites).

* [GitHub](github) – Scripts that target GitHub
  * [`dateFixer.js`](github/dateFixer.js) – Replaces the m/d/y dates and 12h timestamps prevalent across github with d/m/y dates and 24h times, respectively.
  * [`spellingFixer.js`](github/spellingFixer.js) – Replaces American spellings in GitHub's UI with the British versions, e.g. Organi**z**ation -> Organi**s**ation.
* [`dateFixer.js`](dateFixer.js) – A generic date/time format fixer that replaces m/d/y and 12h with d/m/y and 24h.
  > e.g. Replaces `June 26th, 2025` with `26th June 2025`, or `8:23:12 PM` with `20:23:12`.
