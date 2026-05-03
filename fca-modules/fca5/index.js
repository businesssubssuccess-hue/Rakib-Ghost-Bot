/**
 * 👻 FCA5 — Xaviabot / Neokex FCA
 * Based on @xaviabot/fca-unofficial — used in Neokex GoatBot V2
 * Same fb-chat-api interface, different anti-detection internals
 * Author: Rakib Islam (Ghost Net Edition)
 */

const baseLogin = require("@xaviabot/fca-unofficial");

module.exports = function xaviaLogin(loginData, options, callback) {
  if (typeof options === "function") { callback = options; options = {}; }
  options = Object.assign({}, options || {});

  // Keep only safe options compatible with @xaviabot/fca-unofficial
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
    userAgent: options.userAgent ||
      "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.143 Mobile Safari/537.36"
  };

  console.log("👻 [FCA5: xaviabot/fca-unofficial] Login starting (Neokex mode)...");
  return baseLogin(loginData, safeOptions, callback);
};
