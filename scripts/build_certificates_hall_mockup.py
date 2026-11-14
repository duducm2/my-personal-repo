import os, math
from PIL import Image, ImageFilter, ImageDraw

def create_pushpin(size=36, pin_color=(195, 30, 45)):
    scale = 4
    s = size * scale
    im = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    cx, cy = s / 2.0, s / 2.0
    r = s * 0.38
    # Head base shadow
    d.ellipse([cx - r, cy - r + s*0.04, cx + r, cy + r + s*0.04], fill=(0, 0, 0, 60))
    # Head body
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*pin_color, 255))
    # Inner rim gradient
    r_in = r * 0.78
    d.ellipse([cx - r_in, cy - r_in, cx + r_in, cy + r_in], fill=(min(255, pin_color[0]+35), min(255, pin_color[1]+35), min(255, pin_color[2]+35), 255))
    # Center bevel
    r_core = r * 0.50
    d.ellipse([cx - r_core, cy - r_core, cx + r_core, cy + r_core], fill=(*pin_color, 255))
    # Specular highlight
    hl_r = r * 0.30
    d.ellipse([cx - r*0.42, cy - r*0.48, cx - r*0.42 + hl_r, cy - r*0.48 + hl_r*0.8], fill=(255, 255, 255, 220))
    return im.resize((size, size), Image.Resampling.LANCZOS)

def create_paper_sheet(img_path, target_width, target_height=None, angle=0.0, pin_pos=(0.5, 0.035)):
    base_img = Image.open(img_path).convert('RGB')
    w, h = base_img.size
    if target_height is None:
        aspect = h / float(w)
        target_height = int(target_width * aspect)
    resized = base_img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    paper = Image.new('RGBA', (target_width + 4, target_height + 4), (0, 0, 0, 0))
    draw = ImageDraw.Draw(paper)
    draw.rectangle([2, 2, target_width + 1, target_height + 1], fill=(255, 255, 255, 255), outline=(215, 215, 215, 180), width=1)
    paper.paste(resized, (2, 2))
    
    # Pushpin
    pin_sz = max(24, int(target_width * 0.046))
    pin = create_pushpin(size=pin_sz)
    px = int(target_width * pin_pos[0]) - pin.width // 2
    py = int(target_height * pin_pos[1]) - pin.height // 2
    
    pin_shadow = Image.new('RGBA', (paper.width, paper.height), (0, 0, 0, 0))
    ps_draw = ImageDraw.Draw(pin_shadow)
    ps_draw.ellipse([px + pin.width*0.15, py + pin.height*0.25, px + pin.width*0.9, py + pin.height*0.85], fill=(0, 0, 0, 70))
    pin_shadow = pin_shadow.filter(ImageFilter.GaussianBlur(3))
    paper.alpha_composite(pin_shadow)
    paper.alpha_composite(pin, (px, py))
    
    rotated = paper.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    
    pad = 40
    shadow = Image.new('RGBA', (rotated.width + pad*2, rotated.height + pad*2), (0, 0, 0, 0))
    alpha = rotated.split()[3]
    
    # Soft ambient drop shadow
    shadow.paste((0, 0, 0, 50), (pad + 4, pad + 10), mask=alpha)
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    
    # Crisp contact shadow
    contact = Image.new('RGBA', (rotated.width + pad*2, rotated.height + pad*2), (0, 0, 0, 0))
    contact.paste((0, 0, 0, 75), (pad + 2, pad + 3), mask=alpha)
    contact = contact.filter(ImageFilter.GaussianBlur(4))
    
    shadow.alpha_composite(contact)
    shadow.alpha_composite(rotated, (pad, pad))
    return shadow, pad

def build_certificates_hall():
    docs_dir = r'pictures\academia\docs'
    
    # Target height for all landscape sheets: ~430px (width ~610px)
    # Hospitalhaços (portrait): height 450px, width 340px
    items = [
        # (key, path, width, height, angle, pin_pos)
        ('obmep', os.path.join(docs_dir, 'certificado-obmep.png'), 610, None, -2.4, (0.5, 0.04)),
        ('etec', os.path.join(docs_dir, 'certificado-etec.png'), 610, None, +1.8, (0.5, 0.04)),
        ('undergrad', os.path.join(docs_dir, 'diploma-graduacao-p1.png'), 630, None, -3.2, (0.5, 0.04)),
        ('master', os.path.join(docs_dir, 'diploma-mestrado-p1.png'), 640, None, +2.0, (0.5, 0.04)),
        ('bosch', os.path.join(docs_dir, 'certificado-bosch-talentos.png'), 610, None, -1.8, (0.5, 0.04)),
        ('hospital', os.path.join(docs_dir, 'declaracao-hospitalhacos.png'), 340, 450, +1.8, (0.5, 0.03)),
    ]
    
    sheets = []
    for key, path, w, h, ang, pin_pos in items:
        sh, pad = create_paper_sheet(path, w, h, ang, pin_pos)
        sheets.append((key, sh, pad))
    
    canvas_w = 2850
    canvas_h = 700
    canvas = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
    
    sheet_dict = {key: (sh, pad) for key, sh, pad in sheets}
    
    paste_order = [
        ('obmep', 20, 70),
        ('etec', 440, 55),
        ('undergrad', 890, 50),
        ('bosch', 1810, 55),
        ('hospital', 2340, 50),
        ('master', 1330, 80), # Master's on top of both Undergrad and Bosch!
    ]
    
    for key, pos_x, pos_y in paste_order:
        sh, pad = sheet_dict[key]
        canvas.alpha_composite(sh, (pos_x - pad, pos_y - pad))
        
    bbox = canvas.getbbox()
    if bbox:
        canvas = canvas.crop((bbox[0]-15, bbox[1]-15, bbox[2]+15, bbox[3]+15))
    return canvas

if __name__ == '__main__':
    hall = build_certificates_hall()
    hall.save('pictures/academia/docs/diplomas-mockup.png')
    hall.save('docs/media/diplomas-mockup.png')
    print(f'Certificates Hall saved to pictures and docs/media: {hall.size}')
