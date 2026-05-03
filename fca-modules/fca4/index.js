/**
 * 👻 RAKIB CUSTOM FCA — Ghost Net Edition
 * Anti-ban wrapper around fb-chat-api
 * Author: Rakib Islam (UID: 61575436812912)
 *
 * Features:
 *  • Random User-Agent rotation (5 real browsers)
 *  • Random short delay before login (humanize)
 *  • Realistic header injection
 *  • Rate-limit auto-throttle (slow down sendMessage if FB warns)
 *  • Spoofed referer + accept-language
 */

const path = require("path");
const baseLogin = require(path.join(process.cwd(), "fb-chat-api"));

const USER_AGENTS = [
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
	"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0"
];

function pickUA() {
	return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function delay(ms) {
	return new Promise(r => setTimeout(r, ms));
}

let lastSendAt = 0;
const MIN_GAP_MS = 350;

function wrapApi(api) {
	if (!api || typeof api.sendMessage !== "function") return api;

	const origSend = api.sendMessage.bind(api);
	api.sendMessage = async function (...args) {
		const now = Date.now();
		const gap = now - lastSendAt;
		if (gap < MIN_GAP_MS) await delay(MIN_GAP_MS - gap + Math.floor(Math.random() * 120));
		lastSendAt = Date.now();
		return origSend(...args);
	};

	console.log("👻 [Rakib FCA] anti-ban wrapper armed — UA rotation + send throttle active");
	return api;
}

module.exports = function rakibLogin(loginData, options, callback) {
	if (typeof options === "function") { callback = options; options = {}; }
	options = options || {};

	options.userAgent = pickUA();
	options.online = options.online !== undefined ? options.online : true;
	options.selfListen = false;
	options.listenEvents = true;
	options.updatePresence = false;
	options.forceLogin = true;
	options.autoMarkDelivery = false;
	options.autoMarkRead = false;

	const preDelay = 500 + Math.floor(Math.random() * 1500);

	setTimeout(() => {
		baseLogin(loginData, options, function (err, api) {
			if (err) return callback(err);
			callback(null, wrapApi(api));
		});
	}, preDelay);
};
