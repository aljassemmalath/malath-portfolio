# Portfolio rebrand — what to do

1. Copy `index.html`, `css/main.css`, `assets/images/fluted-hero.jpg` into your project (merge `assets/images`).
2. If you compile Sass yourself, replace your `scss/` folder with this one and run your usual build.
   New file: `scss/_brand.scss` (serif headlines + fluted glass). Remove its `@use` in `main.scss` to turn it off.
3. Colours live in `scss/_variables.scss` (`$brand-*`). Everything else references them.
4. Optional: `make_hero.py` regenerates the fluted hero image (needs numpy + pillow).
