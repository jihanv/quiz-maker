# quiz-maker

A Next.js application for generating reading and vocabulary multiple-choice tests from pasted passages.

The most complete workflow in this repository is the **cloze generator**:

1. A user pastes a passage into the `/cloze-generator` page.
2. The client sends the text to `/api/cloze-generator`.
3. The server builds a cloze-style multiple-choice test.
4. The client downloads the result as a `.docx` file.

The repository also includes additional routes for `/custom-generator`, `/custom-two`, and `/sentenceFiller`.

---

## Overview

`quiz-maker` processes a passage and turns it into a multiple-choice vocabulary exercise.

The implemented cloze-generation pipeline includes:

- validating paragraph input with Zod
- dividing a passage into sentence-aware sections
- selecting one difficult word per section
- replacing selected words with numbered blanks
- generating multiple-choice distractors
- exporting the final test and answer key as a Word document

---

## Features

### Cloze test generation

The cloze generator accepts a passage, analyzes it, and creates a downloadable test document.

### Passage segmentation

The passage is divided into sections near a target length while preserving sentence boundaries as carefully as possible.

### Difficult word selection

The pipeline selects one target word per section using dictionary and frequency-based filtering, while avoiding reused stems and proper nouns.

### Multiple-choice answer generation

Distractors are generated using part-of-speech and word-form matching, then shuffled into answer choices.

### DOCX export

Generated content is exported as a `.docx` file using the `docx` package.

---

## Tech Stack

### Core framework

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### Form and state management

- React Hook Form
- Zod
- Zustand

### Quiz-generation dependencies

- `docx`
- `compromise`
- `nodewordfreq`
- `stemmer`

### Repository data sources

- `data/dictionary.json`
- `data/academicwordlist.txt`

### Package management

This repository is configured for **pnpm** and includes:

- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `.npmrc`

It also includes a checked-in patch for `nodewordfreq@0.2.1`.

---

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

### Open the app

The clearest implemented entry point is:

```text
http://localhost:3000/cloze-generator
```

---

## Available Scripts

### Development

```bash
pnpm dev
```

### Production build

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

### Testing

```bash
pnpm test
pnpm test:watch
pnpm test:vitest
pnpm test:vitest:watch
pnpm test:compromise
```

> The default `test` script runs **Vitest**, while `test:watch` runs **Jest**.

---

## How the Cloze Generator Works

### 1. Input validation

Submitted text is validated with a shared schema requiring a `sentence` string with a minimum length of 10 characters.

### 2. Passage division

The pipeline divides the text into sentence-aware sections and uses normalization utilities to handle punctuation patterns such as abbreviations, initials, ellipses, URLs, decimals, and section references.

### 3. Target word selection

For each section, the generator chooses a difficult word using dictionary membership and Zipf-frequency-based filtering.

### 4. Choice generation

The pipeline creates distractors by matching coarse part of speech and word form, then shuffles the answer set.

### 5. File export

The final output is converted into a Word document containing the passage, multiple-choice options, and answer key.

---

## Routes

### `/cloze-generator`

The main implemented vocabulary-test generator UI.

- uses `components/cloze-generator/clozeInput.tsx`
- posts to `/api/cloze-generator`
- downloads a generated `.docx`

### `/custom-generator`

An alternate custom-generation interface.

- splits text into paragraphs and tokens
- uses Zustand-backed state

### `/custom-two`

Another custom-generation route wired to `CustomSelector`.

### `/sentenceFiller`

A scaffolded route and API path.

- the current API uppercases submitted text
- it does not currently match the completed `.docx` generation flow used by the cloze generator

---

## Project Structure

```text
app/
  Route pages and API handlers

components/
  Feature-specific inputs and shared UI components

features/cloze-generator/
  Cloze generator logic and DOCX export

features/cloze-generator/pipeline/
  Passage splitting, difficult-word selection, and choice generation

lib/
lib/server/
  Shared utilities, constants, schemas, and server-side lexicon loading

data/
  Dictionary and word-list data used by the generator

stores/
  Zustand stores for cloze, custom-generator, and sentence-filler state

__tests__/
  Tests for pipeline behavior and text normalization
```

---

## Testing

The repository includes tests for:

- passage division
- pipeline smoke behavior
- sentence counting
- normalize / revert text behavior

Both **Jest** and **Vitest** configuration files are present.

---

## Current Status

The **cloze-generation workflow** is the most complete implementation in this repository.

Other routes such as `/custom-generator`, `/custom-two`, and `/sentenceFiller` are present, but they are less complete or more experimental than the cloze flow.

The checked-in `README.md` in the repository is currently minimal, so setup and usage details are not yet fully documented there.

---

## Missing Documentation

Based on the current repository contents, the following information is not clearly documented:

- deployment instructions
- environment variable requirements
- contribution guidelines
- release workflow
- production hosting details
