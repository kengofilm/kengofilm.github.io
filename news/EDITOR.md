# Kengo News: daily editing guide

Public app: https://kengofilm.github.io/news/
Repository: `kengofilm/kengofilm.github.io`, branch `main`.

Update **only `news/feed.json`**. Fetch this guide and the existing feed first. Use GitHub update_file with the freshly retrieved blob SHA. The user has explicitly authorized public publishing, daily updates, and signed-in GitHub browser fallback. Connector reads work; writes have returned HTTP 403. If this persists, use cua_repl to open `news/feed.json`, choose the visible Edit file control, replace the contents through the editor textbox, and commit directly to main. Verify the resulting file through the read connector. Do not ask for the same permission again. If a real authentication/access block occurs, preserve the previous edition and report it. Never use raw browser fetch or inspect credentials. Do not modify the root game or other files. GitHub Pages deploys main.

## Reader and category order

Topics: flexible packaging, films, printing, machinery and manufacturing sales; food manufacturers and new products; AI agents and future technology; science/space; overseas independent travel and railways; world economy. Skip celebrity gossip, sports and repetitive domestic political coverage.

The UI order is `industry` (包装・製造業), `food` (食品メーカー), `sales` (営業コラム), `ai`, `science`, `travel`, `world`, after おすすめ. Exclude the former culture category and all general culture/music articles. Keep packaging near the top of the recommended feed as well. Food manufacturers are an independent category, including both verified news and clearly marked original columns.

## New additions and retention

Aim to **ADD 20–30 newly verified news items and 2 original columns** each run. Keep the existing articles; do not replace the list with only today's edition. Counts are targets, never reasons to pad with weak, duplicate or invented items. If fewer sound stories exist, add fewer and report the actual number. Ensure topic variety; do not fill most additions with one vendor's announcements.

Prefer news from the past 72 hours, broaden to 7 days, and occasionally 30 days for relevant specialist developments. Retain news published within 30 days, up to 150 items. Retain original columns for up to 180 days, up to 60 items. Prune older/least relevant items when necessary; saved articles remain device-local snapshots. The total feed is therefore at most 210 items. Keep stable IDs, original `addedAt` dates, and existing column text unchanged unless correcting an error.

Deduplicate both URLs and underlying stories against retained items. Do not add the same announcement again through a different publication. Mix categories in the recommended order, with a packaging story first when available and food/sales items within the first six. Surface new additions near the front while keeping recent earlier articles. Never label an older announcement as new today.

## Verified news

Use Reuters, AP, NHK, ITmedia, Packaging Europe, scientific journals, university/NASA/JAXA announcements, food manufacturers, transport/travel authorities, and official releases. Prefer primary sources for technical claims. Search and inspect current sources; do not reuse unverified assistant links. Use concise original Japanese headlines and three short factual paraphrases, not copied passages. Distinguish company claims, goals, tests, simulations and established results. A `why` is an editorial interpretation, not a source claim. Paywalls are allowed only when available material supports the summary; explicitly note access limits. Confirm publication dates. For a product release, explain if the date is the release date instead of a news publication date.

## Sales columns

Set `kind: "column"` and `source: "営業コラム"`. Omit author branding; do not show ルリ, るりオリジナル, or similar labels. Do not invent an external source or URL. Write original, useful Japanese text for a manufacturing/packaging salesperson, including concrete questions for the next meeting. At least one of the two daily columns should be `sales`; regularly add `food` columns about food-manufacturer sales. News and columns must remain visibly distinguishable.

Topics include machine-specific utilization (with the denominator defined), suitable materials/widths/lots, setup time, bottlenecks, margin versus processing time, pricing units, delivery planning, sample evaluation, buying decisions, complaints, next actions, food-product renewal, shelf life, frozen foods, small portions and OEM/PB coordination. Avoid repeating existing titles or the same advice with only a new headline. Vary the question, example and practical next action.

Do not invent actual factory data, customer stories or professional results. Explicitly label numerical examples as hypothetical. Use no private employer/customer/employee information. Do not promise food safety, shelf life, legal compliance, cost reduction or performance without appropriate evidence and evaluation. For quality/labeling/contract decisions, explain which responsible parties must confirm rather than giving unsupported specialist rulings. Friendly, practical Japanese without the Japanese full stop character is preferred.

## JSON schema

Root: `{ "schemaVersion": 1, "updatedAt": "actual ISO8601 with timezone", "articles": [ ... ] }`

All articles:
- `id`: stable unique string
- `kind`: `news` or `column`; absent means news for older entries
- `category`: `industry`, `food`, `sales`, `ai`, `science`, `travel`, `world`
- `title`: concise original Japanese headline
- `dek`: one Japanese sentence describing the point
- `summary`: exactly three nonempty short Japanese strings
- `why`: concise relevance to this reader, clearly an editorial interpretation
- `source`: actual source organization for news, `営業コラム` for columns
- `publishedAt`, `addedAt`: valid `YYYY-MM-DD` dates
- `language`: `ja` or `en`
- `verificationNote`: verification/access limits for news; hypothetical-example note for columns, without author/original branding

News also require a verified HTTPS `url`, with no invented link or tracking parameters.

Columns additionally require:
- `body`: at least three sections (prefer four), each `{ "heading": "...", "text": "..." }`; write substantial useful text, not summary repetition
- `questions`: three specific Japanese questions for the next meeting
- No `url` is required; the app displays the complete original text internally

Validate required fields, supported categories/kinds, three summary strings, real dates, unique IDs, unique news URLs, and column body/questions before committing. Set `updatedAt` to the actual successful editing time only. On research failure, preserve the previous feed and timestamp; never publish an empty feed. Re-fetch the current remote feed immediately before writing. If it changed, merge additions into the newer feed instead of overwriting them.

## Operations

The existing daily ChatGPT automation researches, writes columns and commits the feed. It does not provide minute-by-minute live streaming. GitHub Pages may need a few minutes to publish. The UI fetches the feed on opening, refresh, or return after five minutes, shows the last successful editing time, and warns after 48 hours. Failures retain the prior feed. Saved articles/read status are device-local. This is a public, topic-personalized app with no private business data.
