# English Improve

Personal English vocabulary, grammar and reading practice, with English navigation and Vietnamese explanations.

## Use

Open `index.html` directly, or visit the GitHub Pages deployment linked in this repository's **Deployments** section.

- 5,943 vocabulary entries, CEFR filters, flashcards and quizzes.
- 120 grammar topics and 1,263 grammar questions.
- 152 readings in paired groups, including complete A2 and B1 vocabulary coverage.
- Learn words → read → practice, with explanations for all answer choices.
- Responsive navigation for computers and phones.

Progress is stored in the current browser's local storage. It does not automatically transfer between devices, browsers, or the local-file and hosted versions. Clearing browser data can remove it.

Pronunciation currently uses available US-English device/browser voices. Kokoro audio has not yet been integrated. Missing dictionary definitions are explicitly marked. Reading sources are listed inside each lesson. This is an independent learning project, not an official Oxford product; no blanket license is granted to third-party learning material.

## Update and verify

The app has no package dependencies or build requirement for use. With Node.js installed, run from this directory:

```sh
node integrate-v4.cjs
node test-a2.cjs
node test-b1.cjs
node test-v4.cjs
```

`integrate-v4.cjs` combines the retained HTML baseline, current reading and grammar data, `ui-v4.js`, and `two-panels.css` into `index.html`. Retain the baseline and reading snapshots: the builder and regression checks use them. Historical authoring scripts are included for reference; do not run them all in sequence.

GitHub Actions validates the app and publishes only `index.html` on pushes to `main`. In **Settings → Pages**, use **GitHub Actions** as the publishing source.
