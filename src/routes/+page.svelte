<script lang="ts">
  import siteConfig from '$lib/config.json';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  const defaultLang = siteConfig.lang.defaultLang;
  let browserLang: string | null = null;
  if (browser) {
    browserLang = navigator.language;
    if (siteConfig.lang.supportedLangs.includes(browserLang)) {
      goto(`/${browserLang}`);
    } else {
      goto(`/${defaultLang}`);
    }
  }
</script>
