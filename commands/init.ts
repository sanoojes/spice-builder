import { createThemeFilesTo } from "@/utils/file.ts";
import { setThemeConfig, spiceApply } from "@/utils/execSpice.ts";
import { askQuiz } from "@/utils/quiz.ts";
import { setupLiveReload } from "@/utils/liveReload.ts";
import { build } from "@/commands/build.ts";
import { setConfig } from "@/utils/readConfig.ts";

export const init = async () => {
	try {
		console.log("Starting theme initialization process...");
		const config = askQuiz();
		setConfig(config);

		if (config.genExample) {
			console.log("Creating theme files...");
			createThemeFilesTo(config.themeFolders.main, config);
		} else {
			console.log("Skipping theme file creation (Example theme disabled).");
		}

		if (config.isLiveReload) {
			console.log("Live Reload feature is enabled. Setting up files...");
			setupLiveReload();
		} else {
			console.log("Live Reload feature is disabled.");
		}

		console.log("Applying theme configuration...");
		setThemeConfig(config);

		if (config.genExample) {
			console.log("Building the theme...");
			await build();

			console.log(
				"Applying configuration to Spicetify (Spotify will restart)... ",
			);
			spiceApply();
		}

		console.log("Theme initialization completed successfully!");
	} catch (error) {
		console.error("An error occurred during theme initialization:", error);
	}
};
