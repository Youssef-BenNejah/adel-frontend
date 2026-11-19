import math
from PIL import Image, ImageDraw

SRC = r"C:\Users\ops\AppData\Local\Temp\claude\836f273e5199a692\9fbda9ee-d4d5-471f-8ba8-d992054fc7ed\images\2.png"
OUT = r"C:\Users\ops\Desktop\1\public\brand"
import os
os.makedirs(OUT, exist_ok=True)

im = Image.open(SRC).convert("RGB")
W, H = im.size
px = im.load()

# --- estimate background color from border samples ---
samples = []
for x in range(0, W, 7):
    samples.append(px[x, 0])
    samples.append(px[x, H - 1])
for y in range(0, H, 7):
    samples.append(px[0, y])
    samples.append(px[W - 1, y])
bg = tuple(sum(c[i] for c in samples) / len(samples) for i in range(3))

LOW, HIGH = 40.0, 120.0

def dist(c):
    return math.sqrt(sum((c[i] - bg[i]) ** 2 for i in range(3)))

# --- build RGBA with soft alpha keyed off distance from bg ---
rgba = Image.new("RGBA", (W, H))
rpx = rgba.load()
for y in range(H):
    for x in range(W):
        c = px[x, y]
        d = dist(c)
        if d <= LOW:
            a = 0
        elif d >= HIGH:
            a = 255
        else:
            a = int((d - LOW) / (HIGH - LOW) * 255)
        rpx[x, y] = (c[0], c[1], c[2], a)

def bbox_of(alpha_img, threshold=10):
    bbox = alpha_img.point(lambda p: 255 if p > threshold else 0).getbbox()
    return bbox

alpha = rgba.split()[3]
full_bbox = bbox_of(alpha)
pad = 14

def padded_crop(img, box, pad):
    l, t, r, b = box
    l = max(0, l - pad); t = max(0, t - pad)
    r = min(img.width, r + pad); b = min(img.height, b + pad)
    return img.crop((l, t, r, b))

full = padded_crop(rgba, full_bbox, pad)
full.save(f"{OUT}/logo-full-color.png")

# --- find the horizontal gap rows (icon / ADEL / FRAGRANCE bands) within full_bbox ---
l, t, r, b = full_bbox
row_has_ink = []
for y in range(t, b):
    s = 0
    for x in range(l, r, 2):
        s += rpx[x, y][3]
    row_has_ink.append((y, s))

# find contiguous bands of rows with ink
bands = []
in_band = False
start = None
for y, s in row_has_ink:
    if s > 200 and not in_band:
        in_band = True; start = y
    elif s <= 200 and in_band:
        in_band = False; bands.append((start, y))
if in_band:
    bands.append((start, row_has_ink[-1][0] + 1))

print("bg:", bg)
print("full_bbox:", full_bbox)
print("bands:", bands)

# bands expected: [icon, ADEL, FRAGRANCE]
icon_band = bands[0]
word_band = bands[1] if len(bands) > 1 else None
sub_band = bands[2] if len(bands) > 2 else None

def crop_band(band, pad_v=10):
    if band is None:
        return None
    yt, yb = band
    yt = max(0, yt - pad_v); yb = min(H, yb + pad_v)
    row_alpha = alpha.crop((0, yt, W, yb))
    bb = row_alpha.getbbox()
    if bb is None:
        return None
    x0, _, x1, _ = bb
    x0 = max(0, x0 - pad_v); x1 = min(W, x1 + pad_v)
    return rgba.crop((x0, yt, x1, yb))

icon = crop_band(icon_band)
icon.save(f"{OUT}/logo-icon-color.png")

word = crop_band(word_band)
if word:
    word.save(f"{OUT}/logo-wordmark-adel.png")

sub = crop_band(sub_band)
if sub:
    sub.save(f"{OUT}/logo-wordmark-fragrance.png")

# --- mono recolors (ink-900 / cream-50) from alpha-only silhouettes ---
INK = (26, 19, 16)
CREAM = (255, 253, 251)

def recolor(img, rgb):
    a = img.split()[3]
    solid = Image.new("RGBA", img.size, rgb + (0,))
    solid.putalpha(a)
    return solid

for name, src_img in [("logo-full", full), ("logo-icon", icon)]:
    recolor(src_img, INK).save(f"{OUT}/{name}-mono-ink.png")
    recolor(src_img, CREAM).save(f"{OUT}/{name}-mono-cream.png")

# --- horizontal lockup: icon + "ADEL" wordmark side by side ---
if word:
    target_h = 120
    def scale_to_h(img, h):
        ratio = h / img.height
        return img.resize((max(1, int(img.width * ratio)), h), Image.LANCZOS)
    icon_h = scale_to_h(icon, target_h)
    word_h = scale_to_h(word, int(target_h * 0.72))
    gap = 28
    canvas_w = icon_h.width + gap + word_h.width
    canvas_h = target_h
    horiz = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    horiz.paste(icon_h, (0, 0), icon_h)
    word_y = canvas_h - word_h.height - int(target_h * 0.06)
    horiz.paste(word_h, (icon_h.width + gap, word_y), word_h)
    horiz.save(f"{OUT}/logo-horizontal-color.png")
    recolor(horiz, INK).save(f"{OUT}/logo-horizontal-mono-ink.png")
    recolor(horiz, CREAM).save(f"{OUT}/logo-horizontal-mono-cream.png")

# --- favicons / app icons from the icon mark, padded onto square canvases ---
def square_pad(img, ratio=0.74):
    side = int(max(img.size) / ratio)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - img.width) // 2, (side - img.height) // 2), img)
    return canvas

icon_sq = square_pad(icon)

sizes_transparent = [16, 32, 48, 64, 96, 192, 512]
for s in sizes_transparent:
    icon_sq.resize((s, s), Image.LANCZOS).save(f"{OUT}/icon-{s}.png")

# favicon.ico multi-size
icon_sq.resize((16, 16), Image.LANCZOS).save(
    f"{OUT}/favicon.ico",
    sizes=[(16, 16), (32, 32), (48, 48)],
)

# solid-background variants for apple-touch-icon / maskable (no transparency)
CREAM_BG = (251, 247, 240, 255)  # cream-100
def solid_bg_icon(img, size, bg=CREAM_BG, content_ratio=0.62):
    canvas = Image.new("RGBA", (size, size), bg)
    target = int(size * content_ratio)
    ratio = target / max(img.size)
    resized = img.resize((int(img.width * ratio), int(img.height * ratio)), Image.LANCZOS)
    canvas.paste(resized, ((size - resized.width) // 2, (size - resized.height) // 2), resized)
    return canvas.convert("RGB")

solid_bg_icon(icon, 180).save(f"{OUT}/apple-touch-icon.png")
solid_bg_icon(icon, 192).convert("RGBA").save(f"{OUT}/icon-maskable-192.png")
solid_bg_icon(icon, 512).convert("RGBA").save(f"{OUT}/icon-maskable-512.png")

print("done")
print("icon size:", icon.size, "word size:", word.size if word else None)
