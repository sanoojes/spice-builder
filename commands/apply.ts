import { copyThemeFiles } from "@/utils/copy.ts";
import type { moveMode } from "@/types/build.ts";
import { spiceApply } from "@/utils/execSpice.ts";
import { setThemeConfig } from "@/utils/execSpice.ts";
import { build } from "@/commands/build.ts";
import { debounce } from "@std/async/debounce";
import type { AfterBuildCB } from "@/utils/esPlugins.ts";
import { readConfig } from "@/utils/readConfig.ts";
import { sendReloadSignal, serveLiveServer } from "@/server/liveReload.ts";

export type ApplyProps = { watch?: boolean; minify?: boolean; mode?: moveMode };

export const apply = async ({
	watch = false,
	minify = false,
	mode = "spice",
}: ApplyProps) => {
	try {
		const config = readConfig();

		if (watch) serveLiveServer();

		setThemeConfig(config);

		const afterBuild: AfterBuildCB = async ({ count }) => {
			await copyThemeFiles(watch ? "both" : mode);

			if (count === 1) {
				spiceApply();
			}

			sendReloadSignal();
		};

		await build({ watch, minify, cb: debounce(afterBuild, 300) });
	} catch (error) {
		console.error("Error during theme application:", error);
	}
};
