/**
 * Ghost Net — Render/Production wrapper
 * --------------------------------------------------------------
 * Render এর "no open port found" error fix এর জন্য এই wrapper
 * সবার আগে Express server কে 0.0.0.0:$PORT এ bind করে — এতে
 * Render এর port-scanner সঙ্গে সঙ্গে service কে detect করে।
 * এরপর actual bot (Sakura.js) কে background এ spawn করা হয়।
 */

const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const PORT = parseInt(process.env.PORT, 10) || 3001;
const BOT_PORT = parseInt(process.env.BOT_PORT, 10) || 8080;

const app = express();
let botStatus = "starting";
let botStartedAt = Date.now();
let lastError = null;

app.get("/", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({
    name: "Ghost Net Edition",
    status: "online",
    bot: botStatus,
    uptime_sec: Math.floor((Date.now() - botStartedAt) / 1000),
    last_error: lastError,
    powered_by: "Rakib Islam"
  });
});

app.get("/health", (req, res) => res.status(200).send("OK"));
app.get("/ping", (req, res) => res.status(200).send("pong"));

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Wrapper server bound to 0.0.0.0:${PORT}`);
  startBot();
});

server.on("error", (e) => {
  console.error("❌ Wrapper server error:", e.message);
  process.exit(1);
});

function startBot() {
  console.log(`🚀 Starting Ghost Net bot... (internal PORT=${BOT_PORT})`);
  const child = spawn("node", ["Sakura.js"], {
    cwd: __dirname,
    stdio: "inherit",
    env: { ...process.env, PORT: String(BOT_PORT) }
  });

  botStatus = "running";

  child.on("exit", (code) => {
    botStatus = `exited (code ${code})`;
    console.log(`⚠️  Bot exited with code ${code} — restart in 5s...`);
    setTimeout(startBot, 5000);
  });

  child.on("error", (err) => {
    lastError = err.message;
    botStatus = "error";
    console.error("❌ Bot spawn error:", err);
  });
}

process.on("unhandledRejection", (e) => console.error("unhandledRejection:", e));
process.on("uncaughtException", (e) => console.error("uncaughtException:", e));
