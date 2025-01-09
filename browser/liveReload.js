let isConnected = false;

const liveServerInit = () => {
	if (isConnected) return;

	const ws = new WebSocket("ws://localhost:5555/");

	ws.onmessage = (event) => {
		if (event.data === "reload") {
			console.log("Reloading page...");
			location.reload();
		}
	};

	ws.onopen = () => {
		console.log("Live reload connected.");
		isConnected = true;
	};

	ws.onclose = () => {
		console.log("Live reload disconnected.");
		isConnected = false;
	};

	ws.onerror = (err) => {
		console.error("WebSocket error:", err);
		isConnected = false;
	};
};

liveServerInit();
setInterval(() => (isConnected ? liveServerInit() : null), 5000); // check for live server every 5s
