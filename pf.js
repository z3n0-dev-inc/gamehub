// ── DEVHUB · PlayFab Client ──────────────────────────────
//
// ⚠️  SECURITY — READ BEFORE DEPLOYING PUBLICLY
// ─────────────────────────────────────────────
// PF_SECRET is a server-side admin key. Shipping it in
// client-side JS means any user can read it via DevTools
// and make Admin API calls directly (wipe leaderboards,
// read all player data, grant items, etc.).
//
// TO FIX: Create a thin backend proxy (Cloudflare Worker,
// Vercel Edge Function, or Azure Function) that:
//   1. Accepts requests from authenticated users only
//   2. Validates the session ticket server-side first
//   3. Forwards only whitelisted Admin calls using PF_SECRET
//      — the key never reaches the browser
//
// Cloudflare Worker docs:
//   https://developers.cloudflare.com/workers/
//
// This key is kept here for LOCAL / DEMO use only.
// ─────────────────────────────────────────────
const PF_TITLE  = "1BD7E7";
const PF_SECRET = "DRQFFSTB51NSS61NPZNKZCD9IS84APY6UW88G1451AQZCYHSEH";
const PF_BASE   = `https://${PF_TITLE}.playfabapi.com`;

// ── COSMETICS CATALOG ────────────────────────────────────
const COSMETICS_CATALOG = [
  { id:"fx_default",   name:"Default Click",    type:"clickfx",  price:0,      rarity:"common",   icon:"👆", desc:"The classic tap.", color:"#aaaaaa" },
  { id:"fx_neon",      name:"Neon Burst",        type:"clickfx",  price:500,    rarity:"uncommon", icon:"⚡", desc:"Electric neon burst on every click.", color:"#00f0ff" },
  { id:"fx_fire",      name:"Fire Strike",       type:"clickfx",  price:1200,   rarity:"rare",     icon:"🔥", desc:"Flames erupt from each tap.", color:"#ff6600" },
  { id:"fx_galaxy",    name:"Galaxy Tap",        type:"clickfx",  price:3000,   rarity:"epic",     icon:"🌌", desc:"Stars scatter across the screen.", color:"#9945ff" },
  { id:"fx_rainbow",   name:"Rainbow Wave",      type:"clickfx",  price:8000,   rarity:"legendary",icon:"🌈", desc:"A chromatic shockwave on every hit.", color:"#ffd700" },
  { id:"fx_glitch",    name:"Glitch Pulse",      type:"clickfx",  price:5000,   rarity:"epic",     icon:"📡", desc:"Reality glitches around your cursor.", color:"#ff3060" },
  { id:"trail_none",   name:"No Trail",          type:"trail",    price:0,      rarity:"common",   icon:"➡️", desc:"Clean, no trail.", color:"#aaaaaa" },
  { id:"trail_spark",  name:"Spark Trail",       type:"trail",    price:800,    rarity:"uncommon", icon:"✨", desc:"Sparks follow your cursor.", color:"#ffe600" },
  { id:"trail_smoke",  name:"Smoke Trail",       type:"trail",    price:1500,   rarity:"rare",     icon:"💨", desc:"Smoky wisps trail behind you.", color:"#8888aa" },
  { id:"trail_plasma", name:"Plasma Trail",      type:"trail",    price:4000,   rarity:"epic",     icon:"🔮", desc:"Plasma energy streams from your cursor.", color:"#9945ff" },
  { id:"name_default", name:"Default Name",      type:"namecolor",price:0,      rarity:"common",   icon:"🏷️", desc:"Standard white name.", color:"#e0e0f0" },
  { id:"name_cyan",    name:"Cyan Name",         type:"namecolor",price:300,    rarity:"uncommon", icon:"💠", desc:"Cyan username in chat & leaderboard.", color:"#00f0ff" },
  { id:"name_red",     name:"Red Name",          type:"namecolor",price:300,    rarity:"uncommon", icon:"❤️", desc:"Red username.", color:"#ff3060" },
  { id:"name_gold",    name:"Gold Name",         type:"namecolor",price:2000,   rarity:"rare",     icon:"👑", desc:"Glittering gold username.", color:"#ffd700" },
  { id:"name_rainbow", name:"Rainbow Name",      type:"namecolor",price:10000,  rarity:"legendary",icon:"🌟", desc:"Your name cycles through all colours.", color:"#ff00ff" },
  { id:"btn_default",  name:"Default Button",    type:"button",   price:0,      rarity:"common",   icon:"⬜", desc:"Plain white button.", color:"#e0e0f0" },
  { id:"btn_neon",     name:"Neon Button",       type:"button",   price:600,    rarity:"uncommon", icon:"🟦", desc:"Glowing neon blue button.", color:"#00f0ff" },
  { id:"btn_lava",     name:"Lava Button",       type:"button",   price:2500,   rarity:"rare",     icon:"🟥", desc:"Molten lava effect button.", color:"#ff4400" },
  { id:"btn_void",     name:"Void Button",       type:"button",   price:6000,   rarity:"epic",     icon:"🟣", desc:"Dark void with purple energy.", color:"#9945ff" },
  { id:"btn_holo",     name:"Holographic",       type:"button",   price:15000,  rarity:"legendary",icon:"💎", desc:"Holographic iridescent button.", color:"#ffd700" },
];

const RARITY_COLORS = {
  common:"#aaaaaa", uncommon:"#00ff88", rare:"#00a0ff", epic:"#9945ff", legendary:"#ffd700"
};

// ── API CALL ─────────────────────────────────────────────
async function pfCall(endpoint, body={}, useSecret=false) {
  const headers = { "Content-Type":"application/json" };
  if (useSecret) headers["X-SecretKey"] = PF_SECRET;
  else if (window._pfSession) headers["X-Authorization"] = window._pfSession;
  const res = await fetch(`${PF_BASE}${endpoint}`, {
    method:"POST", headers, body: JSON.stringify(body)
  });
  const data = await res.json();
  if (data.code !== 200) throw new Error(data.errorMessage || `PF error ${data.code}`);
  return data.data;
}

// Run multiple pfCall promises in parallel.
async function pfBatch(promises) { return Promise.all(promises); }

// ── AUTH ─────────────────────────────────────────────────
async function pfRegister(username, email, password) {
  const data = await pfCall("/Client/RegisterPlayFabUser", {
    TitleId: PF_TITLE, Username: username,
    Email: email, Password: password,
    RequireBothUsernameAndEmail: true
  });
  window._pfSession = data.SessionTicket;
  window._pfPlayer = { id: data.PlayFabId, username, email };
  saveSession();
  await pfCall("/Client/UpdateUserTitleDisplayName", { DisplayName: username });
  await initPlayerData();
  return data;
}

async function pfLogin(email, password) {
  // Fetch everything we need in one round-trip so session restore
  // doesn't need a separate ping call on page load.
  const data = await pfCall("/Client/LoginWithEmailAddress", {
    TitleId: PF_TITLE, Email: email, Password: password,
    InfoRequestParameters: {
      GetUserAccountInfo: true,
      GetUserData: true,
      GetPlayerStatistics: true,
      UserDataKeys: ["coins", "owned_cosmetics", "equipped"]
    }
  });
  window._pfSession = data.SessionTicket;
  const info = data.CombinedInfo?.AccountInfo;
  window._pfPlayer = {
    id: data.PlayFabId,
    username: info?.TitleInfo?.DisplayName || info?.Username || "Player",
    email,
    _cachedData: data.CombinedInfo?.UserData || null // available immediately, no extra call
  };
  saveSession();
  return data;
}

async function pfGetPlayerData(keys=[]) {
  return pfCall("/Client/GetUserData", keys.length ? { Keys: keys } : {});
}

async function pfSetPlayerData(data) {
  return pfCall("/Client/UpdateUserData", { Data: data });
}

async function pfGetStats() {
  return pfCall("/Client/GetPlayerStatistics", {});
}

async function pfUpdateStat(name, value) {
  return pfCall("/Client/UpdatePlayerStatistics", {
    Statistics: [{ StatisticName: name, Value: Math.floor(value) }]
  });
}

async function pfGetLeaderboard(statName, maxResults=50) {
  return pfCall("/Client/GetLeaderboard", {
    StatisticName: statName, StartPosition: 0, MaxResultsCount: maxResults
  });
}

async function pfGetLeaderboardAround(statName, maxResults=5) {
  return pfCall("/Client/GetLeaderboardAroundPlayer", {
    StatisticName: statName, MaxResultsCount: maxResults
  });
}

// ── TITLE DATA ────────────────────────────────────────────
async function pfGetTitleData(keys=[]) {
  return pfCall("/Client/GetTitleData", keys.length ? { Keys: keys } : {});
}

async function pfSetTitleData(key, value) {
  return pfCall("/Admin/SetTitleData", { Key: key, Value: JSON.stringify(value) }, true);
}

// ── VIRTUAL CURRENCY ──────────────────────────────────────
async function pfGetInventory() {
  return pfCall("/Client/GetUserInventory", {});
}

// ── SHOP PURCHASE — SERVER-AUTHORITATIVE ─────────────────
// Always re-fetches coin balance from PlayFab before deducting.
// This means a user cannot cheat by editing local JS variables
// and calling handleCosmClick — the server balance is the truth.
// (True server-side enforcement requires Cloud Script / Azure
// Function, but this is meaningfully better than pure client trust.)
async function pfPurchaseCosmetic(itemId) {
  const item = COSMETICS_CATALOG.find(c => c.id === itemId);
  if (!item) throw new Error("Unknown item");

  // Re-fetch authoritative balance — never trust local playerCoins
  const fresh = await pfGetPlayerData(["coins", "owned_cosmetics"]);
  const serverCoins = parseInt(fresh.Data?.coins?.Value || "0");
  const serverOwned = JSON.parse(fresh.Data?.owned_cosmetics?.Value || "[]");

  if (serverOwned.includes(itemId)) throw new Error("Already owned");
  if (serverCoins < item.price)     throw new Error("Not enough coins");

  const newCoins = serverCoins - item.price;
  const newOwned = [...serverOwned, itemId];

  // Single write for atomicity
  await pfSetPlayerData({
    coins: String(newCoins),
    owned_cosmetics: JSON.stringify(newOwned),
  });
  await pfUpdateStat("TotalCoins", newCoins);

  return { newCoins, newOwned };
}

// ── STAFF CHECK ───────────────────────────────────────────
async function isStaff() {
  if (!window._pfPlayer?.id) return false;
  try {
    const d = await pfCall("/Admin/GetUserData", {
      PlayFabId: window._pfPlayer.id, Keys: ["is_staff"]
    }, true);
    if (d?.Data?.is_staff?.Value === "true") return true;
  } catch {}
  try {
    const d = await pfGetPlayerData(["is_staff"]);
    if (d?.Data?.is_staff?.Value === "true") return true;
  } catch {}
  return false;
}

// ── SESSION PERSISTENCE ───────────────────────────────────
function saveSession() {
  if (!window._pfSession) return;
  localStorage.setItem("devhub_session", window._pfSession);
  localStorage.setItem("devhub_player", JSON.stringify(window._pfPlayer));
}

function loadSession() {
  const s = localStorage.getItem("devhub_session");
  const p = localStorage.getItem("devhub_player");
  if (s && p) {
    try { window._pfSession = s; window._pfPlayer = JSON.parse(p); return true; }
    catch { return false; }
  }
  return false;
}

function clearSession() {
  window._pfSession = null;
  window._pfPlayer = null;
  localStorage.removeItem("devhub_session");
  localStorage.removeItem("devhub_player");
}

// ── INIT PLAYER DATA ─────────────────────────────────────
async function initPlayerData() {
  const defaults = {
    coins: "0", clicks: "0", upgrades: "{}",
    equipped: JSON.stringify({ clickfx:"fx_default", trail:"trail_none", namecolor:"name_default", button:"btn_default" }),
    owned_cosmetics: JSON.stringify(["fx_default","trail_none","name_default","btn_default"]),
  };
  await pfSetPlayerData(defaults);
  await pfUpdateStat("TotalClicks", 0);
  await pfUpdateStat("TotalCoins", 0);
}
