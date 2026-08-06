"""Build the LifeOS vector and raster brand asset set.

The construction is intentionally deterministic: a single geometric mark and
one outlined Manrope wordmark produce every exported variant.
"""

from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfgen import canvas
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont as FontToolsTTFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "brand"
FONT = OUT / "fonts" / "Manrope-Bold.ttf"

BLUE = "#1478FF"
CYAN = "#02B6E8"
PURPLE = "#6D28D9"
GREEN = "#18C981"
INK = "#0B1538"
MUTED = "#60708F"
DARK = "#081331"
WHITE = "#FFFFFF"


def ensure_dirs() -> None:
    for name in ("svg", "png", "icons", "pdf", "fonts"):
        (OUT / name).mkdir(parents=True, exist_ok=True)


def mark_svg(prefix: str, monochrome: str | None = None) -> str:
    """Return the 240-unit master mark with mathematically balanced orbit."""
    orbit = monochrome or f"url(#{prefix}-orbit)"
    core = monochrome or f"url(#{prefix}-core)"
    accent = monochrome or GREEN
    defs = "" if monochrome else f"""
  <defs>
    <linearGradient id="{prefix}-orbit" x1="35" y1="35" x2="205" y2="205" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="{CYAN}"/>
      <stop offset="0.48" stop-color="{BLUE}"/>
      <stop offset="1" stop-color="{PURPLE}"/>
    </linearGradient>
    <linearGradient id="{prefix}-core" x1="96" y1="94" x2="145" y2="151" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="{CYAN}"/>
      <stop offset="0.5" stop-color="{BLUE}"/>
      <stop offset="1" stop-color="{PURPLE}"/>
    </linearGradient>
  </defs>"""
    circumference = 2 * math.pi * 76
    visible = circumference * (300 / 360)
    gap = circumference - visible
    dot_x = 120 + 76 * math.cos(math.radians(315))
    dot_y = 120 + 76 * math.sin(math.radians(315))
    return f"""{defs}
  <circle cx="120" cy="120" r="76" fill="none" stroke="{orbit}" stroke-width="18" stroke-linecap="round" stroke-dasharray="{visible:.3f} {gap:.3f}"/>
  <circle cx="120" cy="120" r="28" fill="{core}"/>
  <circle cx="{dot_x:.3f}" cy="{dot_y:.3f}" r="6" fill="{accent}"/>"""


def wordmark_svg(color: str, x: int = 250, y: int = 139) -> str:
    """Return a fully outlined Manrope Bold wordmark for portable SVG output."""
    vector_font = FontToolsTTFont(str(FONT))
    glyph_set = vector_font.getGlyphSet()
    cmap = vector_font.getBestCmap()
    units_per_em = vector_font["head"].unitsPerEm
    scale = 88 / units_per_em
    layout_font = ImageFont.truetype(str(FONT), 88)
    paths: list[str] = []
    for index, char in enumerate("LifeOS"):
        glyph_name = cmap[ord(char)]
        pen = SVGPathPen(glyph_set)
        glyph_set[glyph_name].draw(pen)
        offset = layout_font.getlength("LifeOS"[:index])
        paths.append(
            f'<path d="{pen.getCommands()}" fill="{color}" '
            f'transform="translate({x + offset:.3f} {y}) scale({scale:.6f} {-scale:.6f})"/>'
        )
    vector_font.close()
    return "\n  ".join(paths)


def svg_doc(body: str, viewbox: str, width: int, height: int, background: str | None = None) -> str:
    bg = f'<rect width="100%" height="100%" fill="{background}"/>' if background else ""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="{viewbox}" role="img" aria-label="LifeOS logo">
  {bg}
{body}
</svg>
"""


def write_svg_assets() -> None:
    horizontal = f'<g transform="translate(12 0) scale(.833333)">{mark_svg("main")}</g>\n  {wordmark_svg(INK, 220, 137)}'
    (OUT / "svg" / "lifeos-logo.svg").write_text(svg_doc(horizontal, "0 0 620 200", 1240, 400), encoding="utf-8")

    black = f'<g transform="translate(12 0) scale(.833333)">{mark_svg("black", "#000000")}</g>\n  {wordmark_svg("#000000", 220, 137)}'
    (OUT / "svg" / "lifeos-logo-black.svg").write_text(svg_doc(black, "0 0 620 200", 1240, 400), encoding="utf-8")

    white = f'<g transform="translate(12 0) scale(.833333)">{mark_svg("white", WHITE)}</g>\n  {wordmark_svg(WHITE, 220, 137)}'
    (OUT / "svg" / "lifeos-logo-white.svg").write_text(svg_doc(white, "0 0 620 200", 1240, 400), encoding="utf-8")

    light = f'<g transform="translate(12 0) scale(.833333)">{mark_svg("light")}</g>\n  {wordmark_svg(INK, 220, 137)}'
    (OUT / "svg" / "lifeos-logo-light.svg").write_text(svg_doc(light, "0 0 620 200", 1240, 400, WHITE), encoding="utf-8")

    dark = f'<g transform="translate(12 0) scale(.833333)">{mark_svg("dark")}</g>\n  {wordmark_svg(WHITE, 220, 137)}'
    (OUT / "svg" / "lifeos-logo-dark.svg").write_text(svg_doc(dark, "0 0 620 200", 1240, 400, DARK), encoding="utf-8")

    (OUT / "svg" / "lifeos-mark.svg").write_text(svg_doc(mark_svg("mark"), "0 0 240 240", 240, 240), encoding="utf-8")
    (OUT / "svg" / "lifeos-favicon.svg").write_text(svg_doc(mark_svg("fav"), "28 28 184 184", 64, 64), encoding="utf-8")


def gradient_color(t: float) -> tuple[int, int, int, int]:
    stops = [(2, 182, 232), (20, 120, 255), (109, 40, 217)]
    if t <= 0.48:
        a, b, u = stops[0], stops[1], t / 0.48
    else:
        a, b, u = stops[1], stops[2], (t - 0.48) / 0.52
    return tuple(round(a[i] + (b[i] - a[i]) * u) for i in range(3)) + (255,)


def draw_mark(size: int, background: str | None = None, monochrome: str | None = None, safe_scale: float = 1.0) -> Image.Image:
    scale = size / 240 * safe_scale
    canvas_size = size
    image = Image.new("RGBA", (canvas_size, canvas_size), background or (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    cx = cy = size / 2
    radius = 76 * scale
    stroke = max(2, round(18 * scale))
    bbox = [cx - radius, cy - radius, cx + radius, cy + radius]
    if monochrome:
        draw.arc(bbox, 0, 300, fill=monochrome, width=stroke)
    else:
        # Many short arcs preserve the master diagonal gradient in raster form.
        for angle in range(0, 300):
            x = cx + radius * math.cos(math.radians(angle))
            y = cy + radius * math.sin(math.radians(angle))
            t = (x + y - (2 * cx - radius * math.sqrt(2))) / (2 * radius * math.sqrt(2))
            draw.arc(bbox, angle, angle + 1.5, fill=gradient_color(max(0, min(1, t))), width=stroke)
    # Pillow arcs have butt ends, so explicitly add mathematically round caps.
    cap_r = stroke / 2
    for angle in (0, 300):
        x = cx + radius * math.cos(math.radians(angle))
        y = cy + radius * math.sin(math.radians(angle))
        t = (x + y - (2 * cx - radius * math.sqrt(2))) / (2 * radius * math.sqrt(2))
        color = monochrome or gradient_color(max(0, min(1, t)))
        draw.ellipse([x - cap_r, y - cap_r, x + cap_r, y + cap_r], fill=color)
    core_r = 28 * scale
    if monochrome:
        draw.ellipse([cx - core_r, cy - core_r, cx + core_r, cy + core_r], fill=monochrome)
    else:
        mask = Image.new("L", image.size, 0)
        ImageDraw.Draw(mask).ellipse([cx - core_r, cy - core_r, cx + core_r, cy + core_r], fill=255)
        grad = Image.new("RGBA", image.size)
        pixels = grad.load()
        for yy in range(max(0, int(cy-core_r)), min(size, int(cy+core_r)+1)):
            for xx in range(max(0, int(cx-core_r)), min(size, int(cx+core_r)+1)):
                t = (xx + yy - (2 * cx - core_r * math.sqrt(2))) / (2 * core_r * math.sqrt(2))
                pixels[xx, yy] = gradient_color(max(0, min(1, t)))
        image.alpha_composite(Image.composite(grad, Image.new("RGBA", image.size), mask))
        draw = ImageDraw.Draw(image)
    dot_x = cx + radius * math.cos(math.radians(315))
    dot_y = cy + radius * math.sin(math.radians(315))
    dot_r = 6 * scale
    draw.ellipse([dot_x-dot_r, dot_y-dot_r, dot_x+dot_r, dot_y+dot_r], fill=monochrome or GREEN)
    return image


def draw_horizontal(width: int, height: int, background: str | None = None, word_color: str = INK, monochrome: str | None = None) -> Image.Image:
    image = Image.new("RGBA", (width, height), background or (0, 0, 0, 0))
    mark_size = round(height * 0.9)
    mark = draw_mark(mark_size, monochrome=monochrome)
    image.alpha_composite(mark, (round(height * 0.05), round(height * 0.05)))
    font = ImageFont.truetype(str(FONT), round(height * 0.44))
    draw = ImageDraw.Draw(image)
    draw.text((round(height * 1.06), round(height * 0.23)), "LifeOS", font=font, fill=word_color, anchor="la", stroke_width=0)
    return image


def write_png_assets() -> None:
    variants = {
        "lifeos-logo-transparent.png": (None, INK, None),
        "lifeos-logo-black.png": (None, "#000000", "#000000"),
        "lifeos-logo-white.png": (None, WHITE, WHITE),
        "lifeos-logo-light.png": (WHITE, INK, None),
        "lifeos-logo-dark.png": (DARK, WHITE, None),
    }
    for filename, (background, word_color, mono) in variants.items():
        draw_horizontal(2480, 800, background, word_color, mono).save(OUT / "png" / filename, optimize=True)

    draw_mark(1024, background=WHITE).convert("RGB").save(OUT / "icons" / "lifeos-app-icon.png", optimize=True)
    draw_mark(1024, background=DARK).convert("RGB").save(OUT / "icons" / "lifeos-ios-icon.png", optimize=True)
    draw_mark(1024, safe_scale=0.66).save(OUT / "icons" / "lifeos-android-adaptive-foreground.png", optimize=True)
    draw_mark(512, monochrome=WHITE).save(OUT / "icons" / "lifeos-android-monochrome.png", optimize=True)
    favicon = draw_mark(64)
    favicon.save(OUT / "icons" / "lifeos-favicon-64.png", optimize=True)
    favicon.resize((32, 32), Image.Resampling.LANCZOS).save(OUT / "icons" / "lifeos-favicon-32.png", optimize=True)
    favicon.save(OUT / "icons" / "lifeos-favicon.ico", sizes=[(16,16),(32,32),(48,48),(64,64)])
    splash_light = draw_horizontal(2048, 640, None, INK, None)
    splash_light.save(OUT / "icons" / "lifeos-splash-logo.png", optimize=True)
    splash_light.save(OUT / "icons" / "lifeos-splash-logo-light.png", optimize=True)
    draw_horizontal(2048, 640, None, WHITE, None).save(OUT / "icons" / "lifeos-splash-logo-dark.png", optimize=True)


def write_pdf() -> None:
    pdf_path = OUT / "pdf" / "lifeos-logo.pdf"
    c = canvas.Canvas(str(pdf_path), pagesize=(620, 200), pageCompression=1)
    c.setFillColor(INK)
    # Draw orbit as a vector path with round caps simulated by endpoint circles.
    c.setLineWidth(15)
    c.setLineCap(1)
    # Vector arc segments form the same diagonal cyan-to-purple gradient as SVG.
    for angle in range(0, -300, -1):
        radians = math.radians(angle)
        t = (math.cos(radians) - math.sin(radians) + math.sqrt(2)) / (2 * math.sqrt(2))
        red, green, blue, _ = gradient_color(t)
        c.setStrokeColorRGB(red / 255, green / 255, blue / 255)
        c.arc(36, 20, 186, 170, startAng=angle, extent=-1.5)
    for angle in (0, 60):
        x = 111 + 75 * math.cos(math.radians(angle))
        y = 95 + 75 * math.sin(math.radians(angle))
        radians = math.radians(angle)
        t = (math.cos(radians) - math.sin(radians) + math.sqrt(2)) / (2 * math.sqrt(2))
        red, green, blue, _ = gradient_color(t)
        c.setFillColorRGB(red / 255, green / 255, blue / 255)
        c.circle(x, y, 7.5, fill=1, stroke=0)
    c.saveState()
    core = c.beginPath()
    core.circle(111, 95, 28)
    c.clipPath(core, stroke=0, fill=0)
    c.linearGradient(83, 123, 139, 67, (CYAN, BLUE, PURPLE), positions=(0, 0.48, 1), extend=True)
    c.restoreState()
    c.setFillColor(GREEN)
    c.circle(111 + 75*math.cos(math.radians(30)), 95 + 75*math.sin(math.radians(30)), 6, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Manrope", 88)
    c.drawString(220, 68, "LifeOS")
    c.showPage()
    c.save()


def main() -> None:
    ensure_dirs()
    if not FONT.exists():
        raise FileNotFoundError(f"Missing font: {FONT}")
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    pdfmetrics.registerFont(TTFont("Manrope", str(FONT)))
    write_svg_assets()
    write_png_assets()
    write_pdf()


if __name__ == "__main__":
    main()
