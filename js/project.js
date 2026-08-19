/* =================================================
   BADBEE PORTFOLIO
   PUBLIC PROJECT PAGE
   SUPABASE + FALLBACK
================================================= */


const params =
    new URLSearchParams(
        window.location.search
    );

const projectKey =
    params.get("id");


/* =================================================
   ЗАПУСК
================================================= */

async function initProjectPage() {

    let currentProject = null;


    /* =============================================
       1. ПЫТАЕМСЯ ПОЛУЧИТЬ ПРОЕКТ ИЗ SUPABASE
    ============================================= */

    try {

        const supabaseProjects =
            await loadPublishedProjects();


        currentProject =
            supabaseProjects.find(
                project => {

                    return (
                        project.slug ===
                            projectKey ||

                        String(project.id) ===
                            String(projectKey)
                    );
                }
            );


        if (currentProject) {

            console.log(
                "Project loaded from Supabase ✅",
                currentProject.title
            );
        }


    } catch (error) {

        console.error(
            "Не удалось получить проект из Supabase:",
            error
        );
    }



    /* =============================================
       3. ПРОЕКТ НЕ НАЙДЕН
    ============================================= */

    if (!currentProject) {

        showProjectNotFound();

        return;
    }


    /* =============================================
       4. ОТРИСОВКА
    ============================================= */

    renderProject(
        currentProject
    );
}


/* =================================================
   ПРОЕКТ НЕ НАЙДЕН
================================================= */

function showProjectNotFound() {

    document.body.innerHTML = `
        <main
            style="
                padding: 40px;
                font-family:
                    Arial,
                    sans-serif;
            "
        >

            <h1>
                Проект не найден
            </h1>

            <a href="index.html#portfolio">
                Вернуться в портфолио
            </a>

        </main>
    `;
}


/* =================================================
   ОТРИСОВКА ПРОЕКТА
================================================= */

function renderProject(
    currentProject
) {

    document.title =
        `${currentProject.title} — BADBEE DESIGN`;


    const projectTitle =
        document.querySelector(
            "[data-project-title]"
        );

    const projectCategory =
        document.querySelector(
            "[data-project-category]"
        );

    const projectCover =
        document.querySelector(
            "[data-project-cover]"
        );

    const projectDescription =
        document.querySelector(
            "[data-project-description]"
        );

    const projectTask =
        document.querySelector(
            "[data-project-task]"
        );

    const projectSolution =
        document.querySelector(
            "[data-project-solution]"
        );

    const projectResult =
        document.querySelector(
            "[data-project-result]"
        );

    const projectGallery =
        document.querySelector(
            "[data-project-gallery]"
        );


    /* =============================================
       ТЕКСТЫ
    ============================================= */

    if (projectTitle) {

        projectTitle.textContent =
            currentProject.title || "";
    }


    if (projectCategory) {

        projectCategory.textContent =
            currentProject.categoryName || "";
    }


    if (projectDescription) {

        projectDescription.textContent =
            currentProject.description || "";
    }


    if (projectTask) {

        projectTask.textContent =
            currentProject.task || "";
    }


    if (projectSolution) {

        projectSolution.textContent =
            currentProject.solution || "";
    }


    if (projectResult) {

        projectResult.textContent =
            currentProject.result || "";
    }


    /* =============================================
       ОБЛОЖКА
    ============================================= */

    if (projectCover) {

        if (currentProject.cover) {

            projectCover.innerHTML = `
                <img
                    src="${currentProject.cover}"
                    alt="${currentProject.title}"
                    class="project-main-cover"
                >
            `;

        } else {

            projectCover.innerHTML = `
                <span>
                    PROJECT
                </span>
            `;
        }
    }


    /* =============================================
       ГАЛЕРЕЯ
    ============================================= */

    const images =
        Array.isArray(
            currentProject.images
        )
            ? currentProject.images
            : [];


    if (projectGallery) {

        if (images.length > 0) {

            projectGallery.innerHTML =
                images
                    .map(
                        (
                            image,
                            index
                        ) => {

                            return `
                                <button
                                    class="project-gallery-card"
                                    data-image-index="${index}"
                                    type="button"
                                >

                                    <img
                                        src="${image}"
                                        alt="${currentProject.title} — изображение ${index + 1}"
                                        loading="lazy"
                                    >

                                    <span
                                        class="project-gallery-card-number"
                                    >
                                        ${String(index + 1).padStart(2, "0")}
                                    </span>

                                    <span
                                        class="project-gallery-card-open"
                                    >
                                        Смотреть ↗
                                    </span>

                                </button>
                            `;
                        }
                    )
                    .join("");

        } else {

            projectGallery.innerHTML = `
                <div
                    class="project-gallery-empty"
                >
                    Материалы проекта будут добавлены позже
                </div>
            `;
        }
    }


    /* =============================================
       LIGHTBOX
    ============================================= */

    initLightbox(
        images,
        currentProject
    );


    /* =============================================
       PDF
    ============================================= */

    initPdfViewer(
        currentProject
    );
}


/* =================================================
   LIGHTBOX
================================================= */

function initLightbox(
    images,
    currentProject
) {

    const lightbox =
        document.querySelector(
            "[data-lightbox]"
        );

    const lightboxImage =
        document.querySelector(
            "[data-lightbox-image]"
        );

    const lightboxClose =
        document.querySelector(
            "[data-lightbox-close]"
        );

    const lightboxPrev =
        document.querySelector(
            "[data-lightbox-prev]"
        );

    const lightboxNext =
        document.querySelector(
            "[data-lightbox-next]"
        );

    const lightboxCounter =
        document.querySelector(
            "[data-lightbox-counter]"
        );

    const galleryCards =
        document.querySelectorAll(
            "[data-image-index]"
        );


    let activeImageIndex = 0;


    function updateLightbox() {

        if (
            images.length === 0 ||
            !lightboxImage
        ) {
            return;
        }


        lightboxImage.src =
            images[
                activeImageIndex
            ];


        lightboxImage.alt =
            `${currentProject.title} — изображение ${activeImageIndex + 1}`;


        if (lightboxCounter) {

            lightboxCounter.textContent =
                `${activeImageIndex + 1} / ${images.length}`;
        }
    }


    function openLightbox(
        index
    ) {

        if (
            images.length === 0 ||
            !lightbox
        ) {
            return;
        }


        activeImageIndex =
            index;


        updateLightbox();


        lightbox.classList.add(
            "is-open"
        );

        document.body.classList.add(
            "lightbox-open"
        );
    }


    function closeLightbox() {

        if (!lightbox) {
            return;
        }


        lightbox.classList.remove(
            "is-open"
        );

        document.body.classList.remove(
            "lightbox-open"
        );
    }


    function showNextImage() {

        if (
            images.length === 0
        ) {
            return;
        }


        activeImageIndex =
            (
                activeImageIndex +
                1
            ) %
            images.length;


        updateLightbox();
    }


    function showPreviousImage() {

        if (
            images.length === 0
        ) {
            return;
        }


        activeImageIndex =
            (
                activeImageIndex -
                1 +
                images.length
            ) %
            images.length;


        updateLightbox();
    }


    galleryCards.forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            card.dataset
                                .imageIndex
                        );


                    openLightbox(
                        index
                    );
                }
            );
        }
    );


    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );
    }


    if (lightboxNext) {

        lightboxNext.addEventListener(
            "click",
            showNextImage
        );
    }


    if (lightboxPrev) {

        lightboxPrev.addEventListener(
            "click",
            showPreviousImage
        );
    }


    if (lightbox) {

        lightbox.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    lightbox
                ) {

                    closeLightbox();
                }
            }
        );
    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                !lightbox ||
                !lightbox.classList
                    .contains(
                        "is-open"
                    )
            ) {
                return;
            }


            if (
                event.key ===
                "Escape"
            ) {

                closeLightbox();
            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                showNextImage();
            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                showPreviousImage();
            }
        }
    );
}


/* =================================================
   PDF VIEWER
================================================= */

function initPdfViewer(
    currentProject
) {

    const pdfSection =
        document.querySelector(
            "[data-project-pdf-section]"
        );

    const pdfCanvas =
        document.querySelector(
            "[data-pdf-canvas]"
        );

    const pdfPrev =
        document.querySelector(
            "[data-pdf-prev]"
        );

    const pdfNext =
        document.querySelector(
            "[data-pdf-next]"
        );

    const pdfCounter =
        document.querySelector(
            "[data-pdf-counter]"
        );


    if (
        !currentProject.pdf ||
        !pdfSection ||
        !pdfCanvas
    ) {

        if (pdfSection) {
            pdfSection.hidden = true;
        }

        return;
    }


    if (
        typeof pdfjsLib ===
        "undefined"
    ) {

        console.error(
            "PDF.js не загружен"
        );

        pdfSection.hidden =
            true;

        return;
    }


    pdfSection.hidden =
        false;


    pdfjsLib
        .GlobalWorkerOptions
        .workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


    let pdfDocument =
        null;

    let currentPdfPage =
        1;

    let pdfRendering =
        false;


    const pdfContext =
        pdfCanvas.getContext(
            "2d"
        );


    async function renderPdfPage(
        pageNumber
    ) {

        if (
            !pdfDocument ||
            pdfRendering
        ) {
            return;
        }


        pdfRendering =
            true;


        try {

            const page =
                await pdfDocument
                    .getPage(
                        pageNumber
                    );


            const originalViewport =
                page.getViewport({
                    scale: 1
                });


            const stage =
                pdfCanvas.parentElement;


            const stageWidth =
                stage.clientWidth;


            const stageHeight =
                Math.min(
                    window.innerHeight *
                        0.72,
                    760
                );


            const widthScale =
                stageWidth /
                originalViewport.width;


            const heightScale =
                stageHeight /
                originalViewport.height;


            const scale =
                Math.min(
                    widthScale,
                    heightScale
                );


            const viewport =
                page.getViewport({
                    scale
                });


            const pixelRatio =
                window.devicePixelRatio ||
                1;


            pdfCanvas.width =
                Math.floor(
                    viewport.width *
                    pixelRatio
                );


            pdfCanvas.height =
                Math.floor(
                    viewport.height *
                    pixelRatio
                );


            pdfCanvas.style.width =
                `${viewport.width}px`;


            pdfCanvas.style.height =
                `${viewport.height}px`;


            pdfContext.setTransform(
                pixelRatio,
                0,
                0,
                pixelRatio,
                0,
                0
            );


            await page.render({

                canvasContext:
                    pdfContext,

                viewport:
                    viewport

            }).promise;


            if (pdfCounter) {

                pdfCounter.textContent =
                    `${pageNumber} / ${pdfDocument.numPages}`;
            }


        } catch (error) {

            console.error(
                "Ошибка отображения PDF:",
                error
            );

        } finally {

            pdfRendering =
                false;
        }
    }


    async function loadPdf() {

        try {

            const loadingTask =
                pdfjsLib.getDocument(
                    currentProject.pdf
                );


            pdfDocument =
                await loadingTask
                    .promise;


            currentPdfPage =
                1;


            await renderPdfPage(
                currentPdfPage
            );


        } catch (error) {

            console.error(
                "Не удалось загрузить PDF:",
                error
            );


            pdfSection.hidden =
                true;
        }
    }


    if (pdfPrev) {

        pdfPrev.addEventListener(
            "click",
            async () => {

                if (
                    !pdfDocument ||
                    currentPdfPage <=
                        1
                ) {
                    return;
                }


                currentPdfPage -=
                    1;


                await renderPdfPage(
                    currentPdfPage
                );
            }
        );
    }


    if (pdfNext) {

        pdfNext.addEventListener(
            "click",
            async () => {

                if (
                    !pdfDocument ||
                    currentPdfPage >=
                        pdfDocument
                            .numPages
                ) {
                    return;
                }


                currentPdfPage +=
                    1;


                await renderPdfPage(
                    currentPdfPage
                );
            }
        );
    }


    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        if (
                            pdfDocument
                        ) {

                            renderPdfPage(
                                currentPdfPage
                            );
                        }
                    },
                    150
                );
        }
    );


    loadPdf();
}


/* =================================================
   START
================================================= */

initProjectPage();