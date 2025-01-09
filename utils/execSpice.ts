import type { AppConfig } from "@/types/init.ts";
import { u8Decode } from "@/utils/decoder.ts";

export const execSpice = (options: Deno.CommandOptions): Deno.CommandOutput => {
	return new Deno.Command("spicetify", options).outputSync();
};

export const setThemeConfig = (config: AppConfig) => {
	execSpice({
		args: [
			"config",
			"current_theme",
			config.themeName,
			"color_scheme",
			config.colorScheme,
			"extensions",
			`liveReload.js${config.isLiveReload ? "" : "-"}`,
		],
	});
};

export const resetThemeConfig = () => {
	execSpice({
		args: [
			"config",
			"current_theme",
			"",
			"color_scheme",
			"",
			"extensions",
			"liveReload.js-",
		],
	});
};

export const spiceApply = () => {
	const out = execSpice({ args: ["apply"] });
	if (out.success) {
		console.log("Theme applied to Spicetify.");
	} else {
		console.error(
			"Error appling Theme to Spicetify. \nLogs: \n",
			u8Decode(out.stdout),
		);
	}
};
