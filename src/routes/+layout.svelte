<script lang="ts">
  import { type Snippet } from 'svelte';
  import '$lib/loadFonts';
  import { installTwicPics } from '@twicpics/components/sveltekit';
  import '@twicpics/components/style.css';
  import siteConfig from '$lib/config.json' with { type: 'json' };

  let {
    children,
  }: {
    children?: Snippet;
  } = $props();

  installTwicPics({
    domain: `https://accomade.twic.pics`,
  });
</script>

<svelte:head>
  <meta name="description" content="ACCOMADE powered website to present holiday accomodations." />
  {@html `<` + `style>${siteConfig.css.base}</style>`}
</svelte:head>

<div>
  {@render children?.()}
</div>
