module.exports = {
  config: {
    name: "encrypt",
    aliases: ["enc", "decrypt", "dec", "cipher"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 0,
    shortDescription: { en: "Encrypt or decrypt secret messages" },
    longDescription: { en: "Encrypt your messages with a secret key. Only someone with the same key can decrypt it." },
    category: "utility",
    guide: {
      en: "{p}encrypt <key> <message>  — Encrypt\n{p}decrypt <key> <message>  — Decrypt\n\nExamples:\n{p}encrypt ghost123 আমার secret message\n{p}decrypt ghost123 <encrypted text>\n\n💡 key এবং message দুজনকেই জানতে হবে!"
    }
  },

  onStart: async function ({ message, args, event }) {
    const cmd = event.body?.trim().split(/\s+/)[0].toLowerCase().replace(".", "");
    const isDecrypt = cmd === "decrypt" || cmd === "dec";
    const key = args[0];
    const text = args.slice(1).join(" ");

    if (!key || !text) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🔐 Secret Cipher     ║\n` +
        `╚══════════════════════╝\n\n` +
        `  🔒 Encrypt:\n` +
        `     .encrypt <key> <message>\n\n` +
        `  🔓 Decrypt:\n` +
        `     .decrypt <key> <message>\n\n` +
        `📌 Examples:\n` +
        `  .encrypt ghost আমার secret কথা\n` +
        `  .decrypt ghost <encrypted text>\n\n` +
        `💡 একই key দিয়ে encrypt/decrypt হবে`
      );
    }

    try {
      let result;
      if (isDecrypt) {
        result = decryptMsg(text, key);
      } else {
        result = encryptMsg(text, key);
      }

      message.reply(
        `╔══════════════════════╗\n` +
        `║  ${isDecrypt ? "🔓 Decrypted!" : "🔒 Encrypted!"}           ║\n` +
        `╚══════════════════════╝\n\n` +
        `  ✦ Key    › ${key}\n` +
        `  ✦ Mode   › ${isDecrypt ? "Decrypt 🔓" : "Encrypt 🔒"}\n\n` +
        `  📋 Result:\n` +
        `  ${result}\n\n` +
        `  💡 ${isDecrypt ? "Original message উপরে!" : `Decrypt করতে:\n  .decrypt ${key} ${result}`}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `— Rakib Islam | Ghost Bot`
      );
    } catch (e) {
      message.reply("❌ Decrypt করা যায়নি! Key সঠিক কিনা দেখো।");
    }
  }
};

function encryptMsg(text, key) {
  const keyBytes = [...key].map(c => c.charCodeAt(0));
  const encoded = new TextEncoder().encode(text);
  const xored = encoded.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
  return Buffer.from(xored).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function decryptMsg(encoded, key) {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const buf = Buffer.from(padded, "base64");
  const keyBytes = [...key].map(c => c.charCodeAt(0));
  const xored = buf.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
  return new TextDecoder().decode(xored);
}

// Polyfill if not available
if (typeof TextEncoder === "undefined") {
  global.TextEncoder = class {
    encode(str) { return Buffer.from(str, "utf8"); }
  };
}
if (typeof TextDecoder === "undefined") {
  global.TextDecoder = class {
    decode(buf) { return Buffer.from(buf).toString("utf8"); }
  };
}
