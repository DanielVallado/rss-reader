<script lang="ts">
    import { Feed, Input, Button, Select, sortArticles, toastNotify } from '$lib';
    import { deserialize } from '$app/forms';
    
    import type { ArticleWithCategories } from '$lib/server/services';
    import type { SortCriterion, ToastType } from '$lib';
    import type { ActionResult } from '@sveltejs/kit';

    
    import { invalidateAll } from '$app/navigation';

    export let data;

    let feed: ArticleWithCategories[] = data.feed ?? [];
    let page: number = data.page ?? 0;
    let pageCount: number = data.pageCount ?? 0;

    let selectedFilter: SortCriterion = 'date';
    let searchTerm = '';

    function handleFilter(event: Event): void {
        selectedFilter = (event.target as HTMLSelectElement).value as SortCriterion;        
    }

    async function handleSubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}) {
		event.preventDefault();

        const form = event.currentTarget as HTMLFormElement;
		const data = new FormData(event.currentTarget);

		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data
		});
        
		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
            toastNotify('RSS añadido correctamente');
        } else {
            toastNotify('URL Inválida', 'error' as ToastType);
        }

        form.reset();
	}

    async function handleReload(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
        event.preventDefault();
        const formData = new FormData();

       const response = await fetch(event.currentTarget.action, {
			method: 'POST',
            body: formData,
		});

        const result = await response.json();
        
		if (result.type === 'success') {
            await invalidateAll();            
            toastNotify('Feed recargado correctamente', 'success');
		} else {
            toastNotify('Error al recargar el feed', 'error' as ToastType);
        }
    }
    
    // Reload the feed when the component is mounted
    $: feed = data.feed ?? [];
    $: page = data.page ?? 0;

    $: sortedFeed = sortArticles(feed, selectedFilter);

    $: displayedFeed = sortedFeed.filter(item => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        const inTitle = item.title?.toLowerCase().includes(term) ?? false;
        const inDesc  = item.description?.toLowerCase().includes(term) ?? false;
        const inDate  = item.publishedAt?.toLowerCase().includes(term) ?? false;
        return inTitle || inDesc || inDate;
    });

  const priorityCount = 6;
</script>

<section class="container">
    <div class="order">
        <label class="link-label" for="link">Añadir RSS:</label>
        <form class="link" method="POST" action="?/addRss" onsubmit={handleSubmit}>
            <Input id="link" name="link" placeholder="Introduce el enlace"/>
            <Button text="Añadir" variant="secondary" padding="1.5rem 2rem" type="submit"/>
        </form>
        

        <label class="filter-label" for="filter">Ordenar por:</label>
        <div class="filter">
            <Select id="filter" name="filter" on:change={handleFilter}
                options={[
                    { value: "date", label: "Fecha" },
                    { value: "category", label: "Categoría" },
                    { value: "title", label: "Título" },
                    { value: "description", label: "Descripción" }
                ]}
                
                variant="primary"
                padding="1.5rem 1rem"
            />
        </div>

        <form class="reload" method="POST" action="?/reload" onsubmit={handleReload}>
            <Button text="&#x27F3;" fontSize="2rem" type="submit"/>
        </form>    
    </div>
    
    <search class="search-container">
        <label class="no-margin" for="search">Buscar:</label>
        <Input id="search" name="search" placeholder="Escribe para buscar..." bind:value={searchTerm}/>
    </search>

    {#if displayedFeed.length > 0 }
        {#key page}
            <Feed feed={displayedFeed} page={page} pageCount={pageCount} priorityCount={priorityCount}/>
        {/key}
    {:else}
        <p>No se encontraron feeds</p>
    {/if}    
</section>

<!--! Start of style Section -->
<style>
    label {
        font-weight: bold;
    }
    .container {
        margin: 4rem auto;
    }
    .order {
        display: grid;
        grid-template-columns: 2fr 1fr auto;
        grid-template-rows: auto auto;
        column-gap: 10rem;
        align-items: center;
    }
    .link-label {
        grid-column: 1;
        grid-row: 1;
    }
    .link {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        grid-column: 1;
        grid-row: 2;
    }
    .filter-label {
        grid-column: 2;
        grid-row: 1;
    }
    .filter {
        grid-column: 2;
        grid-row: 2;
    }
    .reload {
        grid-column: 3;
        grid-row: 2;
        justify-self: right;
    }
    .search-container {
        margin-top: 2rem;
    }
</style>
<!--! End of style Section -->