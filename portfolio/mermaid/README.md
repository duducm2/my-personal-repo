# Mermaid diagram sources

All diagram sources for the portfolio deck live in this folder.

**View all diagrams (twin screens):** Open [diagrams.md](diagrams.md) in VS Code (or any Markdown viewer with Mermaid support) to see every diagram rendered. Use one screen for the deck and one for `diagrams.md` while presenting.

**Render to PNG** (output in parent folder so `portfolio-deck.md` image links work):

```bash
cd mermaid
npx @mermaid-js/mermaid-cli -i filename.mmd -o ../filename.png
```

Or render all:

```bash
cd mermaid
for %f in (*.mmd) do npx @mermaid-js/mermaid-cli -i "%f" -o "../%~nf.png"
```

(PowerShell: `Get-ChildItem *.mmd | ForEach-Object { npx @mermaid-js/mermaid-cli -i $_.Name -o "../$($_.BaseName).png" }`)
