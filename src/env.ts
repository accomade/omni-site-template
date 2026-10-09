import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  DEPLOY_DATE: { static: true },
  PRIMARY_DOMAIN: { static: true },
  RENDER_EXTERNAL_HOSTNAME: { static: true },
});
