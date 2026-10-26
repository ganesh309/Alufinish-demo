# Italtecno India — demo website

A static, mobile-friendly demo site built from the Italtecno India product catalogue
(`Product Catalog 1.pdf`), with the information architecture modelled on alufinish.de.

## Run it

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Pages

| File | Content |
| --- | --- |
| `index.html` | Hero, what we do, why Italtecno, product finder, technology highlights, sustainability, locations |
| `anodizing-chemicals.html` | 10 process steps, 32 products, step filter |
| `pretreatment-chemicals.html` | 5 product groups, 3 process sequences |
| `plants.html` | Anodizing plant, powder coating plant (vertical / compact / horizontal), die cleaning & caustic soda recovery |
| `equipment.html` | Multicolor, FREEAL Plus, ADC dosing, pulse rectifier, Tecno 7S, tools |
| `water-treatment.html` | Waste / process / primary water treatment, units |
| `about.html` | Company, competences, locations |
| `contact.html` | Demo form (prepares an email), addresses |

## Editing

The pages are generated from `src/`:

- `src/layout.html` — shared head, top bar, header, mobile menu, footer
- `src/pages/*.html` — page content with a small metadata comment at the top

After editing anything in `src/`, rebuild:

```bash
node build.js
```

Styles live in `assets/css/styles.css`, behaviour in `assets/js/main.js`,
images in `assets/img/` (cropped from the catalogue), and the catalogue PDF in `assets/docs/`.
