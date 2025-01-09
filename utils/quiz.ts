import { join } from "@std/path/join";
import type { AppConfig, ThemePaths } from "@/types/init.ts";
import { basename } from "@std/path";

const getVarFromUser = (
	valueName: string,
	defaultValue: string | null = null,
): string => {
	const variableNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
	let themeName: string | null = null;
	while (!themeName || !variableNameRegex.test(themeName)) {
		themeName = prompt(
			`${valueName}${defaultValue !== null ? ` (default:${defaultValue})` : ""}:`,
		);
		if (!themeName) {
			if (defaultValue !== null) return defaultValue;
			console.error(`Error: ${valueName} cannot be empty.`);
		} else if (!variableNameRegex.test(themeName) && defaultValue === null) {
			console.error(
				`Error: ${valueName} must be a valid variable name (e.g., no spaces, starts with a letter or '_').`,
			);
		}
	}
	return themeName;
};

export const askQuiz = (): AppConfig => {
	const baseName = basename(Deno.cwd());
	const themeName = getVarFromUser("Theme Name", baseName);

	const colorScheme = getVarFromUser("Color Scheme", "dark");

	const isLiveReload = confirm("Do you want Live Reload Support?:");

	const genExample = confirm("Do you want to generate a example ?");

	const mainFolder = join(Deno.cwd(), themeName === baseName ? "" : themeName);

	const themeFolders: ThemePaths = {
		main: mainFolder,
		colors: join(mainFolder, "colors"),
		extension: join(mainFolder, "extension"),
		styles: join(mainFolder, "styles"),
		types: join(mainFolder, "types"),
	};

	return {
		themeName,
		colorScheme,
		isLiveReload,
		genExample,
		themeFolders,
	};
};
