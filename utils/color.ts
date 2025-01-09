import { readConfig } from "@/utils/readConfig.ts";
import type { TColor } from "@/types/build.ts";

export const saveToColorsCSS = (
	sections: TColor,
	path: string,
	minify = false,
) => {
	const { colorScheme } = readConfig();
	const newl = minify ? "" : "\n";
	const tab = minify ? "" : "\t";

	let css = `:root {${newl}`;

	if (!sections[colorScheme]) {
		console.error(`Colors not found for ${colorScheme}`);
		return;
	}

	const section = sections[colorScheme];

	for (const [key, value] of Object.entries(section)) {
		const rgb = hexToRgb(value);
		if (!rgb) {
			console.error(`Invalid hex found for key:${key} hex:${value}`);
			return;
		}
		css += `${tab}--spice-${key}: #${value};${newl}`; // Add hex value
		css += `${tab}--spice-${key}-rgb: ${rgb.r},${rgb.g},${rgb.b};${newl}`; // Add RGB value
	}

	css += "${newl}}";

	Deno.writeTextFileSync(path, css);
};

export const hexToRgb = (hex: string) => {
	const result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: Number.parseInt(result[1], 16),
				g: Number.parseInt(result[2], 16),
				b: Number.parseInt(result[3], 16),
			}
		: null;
};
