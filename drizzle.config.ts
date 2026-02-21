import type { Config } from "drizzle-kit";

import { env } from "~/env";

export default {
	schema: "./src/server/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	tablesFilter: ["workshop_devday_2026cr_*"],
} satisfies Config;
