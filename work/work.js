import { projects } from "../data/projects.js";

const library = document.querySelector("[data-project-library]");
const domainFilters = document.querySelector("[data-domain-filters]");
const typeFilter = document.querySelector("[data-type-filter]");
const resultCount = document.querySelector("[data-result-count]");
const emptyState = document.querySelector("[data-empty-state]");

const domains = [
  "All",
  "Product Development",
  "Robotics & Mechatronics",
  "Analysis & Simulation",
  "Testing & Reliability",
  "Manufacturing & DFM",
  "Electronics & Digital Hardware"
];

let selectedDomain = "All";
let selectedType = "All";

const pathFromWork = (path) => {
  if (path.startsWith("http") || path.startsWith("../")) return path;
  if (path.startsWith("#")) return `../index.html${path}`;
  return `../${path}`;
};

const externalAttributes = (href) =>
  href.startsWith("http") || href.endsWith(".pdf")
    ? ' target="_blank" rel="noopener"'
    : "";

const renderFilters = () => {
  domainFilters.innerHTML = domains
    .map(
      (domain) => `<button type="button" class="filter-button${domain === selectedDomain ? " is-active" : ""}" data-domain="${domain}" aria-pressed="${domain === selectedDomain}">${domain}</button>`
    )
    .join("");

  domainFilters.querySelectorAll("[data-domain]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDomain = button.dataset.domain;
      renderFilters();
      renderProjects();
    });
  });
};

const renderProjects = () => {
  const filtered = projects.filter((project) => {
    const domainMatch = selectedDomain === "All" || project.domains.includes(selectedDomain);
    const typeMatch = selectedType === "All" || project.projectType === selectedType;
    return domainMatch && typeMatch;
  });

  resultCount.textContent = String(filtered.length);
  emptyState.hidden = filtered.length !== 0;

  library.innerHTML = filtered
    .map((project) => {
      const href = pathFromWork(project.href);
      const cover = pathFromWork(project.cover);
      return `
        <article class="library-card">
          <a class="library-card-media${project.mediaContain ? " is-contain" : ""}" href="${href}"${externalAttributes(href)} aria-label="${project.linkLabel}: ${project.title}">
            <img src="${cover}" alt="${project.coverAlt}" loading="lazy">
          </a>
          <div class="library-card-copy">
            <div class="library-card-meta"><span>${project.projectType}</span><span>${project.domains[0]}</span></div>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
            <ul class="project-tags" aria-label="Project tools">${project.tools.slice(0, 3).map((tool) => `<li>${tool}</li>`).join("")}</ul>
            <a class="text-link" href="${href}"${externalAttributes(href)}>${project.linkLabel} <span aria-hidden="true">↗</span></a>
          </div>
        </article>`;
    })
    .join("");
};

typeFilter.addEventListener("change", () => {
  selectedType = typeFilter.value;
  renderProjects();
});

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

renderFilters();
renderProjects();
