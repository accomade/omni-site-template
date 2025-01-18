export const prerender = true;
import { 
	DEPLOY_DATE, 
	PRIMARY_DOMAIN,
	RENDER_EXTERNAL_HOSTNAME,
} from '$env/static/private';
import siteConfig from '$lib/config.json' with { type: 'json' };

let domain = PRIMARY_DOMAIN;
if(!domain) {
	domain = RENDER_EXTERNAL_HOSTNAME;
}


let pages: string = '';
for (const l of siteConfig.lang.supportedLangs) {
	for (const p of Object.values(siteConfig.pages)) { 
		pages += 
`
	<url>
		<loc>https://${domain}/${l}${p.path}</loc>
		<lastmod>${p.lastChange ?? DEPLOY_DATE}</lastmod>
	</url>
`;
	}
}

export async function GET() {
	return new Response(
`
<?xml version="1.0" encoding="UTF-8" ?>
<urlset
	xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:xhtml="https://www.w3.org/1999/xhtml"
	xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
	xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
	xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
	xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
	<!-- <url> elements go here -->
	<url>
		<loc>https://${domain}</loc>
		<lastmod>${DEPLOY_DATE}</lastmod>
	</url>
	${pages}
</urlset>
`.trim(),
	{
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
