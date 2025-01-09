import { getSpiceConfigPath, getSpicePath } from "@/utils/getPath.ts";
import { getCurrentSpiceConfig } from "@/utils/getConfig.ts";
import type { SpiceConfig } from "@/types/config.ts";
import { join } from "@std/path/join";

// PATHS
export const CONFIG_PATH = join(Deno.cwd(), "config.json");
export const SPICE_CONFIG_PATH = getSpiceConfigPath();
export const SPICE_CONFIG: SpiceConfig = getCurrentSpiceConfig();
export const SPICE_PATH = getSpicePath(SPICE_CONFIG_PATH);
export const SPICE_EXTENSION_PATH = join(SPICE_PATH, "/Extensions/");
export const SPICE_THEMES_PATH = join(SPICE_PATH, "/Themes/");
export const SPOTIFY_PATH = SPICE_CONFIG.Setting.spotify_path
	.trim()
	.replaceAll("\\", "/");
export const XPUI_PATH = join(SPOTIFY_PATH, "/Apps/xpui/");
export const COLORS_PATH = join(SPOTIFY_PATH, "/Apps/xpui/color.css");
export const USERCSS_PATH = join(SPOTIFY_PATH, "/Apps/xpui/user.css");
export const EXTENSION_PATH = join(SPOTIFY_PATH, "/Apps/xpui/extensions/");
export const THEMEJS_PATH = join(SPOTIFY_PATH, "theme.js");
export const LIVERELOAD_PATH = join(EXTENSION_PATH, "liveReload.js");

export const EXTENSION_CONTENTS = `
const main = () => {
  console.log('App running...');
};

main();
`;

export const STYLE_CONTENTS = "";

export const COLOR_CONTENTS = `
[dark]
sidebar=000000
selected-row=ffffff
button=1db954
highlight=1a1a1a
main=121212
main-elevated=242424
button-active=1ed760
card=282828
button-disabled=535353
tab-active=333333
notification=4687d6
highlight-elevated=2a2a2a
shadow=000000
misc=7f7f7f
notification-error=e22134
subtext=b3b3b3
player=181818
text=000aaa
`;
