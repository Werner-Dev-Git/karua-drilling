# Karua Drilling

Marketing website for Karua Drilling — professional borehole drilling, solar
foundation drilling and fence post drilling across South Africa.

## Stack

Static site: hand-written HTML, CSS and vanilla JavaScript. No build step.
Bootstrap, Font Awesome and AOS are loaded from CDNs. Installable as a PWA via
`manifest.json` and `service-worker.js`.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home / landing page |
| `about.html` | About the company |
| `services.html` | Services offered |
| `contact.html` | Contact and quote request |
| `hero-landing.html` | Standalone hero variant |

## Local development

No build or dependencies — serve the directory over HTTP so the service worker
and manifest load correctly (opening the files via `file://` will not work):

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deployment

Deployed with GitHub Pages from the `main` branch, root folder. Pushing to
`main` republishes the site.

All internal asset paths are relative, so the site works both from a Pages
project subpath and from a custom domain at the root.

## License

See [LICENSE](LICENSE).
