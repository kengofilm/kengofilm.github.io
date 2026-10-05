# Kengo News: daily editing guide

Public web app: https://kengofilm.github.io/news/
Repository: `kengofilm/kengofilm.github.io`, branch `main`.
Update **only `news/feed.json`** using GitHub fetch_file, then update_file with the freshly retrieved blob SHA. The user has explicitly authorized publishing and daily updates, including browser fallback. Connector reads work, but connector writes returned HTTP 403; browser editing via the signed-in GitHub session was verified. If this persists, use cua_repl to open the repository, select news/feed.json, use the visible Edit file control, replace its full contents via the editor textbox, and commit directly to main. Check the resulting file using the GitHub read connector. Do not request the same permission again. If authentication or a real access block occurs, preserve the last edition and report the blocker. Never use raw browser fetch or inspect credentials. Do not modify the root game or any other files. GitHub Pages deploys the main branch.

## Editorial brief

For this reader: AI agents and future technology (about 30%), science/space (15%), flexible packaging, films, printing, machinery and manufacturing sales (25%), overseas independent travel, railways and cultural understanding (20%), world economy/history/music (10%). These are editorial targets, not strict quotas. Skip celebrity gossip, sports and repetitive domestic political coverage. Prioritize surprising developments, useful manufacturing/packaging stories, and things worth talking about.

Research 10–15 strong articles, primarily published in the last 72 hours. Broaden to 7 days if necessary, occasionally 30 days for particularly relevant specialist research. Do not include irrelevant stories just to reach a count. Use Reuters, AP, NHK, ITmedia, Packaging Europe, scientific journals, university/NASA/JAXA announcements, transport and travel authorities. Prefer primary sources for technical claims. Search and inspect the current source; never reuse unverified old assistant links. Deduplicate URLs and underlying stories. Paywalled links are allowed, but don't invent details behind the wall; describe verification limits. Date accurately; do not present an older discovery as new today. Japanese headlines and three short paraphrased summary sentences, no wholesale copying or full articles. Distinguish company claims, forecasts and scientific simulations from established results. `why` is an editorial interpretation of why the story matters to the reader.

## JSON schema

Root: `{ "schemaVersion": 1, "updatedAt": "actual ISO8601 with timezone", "articles": [ ... ] }`

Each article requires:
- `id`: stable unique string, e.g. `20261006-short-slug`
- `category`: `ai`, `science`, `industry`, `travel`, `world`, or `culture`
- `title`: concise original Japanese headline
- `dek`: one Japanese sentence describing the news, about 40–90 characters
- `summary`: exactly three short Japanese strings (factual paraphrases)
- `why`: one concise Japanese sentence tying it to this reader; inference, not source fact
- `source`: real publication/organization name
- `url`: verified HTTPS article URL, no invented links or tracking query parameters
- `publishedAt`: source publication date `YYYY-MM-DD`; omit articles with an unconfirmed publication date
- `addedAt`: date first selected `YYYY-MM-DD`
- `language`: `ja` or `en`
- `verificationNote`: concise verification note, including access limits where relevant

Order by relevance, mixing categories. Today's top story is first. Replace the article list with the new edition; browser bookmarks retain a snapshot independently. Check all required fields, 3 summary strings, allowed categories, real dates, HTTPS URLs, unique IDs and unique article URLs. Only change `updatedAt` after successful research and validation. On failed research, preserve the previous feed and timestamp. Never overwrite with an empty list.

## Schedule and operations

The app is published through GitHub Pages. The ChatGPT scheduled task is the editor: it researches, summarizes and commits the JSON. No API key, paid model service, or GitHub Actions workflow is required. GitHub Pages can take a few minutes to publish a commit. The UI fetches the JSON on opening, refresh, or return after five minutes. It shows the last successful edition time and warns if the edition is older than 48 hours. A failure retains the prior feed. Saved articles and read status are device-local, with no account sync. This is a public app, personalized by subject selection; there is no private personal/employee data in the repo.
