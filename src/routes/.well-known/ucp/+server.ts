import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import siteConfig from '$lib/config.json';
import { UCP_API_BASE_URL } from '$env/static/private';

const API_BASE = UCP_API_BASE_URL || 'https://accoma.de/api/ucp/v1';

interface UcpAccommodation {
	acco_id: string;
	name: string;
	availability_url: string;
	reservation_url: string;
}

interface BookingRequestBlock {
	id: string;
	kind: 'booking-request';
	content: {
		userID: string;
		accoID: string;
		accoName?: string;
		calUrl: string;
		[name: string]: unknown;
	};
	acco?: string;
}

interface Section {
	id: string;
	name?: string;
	header?: string;
	columnCount?: number;
	padding?: string;
	maxWidth?: string;
	blocks?: Array<{ kind: string; [key: string]: unknown }>;
}

function extractAccommodations(): UcpAccommodation[] {
	const accommodations: UcpAccommodation[] = [];
	const seenAccoIds = new Set<string>();

	for (const page of Object.values(siteConfig.pages)) {
		if (!page.content) continue;
		for (const section of page.content as Section[]) {
			if (!section.blocks) continue;
			for (const block of section.blocks) {
				if (block.kind === 'booking-request') {
					const br = block as BookingRequestBlock;
					const accoID = br.content.accoID;
					if (!accoID || seenAccoIds.has(accoID)) continue;
					seenAccoIds.add(accoID);
					accommodations.push({
						acco_id: accoID,
						name: br.content.accoName ?? '',
						availability_url: `${API_BASE}/availability?user=${siteConfig.settings.ACCOMADE_USER_ID}&acco=${accoID}`,
						reservation_url: `${API_BASE}/reservation`,
					});
				}
			}
		}
	}

	return accommodations;
}

export const GET: RequestHandler = async () => {
	const accommodations = extractAccommodations();

	return json(
		{
			ucp_version: '1.0',
			merchant: {
				name: '',
				merchant_id: siteConfig.settings.ACCOMADE_USER_ID,
			},
			capabilities: {
				'dev.ucp.booking.availability': { version: '1.1.0' },
				'dev.ucp.booking.reservation': {
					version: '1.0.0',
					extensions: ['dev.ucp.booking.inquiry_only'],
				},
			},
			transports: {
				rest: {
					base_url: API_BASE,
				},
			},
			accommodations,
		},
		{
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Cache-Control': 'public, max-age=3600',
			},
		},
	);
};