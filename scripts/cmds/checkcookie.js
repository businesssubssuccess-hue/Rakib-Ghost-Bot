module.exports = {
	config: {
		name: "checkcookie",
		aliases: ["cookiecheck", "cookieinfo"],
		version: "1.0.0",
		author: "Rakib",
		countDown: 5,
		role: 2,
		description: {
			en: "Check FB cookie/appstate health"
		},
		category: "system",
		guide: {
			en: "{pn}"
		}
	},

	onStart: async function ({ message, event }) {
		const fs = require("fs");
		const path = require("path");
		message.reaction("⏳", event.messageID);
		const file = path.join(process.cwd(), "account.txt");
		if (!fs.existsSync(file)) {
			message.reaction("❌", event.messageID);
			return message.reply("❌ account.txt পাওয়া যায়নি!");
		}
		let cookies;
		try {
			cookies = JSON.parse(fs.readFileSync(file, "utf8"));
			if (!Array.isArray(cookies)) throw new Error("Not an array");
		} catch (e) {
			message.reaction("❌", event.messageID);
			return message.reply(`❌ account.txt invalid JSON:\n${e.message}\n\n💡 Cookie Editor দিয়ে export করো → JSON format এ save করো।`);
		}
		const must = ["c_user", "xs", "datr", "fr", "sb"];
		const found = cookies.map(c => c.key || c.name).filter(Boolean);
		const missing = must.filter(k => !found.includes(k));
		const cUser = cookies.find(c => (c.key || c.name) === "c_user");
		const xs = cookies.find(c => (c.key || c.name) === "xs");
		const now = Date.now() / 1000;
		const expired = cookies.filter(c => c.expirationDate && c.expirationDate < now);
		const status = missing.length === 0 && expired.length === 0 ? "🟢 HEALTHY" : "🔴 PROBLEM";
		const msg = `╔═〘 🍪 𝗖𝗢𝗢𝗞𝗜𝗘 𝗖𝗛𝗘𝗖𝗞 〙═╗

📊 Status: ${status}
🔢 Total cookies: ${cookies.length}

🔑 Essential cookies:
${must.map(k => `  ${found.includes(k) ? "✅" : "❌"} ${k}`).join("\n")}

🆔 c_user (FB ID): ${cUser ? cUser.value : "❌ MISSING"}
🔐 xs length: ${xs ? xs.value.length + " chars" : "❌ MISSING"}

⏰ Expired cookies: ${expired.length}
${expired.length > 0 ? expired.map(c => "  • " + (c.key || c.name)).join("\n") : ""}

${missing.length > 0 ? `\n⚠️ Missing: ${missing.join(", ")}\n💡 Cookie Editor দিয়ে fresh export নাও` : ""}
${expired.length > 0 ? "\n⚠️ Expired cookies আছে — re-login করো" : ""}
${missing.length === 0 && expired.length === 0 ? "\n✨ সব ঠিক আছে! Bot login করতে পারবে।" : ""}

╚═══════════════════╝`;
		message.reaction(status.includes("🟢") ? "✅" : "⚠️", event.messageID);
		return message.reply(msg);
	}
};