'use strict';

window.addEventListener("load", _ => {
  console.info("%c⬤", "color:#fff;background:#000;padding:1em;font-size:18px;");
}, false);

// /c/: hovering a repository marks all its rows, the rest steps back.
const ledger = document.querySelector(".ledger");
if (ledger && matchMedia("(hover: hover)").matches) {
  let current = null;
  const mark = repo => {
    if (repo === current) return;
    current = repo;
    ledger.classList.toggle("focus", !!repo);
    for (const li of ledger.children) li.classList.toggle("same", !!repo && li.dataset.repo === repo);
  };
  ledger.addEventListener("pointerover", e => {
    const a = e.target.closest("a.repo");
    mark(a ? a.parentElement.dataset.repo : null);
  });
  ledger.addEventListener("pointerleave", () => mark(null));
}
