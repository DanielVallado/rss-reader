import { saveRss, createArticle, getPaginatedArticles, getAllRss, countArticles } from "$lib/server/services";
import { fail } from "@sveltejs/kit";

import type { Actions } from "./$types";
import type { ArticleWithCategories } from '$lib/server/services';


export async function load({ url }) {
  const limit: number = 12;
  const page: number = Number(url.searchParams.get('page')  ?? 1);
  const offset: number = (page - 1) * limit;

  try {
    const feed: ArticleWithCategories[] = await getPaginatedArticles(limit, offset);
    const total: number = await countArticles();
    const pageCount: number = Math.ceil(total / limit);

    return { feed: feed, page: page, pageCount: pageCount};
  } catch (error) {
    if (error instanceof Error) {
      return { feed: null, error: error.message };
    } else {
      return { feed: null, error: "Ocurrió un error desconocido" };
    }
  }
}

export const actions = {
  addRss: async ({ request }) => {    
    const formData = await request.formData();
    const urlValue = formData.get("link");  

    try {
      await saveRss(urlValue);
      return { success: true };
    } catch (err) {      
      return fail(500, { error: "No pude guardar el RSS, inténtalo de nuevo" });
    }  
  },
  reload: async () => {
    const allRss = await getAllRss();
    await createArticle(allRss); 

    try {
      return { success: true };
    } catch (err) {
      return fail(500, { error: "No pude guardar el RSS, inténtalo de nuevo" });
    }
  }
} satisfies Actions;
