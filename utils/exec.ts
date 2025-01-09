export const exec = (
	command: string,
	options: Deno.CommandOptions,
): Promise<Deno.CommandOutput> => {
	return new Deno.Command(command, options).output();
};

export const execSync = (
	command: string,
	options: Deno.CommandOptions,
): Deno.CommandOutput => {
	return new Deno.Command(command, options).outputSync();
};
