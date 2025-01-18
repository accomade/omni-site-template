<script lang="ts">
  import { getContext } from 'svelte';
  import type { SiteState } from '$lib/state.svelte';
  import siteConfig from '$lib/config.json' with {type: 'json'};
  import { PageComponent } from 'accomadesc';

  const landing = siteConfig.pages["/"];
  const ss: SiteState = getContext('SITE_STATE');

</script>

<PageComponent
  showFooter={true}
  nav={siteConfig.nav}
  {...landing} 
  {...ss} />
