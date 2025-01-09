import { context, type BuildOptions, build as esbuild } from "esbuild";
import { join } from "@std/path/join";
import { readConfig } from "@/utils/readConfig.ts";
import { externalGlobal } from "esbuild-external-global";
import { sassPlugin } from "esbuild-sass-plugin";
import { saveToColorsCSS } from "@/utils/color.ts";
import { parseIni } from "@/utils/parseIni.ts";
import { watchForFileChanges } from "@/utils/file.ts";
import { afterBuild, type AfterBuildCB, logger } from "@/utils/esPlugins.ts";

const buildColors = (entryPoint: string, cb?: AfterBuildCB) => {
	try {
		const startTime = Date.now();

		const path = join(entryPoint, "colors.ini");

		const rawContent = Deno.readTextFileSync(path);
		saveToColorsCSS(parseIni(rawContent), "dist/colors.css");

		const diff = Date.now() - startTime;
		console.log(`[Color] built in ${diff}ms`);

		cb?.();
	} catch (e) {
		console.error("Error building color.", e);
	}
};

type BuildProps = {
	watch?: boolean;
	minify?: boolean;
	cb?: AfterBuildCB;
	options?: BuildOptions;
};

export const build = async ({
	watch = false,
	minify = false,
	cb = () => {},
	options,
}: BuildProps = {}) => {
	const { themeName, themeFolders } = readConfig();

	const commonBuildOptions: BuildOptions = {
		bundle: true,
		platform: "browser",
		globalName: themeName,
		sourcemap: watch ? "external" : false,
		minify,
		...options,
	};

	const jsBuildOptions: BuildOptions = {
		...commonBuildOptions,
		entryPoints: [join(themeFolders.extension, "app.tsx")],
		outfile: "dist/theme.js",
		external: ["react", "react-dom"],
		...externalGlobal({
			react: "Spicetify.React",
			"react-dom": "Spicetify.ReactDOM",
		}),
		plugins: [logger("JS"), afterBuild(cb)],
	};

	const cssBuildOptions: BuildOptions = {
		...commonBuildOptions,
		entryPoints: [join(themeFolders.styles, "app.scss")],
		outfile: "dist/user.css",
		plugins: [sassPlugin(), logger("CSS"), afterBuild(cb)],
	};

	if (watch) {
		const watchForChanges = async (buildOptions: BuildOptions) => {
			const ctx = await context({ ...buildOptions });
			await ctx.watch();
		};

		(async () => {
			await Promise.all([
				watchForChanges(jsBuildOptions),
				watchForChanges(cssBuildOptions),
				watchForFileChanges(themeFolders.colors, () => {
					buildColors(themeFolders.colors, cb);
				}),
			]);
		})();

		console.log("Watching for file changes...");
	} else {
		await esbuild(jsBuildOptions);
		await esbuild(cssBuildOptions);
		buildColors(themeFolders.colors);
	}
};
