import { downloadFile } from "@/utils/download.ts";
import { join } from "@std/path/join";
import { existsSync } from "@std/fs/exists";
import { copyFile } from "@/utils/copy.ts";
import { LIVERELOAD_PATH } from "@/constants.ts";

export const download = async (
	path: string,
	url: string,
	name: string,
): Promise<string> => {
	if (existsSync(path)) {
		return path;
	}

	console.log(`Downloading ${name} from web.`);

	await downloadFile(url, path);
	return path;
};

export const getLiveReloadExtPath = async (): Promise<string> =>
	await download(
		join("dist", "liveReload.js"),
		"https://cdn.jsdelivr.net/gh/sanoojes/spice-builder@refs/heads/master/browser/liveReload.js",
		"Live reload extension",
	);

export const setupLiveReload = async () => {
	const path = await getLiveReloadExtPath();
	copyFile(path, LIVERELOAD_PATH);
};
