const filterButtons = document.querySelectorAll(".filter-button");
const projectsGrid = document.querySelector(".projects-grid");

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

function getSizeClass(size) {
    const sizeMap = {
        large: "project-card-large",
        wide: "project-card-wide",
        normal: ""
    };

    return sizeMap[size] || "";
}

function renderProjects(filter = "all") {
    const visibleProjects = projects.filter((project) => {
        return filter === "all" || project.category === filter;
    });

    projectsGrid.innerHTML = visibleProjects.map((project) => {
        const previewClass = getPreviewClass(project.style);
        const sizeClass = getSizeClass(project.size);

        return `
            <a
                class="project-card ${sizeClass}"
                data-category="${project.category}"
                 href="project.html?id=${project.id}"
            >
                <div class="project-preview ${previewClass}">
                    <span class="project-preview-index">
                        ${String(project.id).padStart(2, "0")}
                    </span>

                    <span class="project-preview-word">
                        ${project.preview}
                    </span>
                </div>

                <div class="project-info">
                    <div>
                        <span class="project-category">
                            ${project.categoryName}
                        </span>

                        <h3>${project.title}</h3>
                    </div>

                    <span class="project-arrow">↗</span>
                </div>
            </a>
        `;
    }).join("");
}

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

renderProjects();