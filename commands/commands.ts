const ARGUMENTS = [
	{
		name: "help",
		alias: ["h"],
		description: "Display this help and exit",
		type: "boolean",
	},
	{
		name: "version",
		alias: ["v"],
		description: "Show version information",
		type: "boolean",
	},
	{
		name: "config",
		alias: ["c"],
		description: "Set configuration key-value pair (format: key:value)",
		type: "string",
	},
];

export const ARG_ALIASES: Record<string, string> = {};
export const BOOLEAN_ARGS: string[] = [];
export const STRING_ARGS: string[] = [];

for (const arg of ARGUMENTS) {
	for (const alias of arg.alias) {
		ARG_ALIASES[alias] = arg.name;
	}
	if (arg.type === "string") {
		STRING_ARGS.push(arg.name);
	} else if (arg.type === "boolean") {
		BOOLEAN_ARGS.push(arg.name);
	}
}
