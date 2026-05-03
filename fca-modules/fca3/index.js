const ws3 = require("ws3-fca");
const loginFn = ws3.login || ws3;

// ws3-fca uses WebSocket/MQTT — same login signature as fb-chat-api
// login({ appState }, options, callback)
module.exports = function ws3FcaLogin(loginData, options, callback) {
  if (typeof options === "function") { callback = options; options = {}; }
  options = Object.assign({}, options || {});

  // ws3-fca core-compatible options
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

  console.log("👻 [FCA3: ws3-fca] Login starting (WebSocket mode)...");
  return loginFn(loginData, safeOptions, callback);
};
