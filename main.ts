import { Command } from "@cliffy/command";
import { build } from "@/commands/build.ts";
import { apply } from "@/commands/apply.ts";
import { init } from "@/commands/init.ts";

const main = () => {
	const cliffy = new Command()
		.name("spice-builder")
		.version("0.1.1")
		.description("A command-line tool for building Spicetify themes");

	cliffy
		.command("build")
		.description("Build the theme files")
		.option("-w, --watch", "Watch for file changes and rebuild automatically", {
			default: false,
		})
		.option("-m, --minify", "Minify the output files", {
			default: false,
		})
		.option(
			"-a, --apply",
			"Apply the built files to Spicetify after building",
			{
				default: false,
			},
		)
		.action(async ({ watch, minify, apply: isApply }) => {
			try {
				console.log("🔨 Building theme...");
				if (isApply) await apply({ watch, mode: watch ? "both" : "spice" });
				else await build({ watch, minify });
				if (!watch) console.log("Build completed successfully.");
			} catch (error) {
				console.error("❌ Build failed:", error);
				Deno.exit(1);
			}
		});

	cliffy
		.command("apply")
		.description("Apply the built theme to Spicetify")
		.option("-w, --watch", "Watch for changes and reapply automatically", {
			default: false,
		})
		.action(async ({ watch }) => {
			try {
				console.log("📦 Applying theme...");
				await apply({ watch, mode: watch ? "both" : "spice" });
			} catch (error) {
				console.error("❌ Apply failed:", error);
				Deno.exit(1);
			}
		});

	cliffy
		.command("init")
		.description("Initialize theme files and configuration")
		.action(async () => {
			try {
				console.log("📦 Initializing theme...");
				await init();
			} catch (error) {
				console.error("❌ Initialization failed:", error);
				Deno.exit(1);
			}
		});

	cliffy.parse(Deno.args);
};

if (import.meta.main) main();
