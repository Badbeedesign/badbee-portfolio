const filterButtons =
    document.querySelectorAll(".filter-button");

const projectsGrid =
    document.querySelector(".projects-grid");


let activeProjects = [];


/* =========================
   СТИЛЬ КАРТОЧКИ
========================= */

function getPreviewClass(style) {

    const styleMap = {

        dark:
            "project-preview-dark",

        light:
            "project-preview-light",

        neutral:
            "project-preview-neutral",

        paper:
            "project-preview-paper",

        accent:
            "project-preview-accent",

        soft:
            "project-preview-soft"

    };


    return (
        styleMap[style] ||
        "project-preview-light"
    );
}


/* =========================
   РАЗМЕР КАРТОЧКИ
========================= */

function getSizeClass(size) {

    const sizeMap = {

        large:
            "project-card-large",

        wide:
            "project-card-wide",

        normal:
            ""

    };


    return (
        sizeMap[size] ||
        ""
    );
}


/* =========================
   СОЗДАЁМ ПРЕВЬЮ
========================= */

function createProjectPreview(
    project,
    index
) {

    if (project.cover) {

        return `
            <div
                class="
                    project-preview
                    project-preview-image
                "
            >

                <img
                    src="${project.cover}"
                    alt="${project.title}"
                    loading="lazy"
                >

                <span
                    class="
                        project-preview-index
                    "
                >
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <div
                    class="
                        project-preview-overlay
                    "
                >
                    <span>
                        Смотреть проект ↗
                    </span>
                </div>

            </div>
        `;
    }


    const previewClass =
        getPreviewClass(
            project.style
        );


    return `
        <div
            class="
                project-preview
                ${previewClass}
            "
        >

            <span
                class="
                    project-preview-index
                "
            >
                ${String(index + 1).padStart(2, "0")}
            </span>

        </div>
    `;
}


/* =========================
   ВЫВОДИМ ПРОЕКТЫ
========================= */

function renderProjects(
    filter = "all"
) {

    const visibleProjects =
        activeProjects.filter(
            project => {

                return (
                    filter === "all" ||
                    project.category === filter
                );
            }
        );


    if (!visibleProjects.length) {

        projectsGrid.innerHTML = `
            <div class="projects-empty">
                В этой категории пока нет проектов.
            </div>
        `;

        return;
    }


    projectsGrid.innerHTML =
        visibleProjects
            .map(
                (
                    project,
                    index
                ) => {

                    const sizeClass =
                        getSizeClass(
                            project.size
                        );


                    /*
                      Теперь открываем проект
                      по slug, а не по старому id.
                    */

                    const projectKey =
                        project.slug ||
                        project.id;


                    return `
                        <a
                            class="
                                project-card
                                ${sizeClass}
                            "
                            data-category="${project.category}"
                            href="
                                project.html?id=${encodeURIComponent(projectKey)}
                            "
                        >

                            ${
                                createProjectPreview(
                                    project,
                                    index
                                )
                            }

                            <div
                                class="
                                    project-info
                                "
                            >

                                <div>

                                    <span
                                        class="
                                            project-category
                                        "
                                    >
                                        ${
                                            project.categoryName
                                        }
                                    </span>

                                    <h3>
                                        ${project.title}
                                    </h3>

                                </div>

                                <span
                                    class="
                                        project-arrow
                                    "
                                >
                                    ↗
                                </span>

                            </div>

                        </a>
                    `;
                }
            )
            .join("");
}


/* =========================
   ФИЛЬТРЫ
========================= */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const selectedFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                renderProjects(
                    selectedFilter
                );
            }
        );
    }
);


/* =========================
   SUPABASE
========================= */

async function initPortfolio() {

    try {

        /*
          Основной источник —
          опубликованные проекты Supabase.
        */

        const supabaseProjects =
            await loadPublishedProjects();


        activeProjects =
            supabaseProjects;


        console.log(
            "Portfolio loaded from Supabase ✅",
            activeProjects.length
        );


        renderProjects();


    } catch (error) {

        console.error(
            "Supabase недоступен. Используем fallback.",
            error
        );


        /*
          Аварийный fallback.

          Старый projects.js пока сохраняем,
          чтобы сайт не становился пустым
          при временной проблеме Supabase.
        */

        if (
            typeof projects !==
            "undefined"
        ) {

            activeProjects =
                projects;


            renderProjects();


            return;
        }


        projectsGrid.innerHTML = `
            <div class="projects-empty">
                Не удалось загрузить проекты.
            </div>
        `;
    }
}


/* =========================
   ПЕРВЫЙ ЗАПУСК
========================= */

initPortfolio();