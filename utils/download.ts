export const downloadFile = async (
	url: string,
	outputPath: string,
): Promise<void> => {
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Failed to download file: ${response.status} - ${response.statusText}`,
			);
		}
		const fileData = new Uint8Array(await response.arrayBuffer());

		await Deno.writeFile(outputPath, fileData);
	} catch (error) {
		console.error(
			`Error occurred while downloading the file: ${error instanceof Error ? error.message : error}`,
		);
	}
};
