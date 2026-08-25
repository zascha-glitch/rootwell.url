# Rootwell — 4-i-1 Wellness Herbal Diffusion Pen

Nettside for Rootwell-produktet.

## Lagrede lenker

| Hva | Lenke |
|-----|-------|
| **Prosjektmappe (Mac)** | `~/rootwell` |
| **GitHub-repo** | https://github.com/zascha-glitch/rootwell.url |
| **Nettside** | https://rootwell.no/ |
| **GitHub Pages-innstillinger** | https://github.com/zascha-glitch/rootwell.url/settings/pages |
| **Gammel GitHub-adresse** | https://zascha-glitch.github.io/rootwell.url/ |

Nettside-lenken er **reservert** til repoet ditt. Når du slår på GitHub Pages igjen, får du samme adresse tilbake.

## Se siden lokalt (privat)

```bash
cd ~/rootwell
python3 -m http.server 8080
```

Åpne http://localhost:8080 i nettleseren.

## Slik mottar du bestillinger (Formspree)

1. Gå til https://formspree.io og opprett gratis konto
2. Lag et nytt skjema og kopier URL-en (f.eks. `https://formspree.io/f/abcxyzab`)
3. Lim inn URL-en i `script.js` på linjen `FORMSPREE_ENDPOINT`
4. Last opp oppdaterte filer til GitHub

Da får du e-post hver gang noen sender bestillingsskjemaet.

## Betaling

Kunder betaler med **Vipps** til spareboks **8274JQ**. Nummeret står i `index.html` og `script.js` — søk etter `8274JQ` for å oppdatere.

## Endre pris

Prisen og tilbudene står i `index.html` — søk etter `249` for å oppdatere.

## Publiser igjen når du er klar

1. Gå til https://github.com/zascha-glitch/rootwell.url/settings/pages
2. Under **Branch**, velg `main` og **/ (root)**
3. Klikk **Save**

## Filer

- `index.html` — nettsiden
- `styles.css` — design
- `script.js` — meny og bestillingsskjema
- `favicon.svg` — ikon i nettleserfanen
- `images/product.jpg` — produktbilde (optimert)
