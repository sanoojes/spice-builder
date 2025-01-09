import { exists, ensureDirSync } from "@std/fs";
import { join } from "@std/path/join";
import { debounce } from "@std/async";
import { EXTENSION_CONTENTS } from "@/constants.ts";
import { STYLE_CONTENTS } from "@/constants.ts";
import { COLOR_CONTENTS } from "@/constants.ts";
import type { AppConfig } from "@/types/init.ts";
import { getLiveReloadExtPath } from "@/utils/liveReload.ts";
import { execSync } from "@/utils/exec.ts";

export const hasFilesIn = (path: string) => {
	try {
		for (const entry of Deno.readDirSync(path)) {
			if (entry.isFile) return true;
		}
		return false;
	} catch {
		return false;
	}
};
export const hasFilesInCwd = () => {
	for (const entry of Deno.readDirSync(Deno.cwd())) {
		if (entry.isFile) return true;
	}
	return false;
};

export const createThemeFilesTo = (path: string, config: AppConfig) => {
	if (hasFilesIn(path)) {
		console.error(
			"Error: The target folder is not empty. Please initialize the theme in an empty folder.",
		);
		Deno.exit();
	}

	const { themeFolders } = config;
	ensureDirSync(themeFolders.main);
	console.log(`Created theme folder: ${themeFolders.main}`);

	for (const folder of Object.values(themeFolders)) {
		// Create folders
		ensureDirSync(folder);
	}

	Deno.writeTextFileSync(
		join(themeFolders.main, "config.json"),
		JSON.stringify(config),
	);

	Deno.writeTextFileSync(
		join(themeFolders.extension, "app.tsx"),
		EXTENSION_CONTENTS,
	);

	Deno.writeTextFileSync(join(themeFolders.styles, "app.scss"), STYLE_CONTENTS);

	Deno.writeTextFileSync(
		join(themeFolders.colors, "colors.ini"),
		COLOR_CONTENTS,
	);

	(async () => {
		Deno.writeTextFileSync(
			join(themeFolders.types, "spicetify.d.ts"),
			await getLiveReloadExtPath(),
		);
	})();

	const denoConfig = {
		tasks: {
			dev: "spice-builder apply -w",
			apply: "spice-builder apply",
			build: "spice-builder build",
			"build-minify": "spice-builder build -m",
			"build-watch": "spice-builder build -w",
		},
		imports: {
			"@/": "./extension",
			"@colors/": "./colors",
			"@styles/": "./styles",
		},
		nodeModulesDir: "auto",
	};
	Deno.writeTextFileSync(
		join(themeFolders.main, "deno.json"),
		JSON.stringify(denoConfig, null, 2),
	);

	execSync("deno", { args: ["install"] });
};

export const watchForFileChanges = async (path: string, cb: () => void) => {
	if (!(await exists(path))) {
		console.error(path, " Does not exists skipping..");
		return;
	}

	cb();

	const debouncedCb = debounce(cb, 150);
	const watcher = Deno.watchFs(path);
	for await (const _ of watcher) {
		debouncedCb();
	}
};
