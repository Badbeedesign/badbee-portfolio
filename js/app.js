const filterButtons = document.querySelectorAll(".filter-button");
const projectsGrid = document.querySelector(".projects-grid");


/* =========================
   СТИЛЬ ЗАГЛУШКИ
========================= */

function getPreviewClass(style) {
    const styleMap = {
        dark: "project-preview-dark",
        light: "project-preview-light",
        neutral: "project-preview-neutral",
        paper: "project-preview-paper",
        accent: "project-preview-accent",
        soft: "project-preview-soft"
    };

    return styleMap[style] || "project-preview-light";
}


/* =========================
   РАЗМЕР КАРТОЧКИ
========================= */

function getSizeClass(size) {
    const sizeMap = {
        large: "project-card-large",
        wide: "project-card-wide",
        normal: ""
    };

    return sizeMap[size] || "";
}


/* =========================
   СОЗДАЁМ ПРЕВЬЮ
========================= */

function createProjectPreview(project) {

    /* Если есть настоящая обложка */

    if (project.cover) {
        return `
            <div class="project-preview project-preview-image">

                <img
                    src="${project.cover}"
                    alt="${project.title}"
                    loading="lazy"
                >

                <span class="project-preview-index">
                    ${String(project.id).padStart(2, "0")}
                </span>

                <div class="project-preview-overlay">
                    <span>Смотреть проект ↗</span>
                </div>

            </div>
        `;
    }


    /* Если обложки пока нет */

    const previewClass = getPreviewClass(project.style);

    return `
        <div class="project-preview ${previewClass}">

            <span class="project-preview-index">
                ${String(project.id).padStart(2, "0")}
            </span>

            <span class="project-preview-word">
                ${project.preview}
            </span>

        </div>
    `;
}


/* =========================
   ВЫВОДИМ ПРОЕКТЫ
========================= */

function renderProjects(filter = "all") {

    const visibleProjects = projects.filter((project) => {
        return filter === "all" || project.category === filter;
    });

    projectsGrid.innerHTML = visibleProjects.map((project) => {

        const sizeClass = getSizeClass(project.size);

        return `
            <a
                class="project-card ${sizeClass}"
                data-category="${project.category}"
                href="project.html?id=${project.id}"
            >

                ${createProjectPreview(project)}

                <div class="project-info">

                    <div>

                        <span class="project-category">
                            ${project.categoryName}
                        </span>

                        <h3>
                            ${project.title}
                        </h3>

                    </div>

                    <span class="project-arrow">
                        ↗
                    </span>

                </div>

            </a>
        `;

    }).join("");
}


/* =========================
   ФИЛЬТРЫ
========================= */

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        renderProjects(selectedFilter);
    });

});


/* =========================
   ПЕРВЫЙ ЗАПУСК
========================= */

renderProjects();