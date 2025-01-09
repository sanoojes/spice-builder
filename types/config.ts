export type AppConfig = {
	themeName: string;
	liveReload: boolean;
	colorScheme: string;
	outDir: string;
	jsEntryPoints: string[];
	cssEntryPoints: string[];
	colorsIniEntryPoint: string;
};

export type SpiceConfig = {
	AdditionalOptions: AdditionalOptions;
	Patch: Record<string, string> | undefined;
	Setting: Setting;
	Preprocesses: Preprocesses;
	Backup: Backup;
};

type AdditionalOptions = {
	extensions: string;
	custom_apps: string;
	sidebar_config: string;
	home_config: string;
	experimental_features: string;
};

type Setting = {
	spotify_path: string;
	prefs_path: string;
	color_scheme: string;
	inject_css: string;
	replace_colors: string;
	current_theme: string;
	inject_theme_js: string;
	overwrite_assets: string;
	spotify_launch_flags: string;
	check_spicetify_update: string;
	always_enable_devtools: string;
};

type Preprocesses = {
	disable_sentry: string;
	disable_ui_logging: string;
	remove_rtl_rule: string;
	expose_apis: string;
};

type Backup = {
	version: string;
	with: string;
};
