import os, cv2
import numpy as np

def cv_imread(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

def cv_imwrite(path, img):
    ext = os.path.splitext(path)[1]
    ret, buf = cv2.imencode(ext, img)
    if ret:
        with open(path, 'wb') as f:
            buf.tofile(f)

def perfect_white_doc(img, k_dilate=45, k_blur=131, white_thresh=235, black_point=15):
    h, w = img.shape[:2]
    dw = 1200
    dh = int(dw * h / float(w))
    small = cv2.resize(img, (dw, dh), interpolation=cv2.INTER_AREA)
    
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (k_dilate, k_dilate))
    
    planes_small = cv2.split(small)
    planes_orig = cv2.split(img)
    
    out_planes = []
    for ps, po in zip(planes_small, planes_orig):
        dilated = cv2.dilate(ps, kernel)
        bg_small = cv2.GaussianBlur(dilated, (k_blur, k_blur), 0)
        bg_full = cv2.resize(bg_small, (w, h), interpolation=cv2.INTER_LINEAR).astype(np.float32)
        
        # Illumination division
        divided = (po.astype(np.float32) / np.maximum(bg_full, 1.0)) * 255.0
        
        # Linear white point stretch: map [black_point, white_thresh] -> [0, 255]
        stretched = (divided - black_point) / (white_thresh - black_point) * 255.0
        stretched = np.clip(stretched, 0, 255).astype(np.uint8)
        out_planes.append(stretched)
        
    return cv2.merge(out_planes)

def process_all():
    src_dir = r'C:\Users\eduev\Meu Drive\05 - Profissional\09 - Diplomas'
    dst_dir = r'pictures\academia\docs'
    media_dir = r'docs\media'
    os.makedirs(dst_dir, exist_ok=True)
    os.makedirs(media_dir, exist_ok=True)
    
    # 1. ETEC (IMG_20261113_200634.jpg - Landscape)
    p1 = os.path.join(src_dir, 'IMG_20261113_200634.jpg')
    im1 = cv_imread(p1)
    crop1 = im1[40:2430, 95:3490]
    clean1 = perfect_white_doc(crop1, k_dilate=45, k_blur=131, white_thresh=235)
    cv_imwrite(os.path.join(dst_dir, 'certificado-etec.png'), clean1)
    cv_imwrite(os.path.join(media_dir, 'certificado-etec.png'), clean1)
    print('Refined ETEC to pure white.')
    
    # 2. OBMEP (IMG_20261113_200732.jpg - Rotated CCW)
    p2 = os.path.join(src_dir, 'IMG_20261113_200732.jpg')
    im2 = cv_imread(p2)
    im2 = cv2.rotate(im2, cv2.ROTATE_90_COUNTERCLOCKWISE)
    crop2 = im2[60:2750, 120:3920]
    clean2 = perfect_white_doc(crop2, k_dilate=45, k_blur=131, white_thresh=232)
    cv_imwrite(os.path.join(dst_dir, 'certificado-obmep.png'), clean2)
    cv_imwrite(os.path.join(media_dir, 'certificado-obmep.png'), clean2)
    print('Refined OBMEP to pure white.')
    
    # 3. Bosch (IMG_20261113_200748.jpg - Rotated CCW)
    p3 = os.path.join(src_dir, 'IMG_20261113_200748.jpg')
    im3 = cv_imread(p3)
    im3 = cv2.rotate(im3, cv2.ROTATE_90_COUNTERCLOCKWISE)
    crop3 = im3[80:2760, 100:3940]
    clean3 = perfect_white_doc(crop3, k_dilate=65, k_blur=171, white_thresh=235)
    cv_imwrite(os.path.join(dst_dir, 'certificado-bosch-talentos.png'), clean3)
    cv_imwrite(os.path.join(media_dir, 'certificado-bosch-talentos.png'), clean3)
    print('Refined Bosch to pure white.')
    
    # 4. Hospitalhaços (IMG_20261113_200831.jpg - Portrait)
    p4 = os.path.join(src_dir, 'IMG_20261113_200831.jpg')
    im4 = cv_imread(p4)
    crop4 = im4[80:3850, 60:2920]
    clean4 = perfect_white_doc(crop4, k_dilate=45, k_blur=131, white_thresh=235)
    cv_imwrite(os.path.join(dst_dir, 'declaracao-hospitalhacos.png'), clean4)
    cv_imwrite(os.path.join(media_dir, 'declaracao-hospitalhacos.png'), clean4)
    print('Refined Hospitalhacos to pure white.')

if __name__ == '__main__':
    process_all()
