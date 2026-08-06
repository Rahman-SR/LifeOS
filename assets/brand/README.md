# LifeOS Brand Assets

This directory contains the production logo system for LifeOS. The artwork is
constructed from a 240 x 240 geometric grid: a 76-unit orbit, an 18-unit
rounded stroke, a 60-degree orbit gap, a 28-unit core, and a 6-unit accent
dot. The wordmark uses Manrope Bold. Both the variable source font and the
generated static Bold instance are included for repeatable exports.

## Files

- `svg/lifeos-logo.svg` - master transparent horizontal logo
- `svg/lifeos-logo-{black,white,light,dark}.svg` - color variants
- `svg/lifeos-mark.svg` - standalone symbol
- `svg/lifeos-favicon.svg` - small-size optimized symbol
- `png/` - 2x transparent, monochrome, light, and dark exports
- `icons/lifeos-app-icon.png` - 1024 x 1024 general app icon
- `icons/lifeos-ios-icon.png` - 1024 x 1024 opaque iOS icon
- `icons/lifeos-android-adaptive-foreground.png` - transparent adaptive foreground
- `icons/lifeos-android-monochrome.png` - Android themed icon source
- `icons/lifeos-favicon.{ico,png}` - browser icons
- `icons/lifeos-splash-logo.png` - default transparent splash-screen logo
- `icons/lifeos-splash-logo-{light,dark}.png` - theme-specific splash logos
- `pdf/lifeos-logo.pdf` - vector print export

## Color tokens

- Cyan: `#02B6E8`
- Blue: `#1478FF`
- Purple: `#6D28D9`
- Accent green: `#18C981`
- Ink: `#0B1538`
- Dark surface: `#081331`

The Manrope font is distributed under the SIL Open Font License. See
`fonts/OFL.txt`.

Rebuild all outputs with:

```powershell
python -m pip install -r scripts/requirements-brand.txt
python scripts/build-brand-assets.py
```
