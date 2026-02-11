# Fonts for resume (Typst)

Place **Lato** font files here so the resume can use them.

1. **Download Lato** (free): https://fonts.google.com/specimen/Lato — click "Download family".
2. **Unzip** the archive and copy into this folder:
   - `Lato-Regular.ttf` (required)
   - `Lato-Bold.ttf` (for headings)
   - `Lato-Italic.ttf` (optional, for italic text)
3. **Compile** the resume with the font path (from repo root):
   ```powershell
   typst compile --font-path resume/typst/fonts resume/typst/main.typ resume/CV-Eduardo-Figueiredo-EN-typst.pdf
   ```

If this folder is empty, Typst will fall back to another font when compiling without `--font-path`.
