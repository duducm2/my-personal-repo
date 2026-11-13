# -*- coding: utf-8 -*-
"""Generate realistic 'pinned to the wall' certificate visuals for web and PDF."""
from pathlib import Path
import math
from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "pictures" / "academia" / "docs"
MEDIA_DIR = ROOT / "docs" / "media"
MEDIA_DIR.mkdir(parents=True, exist_ok=True)


def create_supersampled_pushpin(size=160, color=(205, 32, 38)):
    """Render a crisp, photorealistic 3D pushpin with supersampling."""
    scale = 4
    w, h = size * scale, int(size * 1.35 * scale)
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # 1. Cast shadow of the pin onto paper
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.ellipse([w * 0.38, h * 0.58, w * 0.88, h * 0.88], fill=(0, 0, 0, 95))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12 * scale))
    im.paste(shadow, (0, 0), shadow)

    # 2. Metal needle (silver steel needle piercing down)
    nw = int(w * 0.038)
    nx = int(w * 0.5 - nw // 2)
    ny_top = int(h * 0.48)
    ny_bot = int(h * 0.78)
    # Needle shadow
    draw.polygon([(nx, ny_top), (nx + nw, ny_top), (nx + nw // 2, ny_bot)], fill=(150, 155, 160, 255))
    # Needle highlight
    draw.line([(nx + nw // 4, ny_top), (nx + nw // 2, ny_bot)], fill=(225, 230, 235, 255), width=int(1.5 * scale))

    # 3. Metallic brass collar between needle and plastic body
    c_top = int(h * 0.44)
    c_bot = int(h * 0.49)
    draw.ellipse([w * 0.38, c_top, w * 0.62, c_bot], fill=(185, 150, 80, 255))
    draw.arc([w * 0.38, c_top, w * 0.62, c_bot], start=180, end=360, fill=(240, 220, 140, 255), width=int(1.5 * scale))

    # 4. Lower flange rim of plastic head
    r_top = int(h * 0.40)
    r_bot = int(h * 0.48)
    rim_box = [w * 0.24, r_top, w * 0.76, r_bot]
    r_col = (max(0, color[0] - 50), max(0, color[1] - 50), max(0, color[2] - 50), 255)
    draw.ellipse(rim_box, fill=r_col)
    draw.arc(rim_box, start=180, end=360, fill=(255, 255, 255, 140), width=int(2 * scale))

    # 5. Concave neck
    neck = [(int(w * 0.34), int(h * 0.42)), (int(w * 0.66), int(h * 0.42)), (int(w * 0.58), int(h * 0.25)), (int(w * 0.42), int(h * 0.25))]
    draw.polygon(neck, fill=color)

    # 6. Spherical top knob
    head_box = [int(w * 0.18), int(h * 0.06), int(w * 0.82), int(h * 0.32)]
    draw.ellipse(head_box, fill=color)

    # 7. Shading on head (deep shadow on bottom right, specular on top left)
    shade_box = [int(w * 0.45), int(h * 0.18), int(w * 0.80), int(h * 0.30)]
    shade = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    shdraw = ImageDraw.Draw(shade)
    shdraw.ellipse(shade_box, fill=(0, 0, 0, 110))
    shade = shade.filter(ImageFilter.GaussianBlur(6 * scale))
    im.paste(shade, (0, 0), shade)

    spec_box = [int(w * 0.28), int(h * 0.10), int(w * 0.48), int(h * 0.20)]
    spec = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    spdraw = ImageDraw.Draw(spec)
    spdraw.ellipse(spec_box, fill=(255, 255, 255, 220))
    spec = spec.filter(ImageFilter.GaussianBlur(5 * scale))
    im.paste(spec, (0, 0), spec)

    # Scale down smoothly with Lanczos
    target_h = int(size * 1.35)
    return im.resize((size, target_h), Image.Resampling.LANCZOS)


def add_paper_shadow_and_pin(page_img, angle=0.0, pin_color=(205, 32, 38), pin_scale=0.18):
    """Wrap a certificate page with realistic paper border, drop shadow, angle, and a pushpin."""
    # Add subtle 1px border and 2px white matting to the certificate paper
    pw, ph = page_img.size
    paper = Image.new("RGBA", (pw + 8, ph + 8), (255, 255, 255, 255))
    pdraw = ImageDraw.Draw(paper)
    pdraw.rectangle([0, 0, pw + 7, ph + 7], outline=(215, 215, 215, 255), width=2)
    paper.paste(page_img.convert("RGBA"), (4, 4))

    # Add realistic double drop shadow: ambient soft shadow + directional shadow
    pad = 80
    sw, sh = paper.size[0] + pad * 2, paper.size[1] + pad * 2
    shadow_layer = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_layer)

    # Ambient shadow (centered, soft)
    sdraw.rectangle([pad + 2, pad + 2, pad + paper.size[0] - 2, pad + paper.size[1] - 2], fill=(0, 0, 0, 45))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(16))

    # Directional shadow (offset bottom-right, crisper)
    dir_shadow = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    dsdraw = ImageDraw.Draw(dir_shadow)
    dsdraw.rectangle([pad + 6, pad + 14, pad + paper.size[0] + 6, pad + paper.size[1] + 14], fill=(0, 0, 0, 75))
    dir_shadow = dir_shadow.filter(ImageFilter.GaussianBlur(10))

    # Combine shadows
    combined = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    combined.paste(shadow_layer, (0, 0), shadow_layer)
    combined.paste(dir_shadow, (0, 0), dir_shadow)

    # Paste paper onto shadow
    combined.paste(paper, (pad, pad), paper)

    # Add pushpin at top-center of the paper
    pin_w = int(pw * pin_scale)
    pin = create_supersampled_pushpin(size=pin_w, color=pin_color)
    pin_x = pad + (paper.size[0] - pin.size[0]) // 2
    pin_y = pad - int(pin.size[1] * 0.40)  # Pin pierces paper top edge
    combined.paste(pin, (pin_x, pin_y), pin)

    # Rotate if needed
    if abs(angle) > 0.01:
        combined = combined.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)

    # Crop excess transparent borders while leaving shadow intact
    bbox = combined.getbbox()
    if bbox:
        combined = combined.crop(bbox)

    return combined


print("Loaded build_pinned_diplomas helper")

def generate_all_certificate_visuals():
    import fitz

    # 1. Render high-res source pages from PDFs
    grad_doc = fitz.open(DOCS_DIR / "diploma-graduacao.pdf")
    mest_doc = fitz.open(DOCS_DIR / "diploma-mestrado.pdf")

    # Render at 180 DPI for crisp details
    grad_p1_pix = grad_doc[0].get_pixmap(dpi=180)
    grad_p2_pix = grad_doc[1].get_pixmap(dpi=180)
    mest_p1_pix = mest_doc[0].get_pixmap(dpi=180)
    mest_p2_pix = mest_doc[1].get_pixmap(dpi=180)

    grad_p1 = Image.frombytes("RGB", [grad_p1_pix.width, grad_p1_pix.height], grad_p1_pix.samples)
    grad_p2 = Image.frombytes("RGB", [grad_p2_pix.width, grad_p2_pix.height], grad_p2_pix.samples)
    mest_p1 = Image.frombytes("RGB", [mest_p1_pix.width, mest_p1_pix.height], mest_p1_pix.samples)
    mest_p2 = Image.frombytes("RGB", [mest_p2_pix.width, mest_p2_pix.height], mest_p2_pix.samples)

    # 2. Build individual pinned images for web gallery
    print("Building individual pinned certificates...")
    # Resize to standard web display width (1000px wide) before pinning
    target_w = 950
    def prep(img):
        ratio = target_w / img.width
        return img.resize((target_w, int(img.height * ratio)), Image.Resampling.LANCZOS)

    # Generate individual pinned cards
    pin_red = (205, 32, 38)
    pin_crimson = (180, 25, 30)

    grad_frente_pinned = add_paper_shadow_and_pin(prep(grad_p1), angle=-1.2, pin_color=pin_red, pin_scale=0.075)
    grad_verso_pinned = add_paper_shadow_and_pin(prep(grad_p2), angle=1.4, pin_color=pin_crimson, pin_scale=0.075)
    mest_frente_pinned = add_paper_shadow_and_pin(prep(mest_p1), angle=-1.5, pin_color=pin_red, pin_scale=0.075)
    mest_verso_pinned = add_paper_shadow_and_pin(prep(mest_p2), angle=1.2, pin_color=pin_crimson, pin_scale=0.075)

    grad_frente_pinned.save(MEDIA_DIR / "diploma-graduacao-frente.png")
    grad_verso_pinned.save(MEDIA_DIR / "diploma-graduacao-verso.png")
    mest_frente_pinned.save(MEDIA_DIR / "diploma-mestrado-frente.png")
    mest_verso_pinned.save(MEDIA_DIR / "diploma-mestrado-verso.png")

    # Also save to DOCS_DIR
    grad_frente_pinned.save(DOCS_DIR / "diploma-graduacao-frente.png")
    grad_verso_pinned.save(DOCS_DIR / "diploma-graduacao-verso.png")
    mest_frente_pinned.save(DOCS_DIR / "diploma-mestrado-frente.png")
    mest_verso_pinned.save(DOCS_DIR / "diploma-mestrado-verso.png")

    print("Saved individual pinned images to docs/media/ and pictures/academia/docs/")

    # 3. Build combined 'pinned to the wall' composition for PDF deck and web showcase
    print("Building combined pinned-to-wall composition...")
    # In the combined composition, we showcase both degrees:
    # Undergrad (Graduação) and Master's (Mestrado), each showing Front + Back (registration & authentication)
    comp_w = 1920
    comp_h = 1080
    canvas = Image.new("RGBA", (comp_w, comp_h), (0, 0, 0, 0))

    # Base sheet scale for 4 sheets on the wall
    sheet_w = 780
    def prep_c(img):
        ratio = sheet_w / img.width
        return img.resize((sheet_w, int(img.height * ratio)), Image.Resampling.LANCZOS)

    g_p1_card = add_paper_shadow_and_pin(prep_c(grad_p1), angle=2.2, pin_color=pin_red, pin_scale=0.08)
    g_p2_card = add_paper_shadow_and_pin(prep_c(grad_p2), angle=-3.0, pin_color=pin_crimson, pin_scale=0.08)
    m_p1_card = add_paper_shadow_and_pin(prep_c(mest_p1), angle=2.0, pin_color=pin_red, pin_scale=0.08)
    m_p2_card = add_paper_shadow_and_pin(prep_c(mest_p2), angle=-2.8, pin_color=pin_crimson, pin_scale=0.08)

    # Arrange in two distinct, elegant degree stations:
    # Left: Undergraduation (Tecnólogo ADS)
    # Right: Master's Degree (Mestre em Tecnologia)
    # Verso is slightly above & shifted so the registration box, DAC seal, and signatures are fully prominent
    # Frente is overlapping in front with the title, Unicamp emblem, and Rector decree fully prominent

    # Left station (Undergrad):
    canvas.paste(g_p2_card, (40, 40), g_p2_card)
    canvas.paste(g_p1_card, (140, 430), g_p1_card)

    # Right station (Master's):
    canvas.paste(m_p2_card, (960, 40), m_p2_card)
    canvas.paste(m_p1_card, (1060, 430), m_p1_card)

    # Crop excess bounding box
    c_bbox = canvas.getbbox()
    if c_bbox:
        # Add a tiny 20px padding around
        padded_bbox = (
            max(0, c_bbox[0] - 20),
            max(0, c_bbox[1] - 20),
            min(comp_w, c_bbox[2] + 20),
            min(comp_h, c_bbox[3] + 20)
        )
        canvas = canvas.crop(padded_bbox)

    mockup_path = DOCS_DIR / "diplomas-mockup.png"
    canvas.save(mockup_path)
    canvas.save(MEDIA_DIR / "diplomas-mockup.png")
    canvas.save(DOCS_DIR / "diplomas-pinned-wall.png")
    canvas.save(MEDIA_DIR / "diplomas-pinned-wall.png")

    print(f"Generated diplomas-mockup.png ({canvas.size[0]}x{canvas.size[1]})")

if __name__ == "__main__":
    generate_all_certificate_visuals()
