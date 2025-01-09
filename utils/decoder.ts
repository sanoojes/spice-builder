export const u8Decode = (data: Uint8Array): string => {
	return new TextDecoder().decode(data);
};
