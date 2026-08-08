# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **static marketing site** (no Node/Python package manager, no backend, no Docker). See `README.md` for local preview and Formspree setup.

### Run locally

```bash
python3 -m http.server 8080
```

Open http://127.0.0.1:8080 — serve from the repo root so `index.html`, `styles.css`, `script.js`, and `images/` resolve correctly.

### Lint / test / build

There is **no** package manifest, linter, test suite, or build step. Validate by loading the page and exercising the order form (`#order-form` in `script.js`).

### Gotchas

- **Port 8080** may already be in use (another `python3 -m http.server`). Kill the existing listener or choose another port.
- Form submissions go to **Formspree** (`FORMSPREE_ENDPOINT` in `script.js`). A successful submit shows the green status under the form; real emails are sent to the Formspree account owner — mark cloud-agent test orders clearly (e.g. name/address prefixed with `TEST`).
- Orders assume **Wise** payment (IBAN) outside the site; the form only collects delivery details.
