import type { TIni } from "@/types/build.ts";

export const parseIni = (content: string) => {
	const sections: TIni = {};
	let currentSection: string | null = null;

	for (let line of content.split("\n")) {
		line = line.trim();
		if (line.startsWith("[") && line.endsWith("]")) {
			currentSection = line.slice(1, -1);
			sections[currentSection] = {};
		} else if (currentSection && line.includes("=")) {
			const [key, value] = line.split("=").map((part) => part.trim());

			sections[currentSection][key] = value;
		}
	}

	return sections;
};
