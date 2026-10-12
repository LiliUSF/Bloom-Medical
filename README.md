# Bloom Medical


A static, fictional medical-clinic website created for ISM 6225, Assignment 1 – Look and Feel. The project is a browser-only academic demonstration, not a real clinic or medical service.


## Pages


- `index.html` — clinic introduction, services, fictional sample statistics, and location/hours placeholders.
- `aboutus.html` — student developer profile for Lisandra Kennell and implementation notes.
- `appointments.html` — mock appointment create, read, update, and delete flows. Examples are stored in this browser's localStorage.
- `analytics.html` — Chart.js charts based on the browser's fictional appointment records.


## Preview locally


Open this folder in VS Code and use **Live Server** on `index.html`, or run a static file server from this directory, for example:


```sh
python -m http.server 8000
```


Then visit `http://localhost:8000/`. A local server is recommended so the Chart.js CDN and browser storage work consistently.


## GitHub Pages


The source repository is [github.com/LiliUSF/Bloom-Medical](https://github.com/LiliUSF/Bloom-Medical). The site files are at the repository root, and GitHub Pages publishes the `main` branch through its Pages deployment workflow. After a change is pushed to `main` and the workflow completes, the site is available at `https://liliusf.github.io/Bloom-Medical/`. GitHub Pages settings are under **Settings → Pages**.


## Demo data and privacy


All patient names, appointment details, clinic statistics, and analytics are fictional sample data. The appointment demo writes only to this browser's `localStorage`; it does not submit to a server or connect to a medical system. Never enter real patient information. The analytics page loads Chart.js 4.4.8 from jsDelivr and shows an error message if the CDN cannot be reached.

# Bloom Medical

A static, fictional medical-clinic website created for ISM 6225, Assignment 1 – Look and Feel. The project is a browser-only academic demonstration, not a real clinic or medical service.

## Pages

- `index.html` — clinic introduction, services, fictional sample statistics, and location/hours placeholders.
- `aboutus.html` — student developer profile and implementation notes. Replace `[Your Name]` and add a personal example of relevant professional experience before submitting.
- `appointments.html` — mock appointment create, read, update, and delete flows. Examples are stored in this browser's localStorage.
- `analytics.html` — Chart.js charts based on the browser's fictional appointment records.

## Preview locally

Open this folder in VS Code and use **Live Server** on `index.html`, or run a static file server from this directory, for example:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000/`. A local server is recommended so the Chart.js CDN and browser storage work consistently.

## GitHub Pages

The source repository is [github.com/LiliUSF/Bloom-Medical](https://github.com/LiliUSF/Bloom-Medical). Upload the contents of this folder to the repository root if this assignment is the repository's published site, then in GitHub open **Settings → Pages**, choose **Deploy from a branch**, select the `main` branch and `/ (root)`, and save. After GitHub finishes publishing, the site will be available at `https://liliusf.github.io/Bloom-Medical/`.

If this folder remains nested in another repository, Pages serves the existing repository root as its home page; the assignment pages will be under `/bloom-medical/` unless the Pages publishing source is configured to this folder.

## Demo data and privacy

All patient names, appointment details, clinic statistics, and analytics are fictional sample data. The appointment demo writes only to this browser's `localStorage`; it does not submit to a server or connect to a medical system. Never enter real patient information. The analytics page loads Chart.js 4.4.8 from jsDelivr and shows an error message if the CDN cannot be reached.
