<script lang="ts">
  import siteConfig from '$lib/config.json' with { type: 'json' };
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { PageComponent, type PageProps } from 'accomadesc';
  import { getContext } from 'svelte';
  import type { SiteState } from '$lib/state.svelte';

  const pages: Record<string, PageProps> = siteConfig.pages as Record<string, PageProps>;
  const pageLookup = `${page.params['page']}`;
  const thePage = pages[pageLookup];

  const ss: SiteState = getContext('SITE_STATE');

  if (browser && !thePage) {
    goto('/');
  }
</script>

<svelte:head>
  {#if thePage.title}
    <title>{ss.translateFunc(thePage.title)}</title>
  {/if}
</svelte:head>

<PageComponent {...thePage} {...ss} css={siteConfig.css} />
