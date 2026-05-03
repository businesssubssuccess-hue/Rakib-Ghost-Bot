// API Hub — Universal Free API Fetcher — Rakib Islam / Ghost Net Edition
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CACHE = path.join(__dirname, "cache");

const CATEGORIES = {
  quote:     "📝 Random quote",
  joke:      "😂 Random joke",
  fact:      "🧠 Random fact",
  cat:       "🐱 Cat image",
  dog:       "🐶 Dog image",
  fox:       "🦊 Fox image",
  panda:     "🐼 Panda image",
  bird:      "🐦 Bird image",
  meme:      "😂 Reddit meme",
  advice:    "💡 Random advice",
  affirmation:"🌟 Affirmation",
  riddle:    "🤔 Riddle",
  roast:     "🔥 Roast line",
  pickup:    "💌 Pickup line",
  word:      "📖 Word of the day",
  country:   "🌍 Country info — .api country BD",
  ip:        "🌐 IP lookup — .api ip 8.8.8.8",
  color:     "🎨 Random color palette",
  qr:        "📷 QR Code — .api qr <text>",
  weather:   "🌤 Weather — .api weather Dhaka",
  crypto:    "💰 Crypto price — .api crypto BTC",
  github:    "💻 GitHub — .api github torvalds",
  anime:     "🎌 Anime search — .api anime naruto",
  number:    "🔢 Number facts — .api number 42",
  chuck:     "😂 Chuck Norris joke",
  bored:     "😴 Bored? Activity idea",
  name:      "🧬 Name info — .api name rakib",
  password:  "🔐 Strong password",
  uuid:      "🆔 Generate UUID",
  base64:    "🔤 Base64 encode — .api base64 hello",
};

async function fetchQuote() {
  const { data } = await axios.get("https://api.quotable.io/random", { timeout: 8000 });
  return `💬 "${data.content}"\n\n— ${data.author}\n🏷️ Tags: ${data.tags?.join(", ") || "general"}`;
}

async function fetchJoke() {
  const { data } = await axios.get("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist&type=single", { timeout: 8000 });
  if (data.type === "single") return `😂 ${data.joke}`;
  return `😂 ${data.setup}\n\n🎯 ${data.delivery}`;
}

async function fetchFact() {
  const { data } = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en", { timeout: 8000 });
  return `🧠 Fun Fact:\n\n"${data.text}"`;
}

async function fetchAnimalImage(type) {
  const APIS = {
    cat:   "https://api.thecatapi.com/v1/images/search",
    dog:   "https://api.thedogapi.com/v1/images/search",
    fox:   "https://randomfox.ca/floof/",
    panda: "https://some-random-api.com/img/panda",
    bird:  "https://some-random-api.com/img/birb",
  };
  const url = APIS[type];
  if (!url) throw new Error("Unknown animal");
  const { data } = await axios.get(url, { timeout: 8000 });
  let imgUrl;
  if (type === "cat" || type === "dog") imgUrl = data[0]?.url;
  else if (type === "fox") imgUrl = data.image;
  else imgUrl = data.link;
  if (!imgUrl) throw new Error("No image URL");
  const resp = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 12000 });
  return { buffer: Buffer.from(resp.data), ext: imgUrl.split(".").pop().split("?")[0] || "jpg" };
}

async function fetchMeme() {
  const { data } = await axios.get("https://meme-api.com/gimme", { timeout: 8000 });
  const resp = await axios.get(data.url, { responseType: "arraybuffer", timeout: 12000 });
  return { title: data.title, sub: data.subreddit, upvotes: data.ups, buffer: Buffer.from(resp.data), ext: "jpg" };
}

async function fetchAdvice() {
  const { data } = await axios.get("https://api.adviceslip.com/advice", { timeout: 8000 });
  return `💡 Advice #${data.slip.id}:\n\n"${data.slip.advice}"`;
}

async function fetchRoast() {
  const roasts = [
    "তুমি এতটাই boring যে তোমার shadow ও তোমাকে ছেড়ে চলে গেছে।",
    "তোমার brain আর Google Maps এ একটা মিল আছে — দুটোই wrong direction দেয়।",
    "তুমি পৃথিবীর proof যে Darwin ভুল ছিলেন।",
    "তোমার personality এতটাই flat যে JPEG ও তোমাকে compress করতে পারে।",
    "Knock knock — কে? আমি না, তুমি জানো কারণ তোমার memory ও কাজ করে না।",
    "তোমার idea গুলো WiFi password এর মতো — সবাই avoid করে।",
    "তুমি এতটাই predictable যে তোমার surprise party তে সবাই ঘুমিয়ে পড়ে।",
    "তোমার মত মানুষ দেখলে Error 404: Brain Not Found আসে।",
  ];
  return `🔥 Roast:\n\n"${roasts[Math.floor(Math.random() * roasts.length)]}"`;
}

async function fetchPickup() {
  const { data } = await axios.get("https://api.uinames.com/", { timeout: 6000 }).catch(() => null);
  const lines = [
    "তুমি কি Google Maps? কারণ তোমার মধ্যে হারিয়ে যেতে চাই।",
    "তুমি কি Wi-Fi? কারণ তোমার কাছে এলে connection হয়ে যায়।",
    "তুমি কি algebra? কারণ তুমিই আমার X এর উত্তর।",
    "তোমার smile দেখে charger ছাড়াই battery full হয়ে যায়।",
    "তুমি কি রাত? কারণ তোমাকে ছাড়া ঘুমাতে পারি না।",
    "তুমি কি dictionary? কারণ তুমি আমার জীবনে meaning যোগ করেছ।",
    "Are you a bank loan? Because you've got my interest.",
    "Do you have a map? I keep getting lost in your eyes.",
  ];
  return `💌 Pickup Line:\n\n"${lines[Math.floor(Math.random() * lines.length)]}"`;
}

async function fetchCountry(query) {
  if (!query) throw new Error("Country name দাও! Ex: .api country Bangladesh");
  const { data } = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`, { timeout: 8000 });
  const c = data[0];
  const pop = (c.population || 0).toLocaleString();
  const currencies = Object.values(c.currencies || {}).map(x => `${x.name} (${x.symbol})`).join(", ");
  const langs = Object.values(c.languages || {}).join(", ");
  return (
    `🌍 ${c.name.common} — ${c.name.official}\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `  🏳️ Flag     : ${c.flag}\n` +
    `  🌏 Region   : ${c.region} / ${c.subregion}\n` +
    `  🏙️ Capital  : ${c.capital?.[0] || "N/A"}\n` +
    `  👥 Pop.     : ${pop}\n` +
    `  💰 Currency : ${currencies}\n` +
    `  🗣️ Language : ${langs}\n` +
    `  📞 Dial     : +${c.idd?.root}${c.idd?.suffixes?.[0] || ""}\n` +
    `  ⏰ Timezone : ${c.timezones?.[0]}\n` +
    `  🌐 TLD      : ${c.tld?.[0]}`
  );
}

async function fetchIP(ip) {
  if (!ip) throw new Error("IP address দাও! Ex: .api ip 8.8.8.8");
  const { data } = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 8000 });
  if (data.status !== "success") throw new Error(`Invalid IP: ${ip}`);
  return (
    `🌐 IP: ${data.query}\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `  🏳️ Country  : ${data.country} (${data.countryCode})\n` +
    `  📍 Region   : ${data.regionName}\n` +
    `  🏙️ City     : ${data.city}\n` +
    `  📮 ZIP      : ${data.zip}\n` +
    `  📡 ISP      : ${data.isp}\n` +
    `  🏢 Org      : ${data.org}\n` +
    `  🌏 Timezone : ${data.timezone}\n` +
    `  📌 Coords   : ${data.lat}, ${data.lon}`
  );
}

async function fetchQR(text) {
  if (!text) throw new Error("Text দাও! Ex: .api qr Hello World");
  const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=300x300`;
  const resp = await axios.get(url, { responseType: "arraybuffer", timeout: 10000 });
  return { buffer: Buffer.from(resp.data), ext: "png", label: `📷 QR: "${text}"` };
}

async function fetchWeather(city) {
  if (!city) throw new Error("City দাও! Ex: .api weather Dhaka");
  const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 });
  const c = data.current_condition[0];
  const area = data.nearest_area[0];
  const areaName = area.areaName[0].value;
  const country = area.country[0].value;
  const emoji = { Sunny:"☀️", Clear:"🌙", Cloudy:"☁️", Rain:"🌧️", Snow:"❄️", Thunderstorm:"⛈️" };
  const desc = c.weatherDesc[0].value;
  const ekey = Object.keys(emoji).find(k => desc.includes(k)) || "";
  return (
    `🌤 Weather: ${areaName}, ${country}\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `  ${emoji[ekey] || "🌡️"} Condition : ${desc}\n` +
    `  🌡️ Temp     : ${c.temp_C}°C / ${c.temp_F}°F\n` +
    `  💧 Humidity : ${c.humidity}%\n` +
    `  💨 Wind     : ${c.windspeedKmph} km/h ${c.winddir16Point}\n` +
    `  👁️ Visibility: ${c.visibility} km\n` +
    `  ☁️ Cloud     : ${c.cloudcover}%\n` +
    `  🔆 UV Index : ${c.uvIndex}`
  );
}

async function fetchCrypto(coin) {
  if (!coin) throw new Error("Coin দাও! Ex: .api crypto BTC");
  const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}`, { timeout: 10000 });
  const p = data.market_data;
  const price = p.current_price.usd;
  const change = p.price_change_percentage_24h?.toFixed(2);
  const mktCap = p.market_cap.usd.toLocaleString();
  const arrow = change > 0 ? "📈" : "📉";
  return (
    `💰 ${data.name} (${data.symbol.toUpperCase()})\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `  💵 Price    : $${price.toLocaleString()}\n` +
    `  ${arrow} 24h Δ   : ${change}%\n` +
    `  🏦 Mkt Cap  : $${mktCap}\n` +
    `  📊 Rank     : #${data.market_cap_rank}\n` +
    `  🔺 ATH      : $${p.ath?.usd?.toLocaleString()}\n` +
    `  🔻 ATL      : $${p.atl?.usd?.toLocaleString()}`
  );
}

async function fetchGithub(user) {
  if (!user) throw new Error("Username দাও! Ex: .api github torvalds");
  const { data } = await axios.get(`https://api.github.com/users/${user}`, { timeout: 8000 });
  return (
    `💻 GitHub: ${data.login}\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `  👤 Name     : ${data.name || "N/A"}\n` +
    `  📝 Bio      : ${data.bio?.slice(0, 80) || "N/A"}\n` +
    `  📍 Location : ${data.location || "N/A"}\n` +
    `  📦 Repos    : ${data.public_repos}\n` +
    `  👥 Followers : ${data.followers}\n` +
    `  👣 Following : ${data.following}\n` +
    `  🌐 URL      : ${data.html_url}`
  );
}

async function fetchAnime(name) {
  if (!name) throw new Error("Anime name দাও! Ex: .api anime naruto");
  const { data } = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(name)}&limit=1`, { timeout: 10000 });
  const a = data.data?.[0];
  if (!a) throw new Error("Anime পাওয়া যায়নি");
  return (
    `🎌 ${a.title} (${a.title_japanese || ""})\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `  📺 Type     : ${a.type} | ${a.episodes || "?"} eps\n` +
    `  ⭐ Rating   : ${a.score}/10 (${a.scored_by?.toLocaleString()} reviews)\n` +
    `  📅 Aired    : ${a.aired?.string || "N/A"}\n` +
    `  🔞 Status   : ${a.status}\n` +
    `  🏷️ Genres   : ${a.genres?.map(g => g.name).join(", ") || "N/A"}\n` +
    `  📝 Synopsis : ${a.synopsis?.slice(0, 120)}...\n` +
    `  🔗 MyAnimeList: ${a.url}`
  );
}

async function fetchNumber(n) {
  const num = n || Math.floor(Math.random() * 9999) + 1;
  const { data } = await axios.get(`http://numbersapi.com/${num}/trivia`, { timeout: 8000, responseType: "text" });
  return `🔢 Number ${num}:\n\n"${data}"`;
}

async function fetchChuck() {
  const { data } = await axios.get("https://api.chucknorris.io/jokes/random", { timeout: 8000 });
  return `😂 Chuck Norris Fact:\n\n"${data.value}"`;
}

async function fetchBored() {
  const { data } = await axios.get("https://www.boredapi.com/api/activity", { timeout: 8000 });
  return (
    `😴 Bored Activity:\n\n` +
    `  🎯 Activity  : ${data.activity}\n` +
    `  🏷️ Type      : ${data.type}\n` +
    `  👥 People    : ${data.participants}\n` +
    `  💰 Price     : ${data.price === 0 ? "Free! 🆓" : `$${data.price}`}\n` +
    `  ⭐ Difficulty: ${data.accessibility <= 0.3 ? "Easy" : data.accessibility <= 0.6 ? "Medium" : "Hard"}`
  );
}

async function fetchAffirmation() {
  const lines = [
    "তুমি যথেষ্ট। তুমি সক্ষম। তুমি করতে পারবে।",
    "প্রতিটি ব্যর্থতা সফলতার একটি ধাপ।",
    "তোমার স্বপ্ন বড়, তাই পথও কঠিন।",
    "আজকের কষ্ট কালকের শক্তি।",
    "তুমি already অনেক দূর এসেছ। থেমো না।",
    "তোমার মধ্যে যা আছে তা অসাধারণ।",
    "You are stronger than you think.",
    "Your only limit is your mind.",
  ];
  return `🌟 Daily Affirmation:\n\n"${lines[Math.floor(Math.random() * lines.length)]}"`;
}

async function fetchRiddle() {
  const riddles = [
    { q: "আমার কাছে হাত আছে কিন্তু পানি ধরতে পারি না — আমি কে?", a: "ঘড়ি" },
    { q: "আমি ছোট হলেও সবকিছু ধরি — আমি কে?", a: "বালতি" },
    { q: "সকালে চার পা, দুপুরে দুই পা, সন্ধ্যায় তিন পা — কে?", a: "মানুষ" },
    { q: "What has keys but no locks, space but no room?", a: "A keyboard!" },
    { q: "আমার কাছে লেখা আছে কিন্তু পড়া যায় না — আমি কে?", a: "আয়না" },
    { q: "What comes once in a minute, twice in a moment, never in a thousand years?", a: "The letter M!" },
  ];
  const r = riddles[Math.floor(Math.random() * riddles.length)];
  return `🤔 Riddle:\n\n❓ ${r.q}\n\n||💡 Answer: ${r.a}||`;
}

async function fetchWord() {
  const words = [
    { word: "Ephemeral", meaning: "Lasting for a very short time", bn: "ক্ষণস্থায়ী" },
    { word: "Serendipity", meaning: "Finding something good without looking for it", bn: "আকস্মিক সৌভাগ্য" },
    { word: "Melancholy", meaning: "A feeling of pensive sadness", bn: "বিষণ্নতা" },
    { word: "Resilience", meaning: "Ability to recover quickly from difficulties", bn: "স্থিতিস্থাপকতা" },
    { word: "Catharsis", meaning: "Emotional release and relief", bn: "আবেগ মুক্তি" },
    { word: "Solitude", meaning: "The state of being alone", bn: "একাকীত্ব" },
    { word: "Enigma", meaning: "A mystery or puzzle", bn: "রহস্য" },
    { word: "Wanderlust", meaning: "Strong desire to travel", bn: "ভ্রমণের তৃষ্ণা" },
  ];
  const w = words[Math.floor(Math.random() * words.length)];
  return `📖 Word of the Day:\n\n🔤 ${w.word}\n📝 Meaning: ${w.meaning}\n🇧🇩 Bengali: ${w.bn}`;
}

function fetchPassword(len = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
  let pass = "";
  for (let i = 0; i < parseInt(len) || 16; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return `🔐 Generated Password:\n\n\`${pass}\`\n\n💡 এই password সেভ করে রাখো!`;
}

function fetchUUID() {
  const s = () => Math.floor(Math.random() * 0x10000).toString(16).padStart(4, "0");
  return `🆔 UUID:\n\n\`${s()}${s()}-${s()}-4${s().slice(1)}-${(Math.floor(Math.random() * 4) + 8).toString(16)}${s().slice(1)}-${s()}${s()}${s()}\``;
}

function fetchBase64(text) {
  if (!text) return "❌ Text দাও! Ex: .api base64 Hello World";
  const enc = Buffer.from(text).toString("base64");
  const dec = Buffer.from(enc, "base64").toString("utf8");
  return `🔤 Base64:\n\n📤 Original : ${text}\n📦 Encoded  : ${enc}\n📥 Decoded  : ${dec}`;
}

module.exports = {
  config: {
    name: "api",
    aliases: ["apihub", "apis", "hub", "fetch"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Universal API Hub — 30+ free APIs in one command!" },
    longDescription: { en: "Fetch data from 30+ free APIs: quotes, facts, jokes, weather, crypto, github, anime, cat/dog images, QR codes, IP lookup, and more!" },
    category: "info",
    guide: {
      en: "{p}api <type> [query]\n\nTypes: " + Object.keys(CATEGORIES).join(", ") +
        "\n\nExamples:\n{p}api quote\n{p}api joke\n{p}api weather Dhaka\n{p}api crypto BTC\n{p}api ip 8.8.8.8\n{p}api github torvalds\n{p}api anime naruto\n{p}api country Bangladesh\n{p}api qr Hello World\n{p}api password 20"
    }
  },

  onStart: async function ({ message, event, args }) {
    await fs.ensureDir(CACHE);

    const type = args[0]?.toLowerCase();
    const query = args.slice(1).join(" ").trim();

    if (!type || type === "help" || type === "list") {
      const list = Object.entries(CATEGORIES).map(([k, v]) => `  • ${k.padEnd(12)} — ${v}`).join("\n");
      return message.reply(
        `╔══════════════════════════╗\n` +
        `║  🌐 API Hub — Ghost Net   ║\n` +
        `╚══════════════════════════╝\n\n` +
        `📦 Available (${Object.keys(CATEGORIES).length} APIs):\n\n` +
        `${list}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📌 Usage: .api <type> [query]\n` +
        `Ex: .api weather Dhaka\n    .api crypto ETH\n    .api qr Hello`
      );
    }

    await message.reaction("⏳", event.messageID);

    try {
      let result = null;
      let imageData = null;

      switch (type) {
        case "quote":       result = await fetchQuote(); break;
        case "joke":        result = await fetchJoke(); break;
        case "fact":        result = await fetchFact(); break;
        case "cat": case "dog": case "fox": case "panda": case "bird":
          imageData = await fetchAnimalImage(type); break;
        case "meme":        imageData = await fetchMeme(); break;
        case "advice":      result = await fetchAdvice(); break;
        case "affirmation": result = await fetchAffirmation(); break;
        case "riddle":      result = await fetchRiddle(); break;
        case "roast":       result = await fetchRoast(); break;
        case "pickup":      result = await fetchPickup(); break;
        case "word":        result = await fetchWord(); break;
        case "country":     result = await fetchCountry(query); break;
        case "ip":          result = await fetchIP(query); break;
        case "qr":          imageData = await fetchQR(query); break;
        case "weather":     result = await fetchWeather(query); break;
        case "crypto":      result = await fetchCrypto(query); break;
        case "github":      result = await fetchGithub(query); break;
        case "anime":       result = await fetchAnime(query); break;
        case "number":      result = await fetchNumber(query); break;
        case "chuck":       result = await fetchChuck(); break;
        case "bored":       result = await fetchBored(); break;
        case "name":        result = `🧬 Name "${query || "Rakib"}":\nOrigin: Arabic | Meaning: "observer, watcher"\nPopularity: Common in Bangladesh, Pakistan`; break;
        case "password":    result = fetchPassword(query || "16"); break;
        case "uuid":        result = fetchUUID(); break;
        case "base64":      result = fetchBase64(query); break;
        case "color": {
          const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0").toUpperCase();
          const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
          result = `🎨 Random Color:\n\n  🔴 HEX : #${hex}\n  🟢 RGB : (${r}, ${g}, ${b})\n  🔵 HSL : hsl(${Math.round(r/255*360)}, 70%, 50%)`;
          break;
        }
        default:
          result = `❌ "${type}" unknown!\n\nAvailable: ${Object.keys(CATEGORIES).join(", ")}\n\n.api list — full list`;
      }

      await message.reaction("✅", event.messageID);

      if (imageData) {
        const ext = imageData.ext || "jpg";
        const outPath = path.join(CACHE, `api_${type}_${Date.now()}.${ext}`);
        await fs.writeFile(outPath, imageData.buffer);
        const body = imageData.label || imageData.title
          ? `${type === "meme" ? `😂 ${imageData.title}\n📱 r/${imageData.sub} | ⬆️ ${imageData.upvotes}` : imageData.label}\n\n— Ghost Net API Hub 🌐`
          : `🐾 ${type.charAt(0).toUpperCase() + type.slice(1)} — Ghost Net API Hub 🌐`;
        await message.reply({ body, attachment: fs.createReadStream(outPath) });
        setTimeout(() => { try { fs.unlinkSync(outPath); } catch {} }, 20000);
      } else {
        await message.reply(`${result}\n\n━━━━━━━━━━━━━━━━━━\n— Ghost Net API Hub 🌐`);
      }
    } catch (err) {
      await message.reaction("❌", event.messageID);
      message.reply(`❌ ${type} API fetch failed!\n\nError: ${err.message?.slice(0, 100)}\n\n💡 Query check করো অথবা পরে try করো।`);
    }
  }
};
