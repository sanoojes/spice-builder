import type { AppConfig } from "@/types/init.ts";
import { CONFIG_PATH } from "@/constants.ts";
import { existsSync } from "@std/fs/exists";

let config: AppConfig | null = null;

export const setConfig = (newConfig: AppConfig) => {
	config = newConfig;
};

export const readConfig = (): AppConfig => {
	try {
		if (config) return config;

		if (!existsSync(CONFIG_PATH)) {
			console.error("Config file does not exist here. Exiting...");
			Deno.exit();
		}

		const data: AppConfig = JSON.parse(Deno.readTextFileSync(CONFIG_PATH));

		if (
			typeof data?.themeName === "string" &&
			typeof data?.colorScheme === "string" &&
			typeof data?.isLiveReload === "boolean" &&
			typeof data?.genExample === "boolean" &&
			typeof data?.themeFolders === "object" &&
			data?.themeFolders !== null &&
			typeof data?.themeFolders.main === "string" &&
			typeof data?.themeFolders.colors === "string" &&
			typeof data?.themeFolders.extension === "string" &&
			typeof data?.themeFolders.styles === "string" &&
			typeof data?.themeFolders.types === "string"
		) {
			config = data;
			return data as AppConfig;
		}

		console.error("Invalid config structure.");
		Deno.exit();
	} catch {
		console.error("Error reading config file.");
		// console.debug(error);
		Deno.exit();
	}
};
