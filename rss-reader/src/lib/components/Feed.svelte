<script lang="ts">
    import { Card, formatDate } from '$lib';
    import { goto } from '$app/navigation';
    import type { ArticleWithCategories } from '$lib/server/services';

    export let feed: ArticleWithCategories[] = [];
    export let page: number;
    export let pageCount: number;
    export let priorityCount: number;

    function goTo(p: number) {
        if (p < 1 || p > pageCount) return;
        goto(`?page=${p}`);
    }
</script>

<div class="pagination-buttons">
    <button
        class="btn"
        aria-label="First page"
        disabled={page === 1}
        on:click={() => goTo(1)}>
        «
    </button>

    <button
        class="btn"
        aria-label="Previous page"
        disabled={page === 1}
        on:click={() => goTo(page - 1)}>
        ‹
    </button>

    <div class="current-page">
        {page}
    </div>

    <button
        class="btn"
        aria-label="Next page"
        disabled={page === pageCount}
        on:click={() => goTo(page + 1)}>
        ›
    </button>

    <button
        class="btn"
        aria-label="Last page"
        disabled={page === pageCount}
        on:click={() => goTo(pageCount)}>
        »
    </button>
</div>

<div class="feed">
    {#each feed as item, i (item.id)}
    <Card date={formatDate(item.publishedAt ?? '') ?? ''} 
        title={item.title} link={item.link} 
        description={item.description ?? ''} 
        categories={item.categories}  
        imageUrl={item.imageUrl ?? undefined}
        priority={i < priorityCount}/>
    {/each}
</div>

<div class="pagination-buttons">
    <button
        class="btn"
        aria-label="First page"
        disabled={page === 1}
        on:click={() => goTo(1)}>
        «
    </button>

    <button
        class="btn"
        aria-label="Previous page"
        disabled={page === 1}
        on:click={() => goTo(page - 1)}>
        ‹
    </button>

    <div class="current-page">
        {page}
    </div>

    <button
        class="btn"
        aria-label="Next page"
        disabled={page === pageCount}
        on:click={() => goTo(page + 1)}>
        ›
    </button>

    <button
        class="btn"
        aria-label="Last page"
        disabled={page === pageCount}
        on:click={() => goTo(pageCount)}>
        »
    </button>
</div>

<style>
    .feed {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
        gap: 2rem;
    }

    /* Buttons */
    .pagination-buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin: 2rem 0;
    }

    .btn {
        font-size: 2.8rem;
        background: none;
        border: none;
        color: var(--blue);
        padding: 0.25rem 0.5rem;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
        line-height: 1;
    }
    .btn:hover:not(:disabled) {
        background: rgba(25, 118, 210, 0.1);
        border-radius: var(--borderRadius);
    }
    .btn:disabled {
        color: var(--lightGray);
        cursor: default;
    }
    .current-page {
        margin: 0 1rem;
        font-weight: 600;
        font-size: 2rem;
        width: 10rem;
        text-align: center;
    }
</style>
