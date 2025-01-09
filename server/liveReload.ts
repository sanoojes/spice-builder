let webSocket: WebSocket | null = null;
const clients: Set<WebSocket> = new Set();

export const serveLiveServer = () => {
	Deno.serve({ hostname: "localhost", port: 5555 }, (req) => {
		if (req.headers.get("upgrade") !== "websocket") {
			return new Response(null, { status: 501 });
		}

		const { socket, response } = Deno.upgradeWebSocket(req);
		webSocket = socket;

		clients.add(socket);

		socket.addEventListener("open", () => {
			console.log("Spotify Connected!");
		});

		socket.addEventListener("close", () => {
			console.log("Spotify Disconnected!");
			clients.delete(socket);
		});

		socket.addEventListener("error", (ev) => {
			console.error("WebSocket Error: ", ev);
		});

		return response;
	});
};

export const sendReloadSignal = () => {
	if (!webSocket) {
		console.error("Live Server not running. Cannot send reload signal");
		return;
	}
	if (clients.size === 0) {
		console.error("No clients connected. Cannot send reload signal");
		return;
	}

	for (const client of clients) {
		if (client.readyState === WebSocket.OPEN) {
			client.send("reload");
		} else {
			console.warn("WebSocket not open, skipping send.");
		}
	}
};
