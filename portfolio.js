import { featuredProjects, supportingProjects } from "./data/projects.js";

const featuredContainer = document.querySelector("[data-featured-projects]");
const supportingContainer = document.querySelector("[data-supporting-projects]");

const externalLinkAttributes = (href) =>
  href.startsWith("http") || href.endsWith(".pdf")
    ? ' target="_blank" rel="noopener"'
    : "";

const tagList = (items) =>
  `<ul class="project-tags" aria-label="Project tools">${items
    .map((item) => `<li>${item}</li>`)
    .join("")}</ul>`;

if (featuredContainer) {
  featuredContainer.innerHTML = featuredProjects
    .map(
      (project) => `
        <article class="featured-project" id="${project.id}">
          <a class="project-media" href="${project.href}"${externalLinkAttributes(project.href)} aria-label="${project.linkLabel}: ${project.title}">
            <img src="${project.cover}" alt="${project.coverAlt}" loading="lazy">
            <span class="project-number" aria-hidden="true">0${project.featuredRank}</span>
            <span class="project-status">${project.maturity}</span>
          </a>
          <div class="project-copy">
            <p class="project-eyebrow">${project.eyebrow}</p>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
            <p class="project-outcome"><strong>Evidence:</strong> ${project.outcome}</p>
            ${tagList(project.tools)}
            <a class="text-link" href="${project.href}"${externalLinkAttributes(project.href)}>${project.linkLabel} <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      `
    )
    .join("");
}

if (supportingContainer) {
  supportingContainer.innerHTML = supportingProjects
    .map(
      (project) => `
        <article class="supporting-project">
          <a class="supporting-media" href="${project.href}"${externalLinkAttributes(project.href)} aria-label="${project.linkLabel}: ${project.title}">
            <img src="${project.cover}" alt="${project.coverAlt}" loading="lazy">
          </a>
          <div class="supporting-copy">
            <p class="project-eyebrow">${project.eyebrow}</p>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
            ${tagList(project.tools.slice(0, 3))}
            <a class="text-link" href="${project.href}"${externalLinkAttributes(project.href)}>${project.linkLabel} <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      `
    )
    .join("");
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

const header = document.querySelector("[data-header]");
if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}
