# Evil's Userscripts

A nice collection of userscripts that I wrote to fix various things on sites that mildly annoy me.

These are designed for Violentmonkey, but should work with Tampermonkey as well.

## Scripts

Scripts are organised into folders based on what website(s) they target. Any scripts in the root of the repository can be assumed to be generic (i.e. run on all sites).

* [GitHub](github) – Scripts that target GitHub
  * [`dateFixer.js`](github/dateFixer.js) – Replaces the m/d/y dates and 12h timestamps prevalent across github with d/m/y dates and 24h times, respectively, see below.
  * [`spellingFixer.js`](github/spellingFixer.js) – Replaces American spellings in GitHub's UI with the British versions
    > e.g. Organi**z**ation -> Organi**s**ation.
* [`dateFixer.js`](dateFixer.js) – A generic date/time format fixer, see below.

## Contributing

While I will maintain these scripts as necessary for my own use, if you happen to notice a bug, or an abandoned script, feel free to open an issue or pull request. I can't
promise I'll look at it, but feedback is always welcome.


## Date/Time replacement

### Dates

The date replacement portion basically work by regex matching any dates in the `MMM(M) (d)d(, YYYY)` format, and rewrites them as `dd MMM(M) (YYYY)` so they feel more natural.

Example behaviour:
| Original             | Updated             |
|----------------------|---------------------|
| `June 26th`          | `26th June`         |
| `Mar 12`             | `12 Mar`            |
| `Jan 11, 2025`       | `11 Jan 2025`       |
| `October 23rd, 2025` | `23rd October 2025` |

> [!NOTE]
> This will, unfortunately, not work with numerical dates (e.g. `6/26/2025 -> 26/06/2025`) as these can often be ambiguous, and may risk *'fixing'* already valid dates. While it would
> be simple to detect for dates where the date is `>= 13`, I decided not to, as this could cause inconsistencies on sites, and it's not valid for checking if all dates on the site
> follow one format or another.

### Times

The time replacement will find 12h times on the page (again, using regex matching), and rewrite with the same precision in a 24h format.

Example behaviour:
| Original             | Updated             |
|----------------------|---------------------|
| `12am`               | `00`                |
| `9:30 AM`            | `09:30`             |
| `8:55:21 pm`         | `20:55:21`          |
| `09:12pm`            | `21:12`             |

This should be able to accurately catch out almost every standard reference to 12h time, with the exception of some less common formats that can't easily be parsed, e.g. `12p`, `2 in the afternoon`.

### GitHub

The GitHub version makes use of GitHub's *mostly* accessible format where times are (mostly) identified via the `relative-time` and `time` elements, with a clean timestamp provided as well. As such,
this makes it very easy to scan for, and correct, these elements. It should also be noted that this version will also scan `#shadow-root` elements, and update hover titles in all relevant places.

Examples:

<img width="199" alt="image" src="https://github.com/user-attachments/assets/325d29b0-4d82-409a-b189-15c1cf83fd17" />
<img width="280" alt="image" src="https://github.com/user-attachments/assets/37eb6093-c7c0-4432-a627-52de1e7d36b8" />


With Script


<img width="237" alt="image" src="https://github.com/user-attachments/assets/557acd48-da11-4983-8223-29aa18eb8073" />
<img width="312" alt="image" src="https://github.com/user-attachments/assets/b93ba869-60e8-4885-bdf7-f0114d613a30" />

Without Script




