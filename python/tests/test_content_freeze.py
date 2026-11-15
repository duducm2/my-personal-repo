"""Unit tests for python/content_freeze.py."""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from content_freeze import compare_with_frozen, freeze_current, get_history


class ContentFreezeTests(unittest.TestCase):
    def _seed_workspace(self, root: Path) -> None:
        files = {
            "resume/variants/ux-researcher/content.en.typ": '#let tagline = "UXR"\n',
            "portfolio/variants/ux-researcher/portfolio-deck.en.md": "# UXR Deck\n",
            "docs/index.html": "<html><body>Portfolio</body></html>\n",
            "my-data/canonical/additional.csv": "sort_order,text_en,text_pt\n1,Award,Prêmio\n",
            # Job tracking files should be ignored by freeze/compare
            "my-data/canonical/job_openings.csv": "id,company\n1,Acme\n",
            "my-data/canonical/companies.csv": "id,name\n1,Acme\n",
        }
        for rel, content in files.items():
            p = root / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(content, encoding="utf-8")

    def test_freeze_compare_and_refreeze_history(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._seed_workspace(root)

            # Before first freeze
            before = compare_with_frozen(root=root)
            self.assertFalse(before["frozen"])

            # Initial freeze
            res = freeze_current(note="Initial baseline", root=root)
            self.assertTrue(res["ok"])
            self.assertEqual(res["manifest"]["file_count"], 4)
            self.assertEqual(res["status"]["summary"]["total_changed"], 0)

            # Modifying job_openings.csv or companies.csv does NOT affect freeze status
            (root / "my-data/canonical/job_openings.csv").write_text(
                "id,company\n1,Acme\n2,Beta\n", encoding="utf-8"
            )
            (root / "my-data/canonical/companies.csv").write_text(
                "id,name\n1,Acme\n2,Beta\n", encoding="utf-8"
            )
            self.assertEqual(compare_with_frozen(root=root)["summary"]["total_changed"], 0)

            # Modify resume + canonical, add a tracked file, remove a tracked file
            (root / "resume/variants/ux-researcher/content.en.typ").write_text(
                '#let tagline = "UXR & Applied AI"\n', encoding="utf-8"
            )
            (root / "my-data/canonical/additional.csv").write_text(
                "sort_order,text_en,text_pt\n1,Award,Prêmio\n2,New Cert,Novo Cert\n",
                encoding="utf-8",
            )
            added = root / "docs/ux-researcher/path.js"
            added.parent.mkdir(parents=True, exist_ok=True)
            added.write_text("const PATH = {};\n", encoding="utf-8")
            (root / "docs/index.html").unlink()

            cmp_all = compare_with_frozen(root=root)
            self.assertTrue(cmp_all["frozen"])
            self.assertEqual(cmp_all["summary"]["total_changed"], 4)
            self.assertEqual(cmp_all["summary"]["resumes"], 1)
            self.assertEqual(cmp_all["summary"]["portfolios"], 2)
            self.assertEqual(cmp_all["summary"]["canonical"], 1)

            statuses = {c["path"]: c["status"] for c in cmp_all["changes"]}
            self.assertEqual(statuses["resume/variants/ux-researcher/content.en.typ"], "modified")
            self.assertEqual(statuses["docs/ux-researcher/path.js"], "added")
            self.assertEqual(statuses["docs/index.html"], "removed")

            # Category filter
            cmp_res = compare_with_frozen(category="resumes", root=root)
            self.assertEqual(len(cmp_res["changes"]), 1)
            self.assertEqual(cmp_res["changes"][0]["path"], "resume/variants/ux-researcher/content.en.typ")

            # Re-freeze records checkpoint in history and resets diff to 0
            res2 = freeze_current(note="Reviewed changes", root=root)
            self.assertEqual(res2["status"]["summary"]["total_changed"], 0)
            hist = get_history(root=root)
            self.assertEqual(len(hist), 2)
            self.assertEqual(hist[0]["note"], "Reviewed changes")
            self.assertEqual(hist[0]["changed_count"], 4)


if __name__ == "__main__":
    unittest.main()
