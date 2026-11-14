'use strict';

window.addEventListener("load", _ => {
  console.info("%c⬤", "color:#fff;background:#000;padding:1em;font-size:18px;");
}, false);

// /c/: hovering the owner or the name of a repository marks all rows of that
// owner or repository; hovering the year, month or day of a date marks all rows
// of that year, month or day. The rest steps back.
const ledger = document.querySelector(".ledger");
if (ledger && matchMedia("(hover: hover)").matches) {
  const len = { y: 4, m: 7, d: 10 }; // length of the date prefix to compare
  let current = "";
  const mark = (kind, value) => {
    const key = kind ? kind + ":" + value : "";
    if (key === current) return;
    current = key;
    ledger.dataset.focus = kind || "";
    ledger.classList.toggle("focus", !!kind);
    for (const li of ledger.children) {
      const same = kind === "repo" ? li.dataset.repo === value
        : kind === "owner" ? li.dataset.owner === value
        : !!kind && (li.dataset.date || "").startsWith(value);
      li.classList.toggle("same", same);
    }
  };
  ledger.addEventListener("pointerover", e => {
    const li = e.target.closest("li");
    const owner = e.target.closest("a.repo .o");
    const repo = e.target.closest("a.repo");
    const part = e.target.closest("time span");
    if (owner) mark("owner", li.dataset.owner);
    else if (repo) mark("repo", li.dataset.repo);
    else if (part) mark(part.className, li.dataset.date.slice(0, len[part.className]));
    else mark();
  });
  ledger.addEventListener("pointerleave", () => mark());
}
