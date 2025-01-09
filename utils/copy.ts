import {
	SPICE_EXTENSION_PATH,
	SPICE_THEMES_PATH,
	COLORS_PATH,
	USERCSS_PATH,
	THEMEJS_PATH,
	LIVERELOAD_PATH,
} from "@/constants.ts";
import { readConfig } from "@/utils/readConfig.ts";
import { join } from "@std/path/join";
import { exists } from "@std/fs/exists";
import { getLiveReloadExtPath } from "@/utils/liveReload.ts";
import type { moveMode } from "@/types/build.ts";

export const copyFile = async (from: string, to: string) => {
	try {
		await Deno.stat(from);

		const data = await Deno.readFile(from);
		await Deno.writeFile(to, data);
		// console.debug(`Copied file: ${from} -> ${to}`);
	} catch (error) {
		console.error(
			`Error occurred while copying file From: ${from} To: ${to} Error: ${error instanceof Error ? error.message : error}`,
		);
		throw error;
	}
};

export const copyFolder = async (
	from: string,
	to: string,
	filter?: (entry: Deno.DirEntry) => boolean,
) => {
	try {
		const fromInfo = await Deno.stat(from);
		if (!fromInfo.isDirectory) {
			throw new Error(`Source path is not a directory: ${from}`);
		}

		try {
			await Deno.mkdir(to, { recursive: true });
		} catch (err) {
			if (!(err instanceof Deno.errors.AlreadyExists)) {
				throw err;
			}
		}

		for await (const entry of Deno.readDir(from)) {
			if (filter && !filter(entry)) {
				// console.debug(`Skipping entry (filtered): ${entry.name}`);
				continue;
			}

			const sourcePath = join(from, entry.name);
			const targetPath = join(to, entry.name);

			if (entry.isFile) {
				copyFile(sourcePath, targetPath);
			} else if (entry.isDirectory) {
				await copyFolder(sourcePath, targetPath, filter);
			} else {
				console.warn(`Skipping unsupported entry: ${sourcePath}`);
			}
		}

		console.debug(`Successfully copied folder From: ${from} To: ${to}`);
	} catch (error) {
		console.error(
			`Error occurred while copying folder From: ${from} To: ${to}`,
			`Error: ${error instanceof Error ? error.message : error}`,
		);
	}
};

export const copyThemeFiles = async (to: moveMode = "spice") => {
	try {
		console.debug("Copying theme files...");
		const config = readConfig();
		// copy liveReload if needed
		if (config.isLiveReload && !(await exists("dist/liveReload.js"))) {
			const path = await getLiveReloadExtPath();

			if (to === "spice")
				await copyFile(path, join(SPICE_EXTENSION_PATH, "liveReload.js"));
			else if (to === "spotify") await copyFile(path, join(LIVERELOAD_PATH));
			console.log("Added Live Reload Support.");
		}
		if (to === "spice" || to === "both") {
			await copyFolder(
				"dist",
				join(SPICE_THEMES_PATH, config.themeName),
				(entry) => !(entry.name.endsWith(".map") || entry.name === "color.css"),
			);
		}

		if (to === "spice" || to === "both") {
			await copyFile("dist/colors.css", COLORS_PATH);
			await copyFile("dist/user.css", USERCSS_PATH);
			await copyFile("dist/theme.js", THEMEJS_PATH);
		}

		console.debug("Copied theme files.");
	} catch {
		console.error("Error occoured while copying theme files.");
	}
};
