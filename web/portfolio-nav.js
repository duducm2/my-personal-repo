const portfolioButton = document.getElementById("open-portfolio-btn");
const portfolioMenu = document.getElementById("portfolio-menu");
if (portfolioButton && portfolioMenu) {

function placePortfolioMenu() {
  const rect = portfolioButton.getBoundingClientRect();
  portfolioMenu.style.top = `${rect.bottom + 4}px`;
  portfolioMenu.style.left = `${Math.max(8, rect.right - portfolioMenu.offsetWidth)}px`;
}

function openPortfolioMenu(event) {
  event.preventDefault();
  portfolioMenu.hidden = false;
  portfolioButton.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => {
    placePortfolioMenu();
    portfolioMenu.querySelector("a")?.focus();
  });
}

function closePortfolioMenu() {
  portfolioMenu.hidden = true;
  portfolioButton.setAttribute("aria-expanded", "false");
}

portfolioButton.addEventListener("click", (event) => {
  if (portfolioMenu.hidden) openPortfolioMenu(event);
  else closePortfolioMenu();
});

portfolioButton.addEventListener("contextmenu", openPortfolioMenu);

document.addEventListener("click", (event) => {
  if (portfolioMenu.hidden) return;
  if (portfolioButton.contains(event.target) || portfolioMenu.contains(event.target)) return;
  closePortfolioMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !portfolioMenu.hidden) {
    closePortfolioMenu();
    portfolioButton.focus();
  }
});

window.addEventListener("resize", () => {
  if (!portfolioMenu.hidden) placePortfolioMenu();
});
}
