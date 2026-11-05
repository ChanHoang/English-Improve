# English Improve

Personal English vocabulary, grammar and reading practice, with English navigation and Vietnamese explanations.

## Use

Open `index.html` directly, or visit the GitHub Pages deployment linked in this repository's **Deployments** section.

- 5,943 vocabulary entries, CEFR filters, flashcards and quizzes.
- 120 grammar topics and 1,263 grammar questions.
- 348 readings in 174 paired groups, covering all A2–C1 entries: A2 990, B1 902, B2 1,571 and C1 1,404.
- Learn words → read → practice, with explanations for all answer choices.
- Responsive navigation for computers and phones.

Progress is stored in the current browser's local storage. It does not automatically transfer between devices, browsers, or the local-file and hosted versions. Clearing browser data can remove it.

Pronunciation currently uses available US-English device/browser voices. Kokoro audio has not yet been integrated. Missing dictionary definitions are explicitly marked. Contextual Vietnamese meanings are authored for the lessons; where an original English definition covers a different sense, a source-meaning note identifies the mismatch. Reading sources are listed inside each lesson. This is an independent learning project, not an official Oxford product; no blanket license is granted to third-party learning material.

## Update and verify

The app has no package dependencies or build requirement for use. With Node.js installed, run from this directory:

```sh
node build-advanced-readings.cjs
node integrate-v4.cjs
node test-a2.cjs
node test-b1.cjs
node test-advanced.cjs
node test-v4.cjs
```

`integrate-v4.cjs` combines the retained HTML baseline, current reading and grammar data, `ui-v4.js`, and `two-panels.css` into `index.html`. Retain the baseline and reading snapshots: the builder and regression checks use them. Historical authoring scripts are included for reference; do not run them all in sequence.

GitHub Actions validates the app and publishes only `index.html` on pushes to `main`. In **Settings → Pages**, use **GitHub Actions** as the publishing source.
