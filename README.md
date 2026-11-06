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

All 5,943 vocabulary entries and 140 readings (72 A2 + 68 B1) use prerecorded Kokoro Michael (`am_michael`, US English) audio. Reading players support pause, seeking, and speed selection. Info & help beside Settings contains sources, audio provenance, usage instructions and data import. B2/C1 readings do not yet have prerecorded audio. The MP3 files load on demand and need a connection on the hosted site; to use locally, download the repository and keep the `audio/` folder next to `index.html`. There is no promised permanent browser audio cache.

Missing dictionary definitions are explicitly marked. Contextual Vietnamese meanings are authored for the lessons; where an original English definition covers a different sense, a source-meaning note identifies the mismatch. Reading sources are listed inside each lesson. This is an independent learning project, not an official Oxford product; no blanket license is granted to third-party learning material.

## Update and verify

The app has no package dependencies or build requirement for use. With Node.js installed, run from this directory:

```sh
node build-advanced-readings.cjs
node integrate-v4.cjs
node audio-tools/install.cjs
node audio-tools/update-controls.cjs
node test-audio.cjs
node test-audio-controls.cjs
node test-a2.cjs
node test-b1.cjs
node test-advanced.cjs
node test-v4.cjs
```

`integrate-v4.cjs` combines the retained HTML baseline, current reading and grammar data, `ui-v4.js`, and `two-panels.css` into `index.html`. Retain the baseline and reading snapshots: the builder and regression checks use them. Historical authoring scripts are included for reference; do not run them all in sequence.

GitHub Actions validates the app and publishes `index.html` and `audio/` on pushes to `main`. In **Settings → Pages**, use **GitHub Actions** as the publishing source.

## Recreate audio

In `audio-tools/`, install the locked dependencies with pnpm, then run `node generate.cjs --scope=all` and `node install.cjs`. Generation uses the official `onnx-community/Kokoro-82M-v1.0-ONNX` model (fp32 CPU), voice `am_michael`, speed 1, and mono 24 kHz / 64 kbps MP3. The initial model download needs a connection; the cached model is excluded from Git. Generation resumes from checked file sizes and input hashes. Vocabulary entries share files when the spoken text is identical; stress-changing homographs have separate noun/verb/adjective phoneme inputs. Readings contain the full English body, divided into bounded synthesis requests and joined into one file. Definitions, translations, and exercises are not narrated.

Generation metadata checks completeness, duration, and non-silent samples; it is not a human pronunciation review of every recording. Kokoro: https://github.com/hexgrad/kokoro (Apache-2.0 model/library). MP3 encoding uses LAME through lamejs 1.2.1 or FFmpeg (`ffmpeg-static` 5.3.0). These build dependencies are not shipped to visitors; only their generated audio is served.

The default scope (without `--scope=all`) generates only A2 audio. Matching recordings are reused when resuming either scope. After generation, refresh the manifest with `install.cjs`, apply `update-controls.cjs`, and run the checks above before publishing.

## Listening controls

- `Alt+P`: play/pause. Settings at the bottom of the main sidebar selects replay: Alt+R (default), R, Space or Off; saved per browser.
- `Alt+-` / `Alt+=`: slower/faster (0.5×–2×), saved in this browser.
- Readings have a compact fixed-bottom player with one timeline, play/pause, replay and speed. A–B looping is no longer included.
- Shortcuts do not activate in input fields or editable text. Touch controls offer the same actions.
- The Light/Dark button in the header saves the chosen theme; the initial theme follows the device preference.

Vietnamese help is hidden behind “Show Vietnamese meaning” in vocabulary, flashcards and reading word lists/dialogs. All 5,943 entries have help: A1 uses authored common meanings (`a1-vietnamese.txt`); A2–C1 reuse the existing contextual lesson meanings, explicitly labelled as contextual rather than translations of the source dictionary definition. Imported custom meanings take precedence.
