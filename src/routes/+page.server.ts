import siteConfig from '$lib/config.json';
import { redirect } from '@sveltejs/kit';
 
export function load() {
	const path = `/${siteConfig.lang.defaultLang}`
  redirect(302, path); // needs `throw` in v1
}
