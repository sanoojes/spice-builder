export type ThemePaths = {
	main: string;
	extension: string;
	styles: string;
	colors: string;
	types: string;
};
export type AppConfig = {
	themeName: string;
	colorScheme: string;
	isLiveReload: boolean;
	genExample: boolean;
	themeFolders: ThemePaths;
};
