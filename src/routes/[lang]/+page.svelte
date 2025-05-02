<script lang="ts">
  import { getContext } from 'svelte';
  import type { SiteState } from '$lib/state.svelte';
  import siteConfig from '$lib/config.json' with { type: 'json' };
  import { PageComponent, type PageProps } from 'accomadesc';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';

  const landing = siteConfig.pages['/'] as PageProps;
  const ss: SiteState = getContext('SITE_STATE');

  if (browser && !landing) {
    goto('404');
  }
</script>

<svelte:head>
  {#if landing.title}
    <title>{ss.translateFunc(landing.title)}</title>
  {/if}
</svelte:head>

<PageComponent {...landing} {...ss} css={siteConfig.css} bind:selectedTheme={ss.selectedTheme} />
