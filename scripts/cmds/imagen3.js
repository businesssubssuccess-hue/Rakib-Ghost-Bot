const axios = require('axios');
const fs = require('fs-extra'); 
const path = require('path');

const API_ENDPOINT = "https://dev.oculux.xyz/api/imagen3"; 

module.exports = {
  config: {
    name: "imagen3",
    aliases: ["img3", "generate3"],
    version: "1.1", 
    author: "NeoKEX",
    countDown: 15,
    role: 0,
    longDescription: "Generate a new image using the Imagen3 model.",
    category: "ai-image",
    guide: {
      en: "{pn} <prompt>\nExample: {pn} futuristic dragon flying in space"
    }
  },

  onStart: async function({ message, args, event }) {
    let prompt = args.join(" ");

    if (!prompt) {
      return message.reply(
        "❌ Prompt দাও!\n\nExample:\n.imagen3 futuristic dragon in space\n.imagen3 cute anime girl with blue hair"
      );
    }

    if (!/^[\x00-\x7F]*$/.test(prompt)) {
      return message.reply("❌ শুধু English prompt কাজ করবে!\nExample: .imagen3 beautiful sunset over ocean");
    }

    message.reaction("⏳", event.messageID);
    let tempFilePath;

    try {
      const fullApiUrl = `${API_ENDPOINT}?prompt=${encodeURIComponent(prompt.trim())}`;
      
      const imageDownloadResponse = await axios.get(fullApiUrl, {
        responseType: 'stream',
        timeout: 45000
      });

      if (imageDownloadResponse.status !== 200) {
        throw new Error(`API request failed with status code ${imageDownloadResponse.status}.`);
      }
      
      const cacheDir = path.join(__dirname, 'cache');
      await fs.ensureDir(cacheDir);
      
      tempFilePath = path.join(cacheDir, `imagen3_${Date.now()}.png`);
      
      const writer = fs.createWriteStream(tempFilePath);
      imageDownloadResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", (err) => { writer.close(); reject(err); });
      });

      message.reaction("✅", event.messageID);
      await message.reply({
        body: `✨ Imagen3 Generated!\n📝 Prompt: ${prompt}`,
        attachment: fs.createReadStream(tempFilePath)
      });

    } catch (error) {
      message.reaction("❌", event.messageID);

      let errorMessage = "Image generate করতে সমস্যা হয়েছে।";
      if (error.response) {
        if (error.response.status === 404) errorMessage = "API Endpoint পাওয়া যায়নি (404).";
        else errorMessage = `HTTP Error: ${error.response.status}`;
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = "Timeout হয়েছে। আবার try করো।";
      } else if (error.message) {
        errorMessage = error.message;
      }

      message.reply(`❌ ${errorMessage}`);
    } finally {
      if (tempFilePath) {
        try { await fs.unlink(tempFilePath); } catch {}
      }
    }
  }
};
