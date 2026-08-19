/* =========================================================
   BADBEE PORTFOLIO
   PUBLIC DATA FROM SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://gapwpvuvhqrdadinaodi.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_LIg4CWEGK_u7Fljf5E_lLA_UWLXHZJc";


/* =========================================================
   ЗАПРОС К SUPABASE
========================================================= */

async function supabaseRequest(path) {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1${path}`,
        {
            method: "GET",

            headers: {
                apikey:
                    SUPABASE_PUBLISHABLE_KEY
            }
        }
    );


    if (!response.ok) {

        const text =
            await response.text();

        throw new Error(
            `Supabase HTTP ${response.status}: ${text}`
        );
    }


    return response.json();
}


/* =========================================================
   ПОЛУЧАЕМ ОПУБЛИКОВАННЫЕ ПРОЕКТЫ
========================================================= */

async function loadPublishedProjects() {

    const projects =
        await supabaseRequest(
            "/projects" +
            "?select=*" +
            "&status=eq.published" +
            "&order=sort_order.asc,created_at.desc"
        );


    const categories =
        await supabaseRequest(
            "/categories" +
            "?select=id,name,slug"
        );


    const media =
        await supabaseRequest(
            "/project_media" +
            "?select=*" +
            "&order=sort_order.asc"
        );


    const categoryMap = {};


    categories.forEach(
        category => {

            categoryMap[category.id] =
                category;
        }
    );


    const mediaMap = {};


    media.forEach(
        item => {

            if (!mediaMap[item.project_id]) {
                mediaMap[item.project_id] = [];
            }


            mediaMap[item.project_id].push(
                item
            );
        }
    );


    return projects.map(
        project => {

            const category =
                project.category_id
                    ? categoryMap[
                        project.category_id
                    ]
                    : null;


            const projectMedia =
                mediaMap[project.id] || [];


            return {

                id:
                    project.id,

                title:
                    project.title,

                slug:
                    project.slug,

                category:
                    category
                        ? category.slug
                        : "",

                categoryName:
                    category
                        ? category.name
                        : "Без категории",

                description:
                    project.description || "",

                task:
                    project.task || "",

                solution:
                    project.solution || "",

                result:
                    project.result || "",

                cover:
                    project.cover_url || null,

                images:
                    projectMedia.map(
                        item =>
                            item.file_url
                    ),

                pdf:
                    project.pdf_url || null,

                style:
                    project.preview_style ||
                    "light",

                size:
                    project.card_size ||
                    "normal",

                featured:
                    Boolean(
                        project.is_featured
                    ),

                sortOrder:
                    Number(
                        project.sort_order || 0
                    )
            };
        }
    );
}


/* =========================================================
   ТЕСТ
========================================================= */

async function testSupabasePublicData() {

    try {

        const projects =
            await loadPublishedProjects();


        console.log(
            "BADBEE Supabase OK ✅"
        );


        console.log(
            "Опубликованных проектов:",
            projects.length
        );


        console.table(
            projects.map(
                project => ({

                    title:
                        project.title,

                    category:
                        project.categoryName,

                    images:
                        project.images.length,

                    pdf:
                        Boolean(
                            project.pdf
                        )
                })
            )
        );


        return projects;


    } catch (error) {

        console.error(
            "BADBEE Supabase error:",
            error
        );


        throw error;
    }
}