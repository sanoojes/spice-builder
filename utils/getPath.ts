import { u8Decode } from "@/utils/decoder.ts";
import { dirname } from "@std/path/dirname";

export const getSpiceConfigPath = () =>
	u8Decode(
		new Deno.Command("spicetify", { args: ["-c"] }).outputSync().stdout,
	).trim(); // get config path
export const getSpicePath = (config_path: string) => dirname(config_path);
