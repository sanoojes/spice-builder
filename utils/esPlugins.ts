import type { BuildResult, Plugin } from "esbuild";

export const logger: (buildType: string) => Plugin = (buildType) => {
	return {
		name: "logger",
		setup(build) {
			let startTime: number;
			let buildCount = 0;

			const isFirstRun = () => buildCount === 0;

			build.onStart(() => {
				startTime = Date.now();
				if (isFirstRun()) {
					console.log(`[${buildType}] build started...`);
				} else {
					console.log(`[${buildType}] Changes detected. Rebuilding...`);
				}
			});

			build.onEnd((result) => {
				buildCount++;
				const endTime = Date.now();
				const duration = endTime - startTime;

				if (result.errors.length === 0) {
					console.log(
						`[${buildType}] Build completed successfully in ${duration} ms`,
					);
				} else {
					console.error(
						`[${buildType}] Build failed with ${result.errors.length} error(s) in ${duration} ms`,
					);
					result.errors.forEach((error, index) => {
						console.error(`[Error ${index + 1}]: ${error.text}`);
					});
				}

				if (result.warnings.length > 0) {
					console.warn(
						`[${buildType}] Build completed with ${result.warnings.length} warning(s):`,
					);
					result.warnings.forEach((warning, index) => {
						console.warn(`[Warning ${index + 1}]: ${warning.text}`);
					});
				}
			});
		},
	};
};

export type AfterBuildCB = (result: BuildResult & { count?: number }) => void;

export const afterBuild: (callback: AfterBuildCB) => Plugin = (callback) => {
	return {
		name: "afterBuild",
		setup(build) {
			let count = 0;
			build.onStart(() => {
				count++;
			});
			build.onEnd((res) => {
				callback({ ...res, count });
			});
		},
	};
};
