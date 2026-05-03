const baseLogin = require("fca-unofficial");

// fca-unofficial uses the same fb-chat-api signature:
// login({ appState }, options, callback)
// Wrap to ensure compatibility with GoatBot's optionsFca format.
module.exports = function fcaUnofficialLogin(loginData, options, callback) {
  if (typeof options === "function") { callback = options; options = {}; }
  options = Object.assign({}, options || {});

  // fca-unofficial may not support some GoatBot-specific keys — strip unknowns
  // Keep only the core keys that fca-unofficial handles
  const safeOptions = {
    forceLogin: options.forceLogin !== undefined ? options.forceLogin : true,
    listenEvents: options.listenEvents !== undefined ? options.listenEvents : true,
    selfListen: options.selfListen !== undefined ? options.selfListen : false,
    online: options.online !== undefined ? options.online : true,
    autoMarkDelivery: options.autoMarkDelivery !== undefined ? options.autoMarkDelivery : false,
    autoMarkRead: options.autoMarkRead !== undefined ? options.autoMarkRead : false,
    updatePresence: options.updatePresence !== undefined ? options.updatePresence : false,
    autoReconnect: options.autoReconnect !== undefined ? options.autoReconnect : true,
    logLevel: options.logLevel || "error",
    userAgent: options.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  };

  console.log("👻 [FCA2: fca-unofficial] Login starting...");
  return baseLogin(loginData, safeOptions, callback);
};
