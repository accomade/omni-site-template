<script lang="ts">
  import siteConfig from '$lib/config.json';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  const defaultLang = siteConfig.lang.defaultLang;
  if(browser) {
    goto(`/${defaultLang}`);
  }
</script>


