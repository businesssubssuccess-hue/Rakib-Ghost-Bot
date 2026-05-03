# 🚀 Ghost Net Bot — GitHub + Render Deploy Guide (Bangla)

এই guide এ পুরো process step-by-step:
- ১) Replit থেকে GitHub এ push
- ২) Render এ deploy
- ৩) GitHub Actions এ keep-alive setup

---

## ⚙️ ১। Replit থেকে GitHub এ পুরো project transfer

### Step 1: GitHub এ একটা নতুন repository বানাও
1. https://github.com/new — এ যাও
2. Repository name দাও (যেমন `ghost-net-bot`)
3. **Private** select করো (Facebook cookie এর জন্য safe)
4. README, .gitignore কিছুই add কোরো না — **খালি repo রাখো**
5. **Create repository** চাপো

### Step 2: Replit এর Shell এ গিয়ে নিচের commands চালাও

```bash
# Git config — তোমার নাম + email
git config --global user.name "Rakib Islam"
git config --global user.email "তোমার_email@gmail.com"

# Sensitive files (যেমন account.txt) staging থেকে remove
# (.gitignore তে যোগ করা আছে, তাও safety এর জন্য)
git rm --cached account.txt account.txt.backup 2>/dev/null || true

# নতুন remote add (origin না থাকলে)
git remote remove origin 2>/dev/null
git remote add origin https://github.com/তোমার_username/ghost-net-bot.git

# Stage + commit + push
git add .
git commit -m "Ghost Net Edition — initial deploy ready"
git branch -M main
git push -u origin main
```

> Push এর সময় GitHub username + **Personal Access Token** দিতে হবে।
> Token বানাও: GitHub ▸ Settings ▸ Developer settings ▸ Personal access tokens ▸ Generate new token (classic) ▸ `repo` scope tick দাও।

---

## 🌐 ২। Render এ deploy

### Step 1: Render এ account খোলো
1. https://render.com — এ গিয়ে GitHub দিয়ে sign up করো
2. Email verify করো

### Step 2: New Web Service বানাও
1. Dashboard ▸ **New +** ▸ **Web Service**
2. **Build and deploy from a Git repository** select করো
3. GitHub account connect করো
4. তোমার `ghost-net-bot` repo select করো

### Step 3: Settings গুলো এভাবে দাও

| Field | Value |
|-------|-------|
| **Name** | `ghost-net-bot` |
| **Region** | Oregon (or nearest) |
| **Branch** | `main` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | Free |

### Step 4: Environment Variables add করো
**Advanced** ▸ **Add Environment Variable**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `BOT_PORT` | `8080` |
| `NPM_CONFIG_PRODUCTION` | `false` |

### Step 5: Secret File হিসেবে account.txt upload
Render free plan এ direct file upload আছে:
1. Web Service ▸ **Environment** tab ▸ **Secret Files**
2. **Add Secret File**
3. **Filename** → `account.txt`
4. **File Contents** → Replit এর `account.txt` থেকে full content copy-paste
5. **Save**

### Step 6: Deploy
- **Create Web Service** চাপো
- Render automatically build + deploy করবে
- ৩-৫ মিনিট এর মধ্যে service URL পাবে: `https://ghost-net-bot.onrender.com`

---

## 🔧 "No open port found" error এর fix

আগের code সরাসরি Sakura.js চালাত — Render তখন port detect করতে পারত না।

**নতুন `server.js` wrapper এই সমস্যা solve করে:**
- প্রথমে Express server কে `0.0.0.0:$PORT` এ bind করে (Render এই port detect করে নেয়)
- তারপর Sakura.js কে background এ spawn করে
- `/`, `/health`, `/ping` endpoint দিয়ে status check করা যায়

**Start Command অবশ্যই `node server.js` দাও (npm start না)**

---

## ⏰ ৩। GitHub Actions — Keep Alive setup

Render free plan ১৫ মিনিট inactive থাকলে sleep মোডে চলে যায়। GitHub Actions প্রতি ১০ মিনিটে ping দিয়ে জাগিয়ে রাখবে।

### Step 1: GitHub repo এ secret add করো
1. Repo ▸ **Settings** ▸ **Secrets and variables** ▸ **Actions**
2. **New repository secret**
3. **Name**: `RENDER_URL`
4. **Secret**: তোমার Render URL (যেমন `https://ghost-net-bot.onrender.com`)
5. **Add secret**

### Step 2: Workflow এ activated হয়ে যাবে আপনাআপনি
- File: `.github/workflows/keep-alive.yml` (already added)
- প্রতি ১০ মিনিটে auto run করবে
- **Actions** tab এ গিয়ে status দেখা যাবে

---

## ✅ Deploy এর পরে check করো

| URL | কী দেখাবে |
|-----|----------|
| `https://your-app.onrender.com/` | JSON status — bot running কিনা |
| `https://your-app.onrender.com/health` | `OK` |
| `https://your-app.onrender.com/ping` | `pong` |
| `https://your-app.onrender.com/dashboard` | Goat-Bot dashboard |

---

## 🛠️ Troubleshooting

### "No open port found" error এখনও আসলে?
- Start Command চেক করো: `node server.js` ই আছে তো? (npm start না)
- Logs এ "Wrapper server bound to 0.0.0.0:..." message আসছে কিনা দেখো

### Bot login ব্যর্থ?
- `account.txt` (Secret File) upload করেছ কিনা confirm করো
- Cookie expire হলে নতুন cookie generate করতে হবে browser থেকে

### GitHub push reject?
- Personal Access Token সঠিক scope (`repo`) দিয়ে বানিয়েছ?
- Token expire হয়নি তো?

### Render free plan limits
- 750 hours/month free (একটা service ২৪/৭ চালাতে যথেষ্ট)
- Build minutes — month এ 500 limit
- Cold start — inactive 15min হলে sleep, GitHub Actions দিয়ে এড়ানো যায়

---

## 📋 GitHub Actions গুলোর কাজ

| Workflow | কখন চলে | কী করে |
|----------|---------|--------|
| `keep-alive.yml` | প্রতি ১০ মিনিটে | Render এ ping দেয় |
| `ci.yml` | push/PR এর সময় | সব command এর syntax check |

---

## 👑 Author

**Rakib Islam** — Ghost Net Edition
🔗 https://www.facebook.com/profile.php?id=61575436812912
