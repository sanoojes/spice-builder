import { getSpiceConfigPath } from "@/utils/getPath.ts";
import { parseIni } from "@/utils/parseIni.ts";
import type { SpiceConfig } from "@/types/config.ts";

export const getCurrentSpiceConfig = (): SpiceConfig => {
	try {
		const rawIni = Deno.readTextFileSync(getSpiceConfigPath());
		const parsedIni = parseIni(rawIni) as SpiceConfig;

		return parsedIni;
	} catch (e) {
		console.error("Error reading current spicetify config.", e);
		Deno.exit();
	}
};
