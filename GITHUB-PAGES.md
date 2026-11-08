# Publish the portfolio on GitHub Pages

The landing page is the static site in `docs/`:

- `docs/index.html`
- `docs/styles.css`
- `docs/site.js`
- `docs/media/` (portrait and project photos)
- `docs/.nojekyll`

GitHub Pages serves `docs/` as the site root. There are three public portfolios, one per career path:

- Data Analyst: https://duducm2.github.io/my-personal-repo/data-analyst/
- Product Owner: https://duducm2.github.io/my-personal-repo/product-owner/
- Digital Solution Architect: https://duducm2.github.io/my-personal-repo/digital-solution-architect/
- UX Researcher & Design Technologist: https://duducm2.github.io/my-personal-repo/ux-researcher/

Each public page stands alone. It does not link to the other two, and the site root does not list them. Share one address with a given opening. The same three addresses stay on the career profile for you. In the cockpit, **Portfolio** opens a menu with Data Analyst, Product Owner, and Digital Solution Architect. Each item opens the local page at `http://127.0.0.1:8770/portfolio/` plus that path.

## 1. Commit and push `docs/`

From this repository, commit the `docs/` folder (and this guide, if you want it in the repo) and push to `main` on `https://github.com/duducm2/my-personal-repo`.

GitHub Pages only publishes what is on the branch you select. The rest of the repository, including `my-data/`, is not copied into the site when the source folder is `/docs`.

## 2. Turn on Pages

1. Open https://github.com/duducm2/my-personal-repo/settings/pages
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Set **Branch** to `main` and the folder to `/docs`.
4. Save.

Leave the custom domain empty. Do not enable Jekyll. `docs/.nojekyll` already tells GitHub to publish the files as they are.

## 3. Wait for the first deploy

1. Open the **Actions** tab, or return to Settings → Pages.
2. Wait until the deployment status is successful. The first run often takes one to two minutes.
3. Open https://duducm2.github.io/my-personal-repo/

Open each path address on its own. You should see Eduardo Figueiredo, the portrait, the chapter rail, and that path's opening line. The page should not offer the other paths.

If the page is a 404, check that `docs/index.html` is on `main` and that the folder setting is `/docs`, not `/ (root)`.

## 4. Share the four links

- https://duducm2.github.io/my-personal-repo/ux-researcher/
- https://duducm2.github.io/my-personal-repo/data-analyst/
- https://duducm2.github.io/my-personal-repo/product-owner/
- https://duducm2.github.io/my-personal-repo/digital-solution-architect/

Relative paths (`../styles.css`, `../site.js`, `../media/`) stay correct on a project site, because the browser resolves them under `/my-personal-repo/<career-path>/`.

## 5. Update the profile if a URL ever changes

`my-data/canonical/profile.csv` stores:

- `site_data_analyst_url`
- `site_product_owner_url`
- `site_digital_solution_architect_url`

If you later move the site or add a custom domain, replace those three values and refresh the Profile page. Each pill copies that path's public address.
