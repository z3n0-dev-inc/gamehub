// ── DEVHUB · PlayFab Shared Client · v9 ──────────────────
//
// ⚠️  SECURITY — READ BEFORE DEPLOYING PUBLICLY
// PF_SECRET is a server-side admin key. It is exposed here
// for LOCAL / DEMO use only. Before going public, proxy all
// /Admin/* calls through a Cloudflare Worker or similar.
// The key never belongs in browser-side JS in production.
//
const PF_TITLE  = "1BD7E7";
const PF_SECRET = "DRQFFSTB51NSS61NPZNKZCD9IS84APY6UW88G1451AQZCYHSEH";
const PF_BASE   = `https://${PF_TITLE}.playfabapi.com`;

// ── COSMETICS CATALOG (sourced from devhub_catalog.json) ──
const COSMETICS_CATALOG = [
  // ── Click FX ──
  { id:"fx_default",    name:"Default Click",    type:"clickfx",  price:0,      rarity:"common",    icon:"👆", desc:"The classic tap.",                               color:"#aaaaaa" },
  { id:"fx_neon",       name:"Neon Burst",        type:"clickfx",  price:500,    rarity:"uncommon",  icon:"⚡", desc:"Electric neon burst on every click.",            color:"#00f0ff" },
  { id:"fx_fire",       name:"Fire Strike",       type:"clickfx",  price:1200,   rarity:"rare",      icon:"🔥", desc:"Flames erupt from each tap.",                    color:"#ff6600" },
  { id:"fx_lightning",  name:"Lightning Strike",  type:"clickfx",  price:2500,   rarity:"rare",      icon:"🌩️", desc:"A bolt of lightning crackles on click.",          color:"#ffe600" },
  { id:"fx_galaxy",     name:"Galaxy Tap",        type:"clickfx",  price:3000,   rarity:"epic",      icon:"🌌", desc:"Stars scatter across the screen.",               color:"#9945ff" },
  { id:"fx_matrix",     name:"Matrix Rain",       type:"clickfx",  price:4000,   rarity:"epic",      icon:"💻", desc:"Green code rains down on every click.",          color:"#00ff41" },
  { id:"fx_glitch",     name:"Glitch Pulse",      type:"clickfx",  price:5000,   rarity:"epic",      icon:"📡", desc:"Reality glitches around your cursor.",           color:"#ff3060" },
  { id:"fx_rainbow",    name:"Rainbow Wave",      type:"clickfx",  price:8000,   rarity:"legendary", icon:"🌈", desc:"A chromatic shockwave on every hit.",            color:"#ffd700" },

  // ── Cursor Trail ──
  { id:"trail_none",    name:"No Trail",          type:"trail",    price:0,      rarity:"common",    icon:"➡️", desc:"Clean. No trail.",                               color:"#aaaaaa" },
  { id:"trail_spark",   name:"Spark Trail",       type:"trail",    price:800,    rarity:"uncommon",  icon:"✨", desc:"Sparks follow your cursor.",                     color:"#ffe600" },
  { id:"trail_smoke",   name:"Smoke Trail",       type:"trail",    price:1500,   rarity:"rare",      icon:"💨", desc:"Smoky wisps trail behind you.",                  color:"#8888aa" },
  { id:"trail_plasma",  name:"Plasma Trail",      type:"trail",    price:4000,   rarity:"epic",      icon:"🔮", desc:"Plasma energy streams from your cursor.",        color:"#9945ff" },
  { id:"trail_comet",   name:"Comet Trail",       type:"trail",    price:6000,   rarity:"legendary", icon:"☄️", desc:"A blazing comet tail follows your every move.",  color:"#ffd700" },
  { id:"trail_rainbow", name:"Rainbow Trail",     type:"trail",    price:10000,  rarity:"legendary", icon:"🌈", desc:"Every colour of the spectrum trails behind you.", color:"#ff00ff" },

  // ── Name Color ──
  { id:"name_default",  name:"Default Name",      type:"namecolor",price:0,      rarity:"common",    icon:"🏷️", desc:"Standard white username.",                        color:"#e0e0f0" },
  { id:"name_cyan",     name:"Cyan Name",         type:"namecolor",price:300,    rarity:"uncommon",  icon:"💠", desc:"Cyan username on leaderboard.",                  color:"#00f0ff" },
  { id:"name_red",      name:"Red Name",          type:"namecolor",price:300,    rarity:"uncommon",  icon:"❤️", desc:"Bold red username.",                             color:"#ff3060" },
  { id:"name_green",    name:"Green Name",        type:"namecolor",price:300,    rarity:"uncommon",  icon:"💚", desc:"Lush green username.",                           color:"#00ff88" },
  { id:"name_purple",   name:"Purple Name",       type:"namecolor",price:600,    rarity:"rare",      icon:"💜", desc:"Royal purple username.",                         color:"#9945ff" },
  { id:"name_gold",     name:"Gold Name",         type:"namecolor",price:2000,   rarity:"epic",      icon:"👑", desc:"Glittering gold username.",                      color:"#ffd700" },
  { id:"name_rainbow",  name:"Rainbow Name",      type:"namecolor",price:10000,  rarity:"legendary", icon:"🌟", desc:"Your name cycles through all colours.",          color:"#ff00ff" },

  // ── Button Skin ──
  { id:"btn_default",   name:"Default Button",    type:"button",   price:0,      rarity:"common",    icon:"⬜", desc:"Plain white clicker button.",                    color:"#e0e0f0" },
  { id:"btn_neon",      name:"Neon Button",       type:"button",   price:600,    rarity:"uncommon",  icon:"🟦", desc:"Glowing neon blue button.",                     color:"#00f0ff" },
  { id:"btn_lava",      name:"Lava Button",       type:"button",   price:2500,   rarity:"rare",      icon:"🟥", desc:"Molten lava erupts on every click.",             color:"#ff4400" },
  { id:"btn_void",      name:"Void Button",       type:"button",   price:6000,   rarity:"epic",      icon:"🟣", desc:"Dark void with swirling purple energy.",         color:"#9945ff" },
  { id:"btn_matrix",    name:"Matrix Button",     type:"button",   price:8000,   rarity:"epic",      icon:"🟩", desc:"Green code rains across the button face.",       color:"#00ff41" },
  { id:"btn_holo",      name:"Holographic",       type:"button",   price:15000,  rarity:"legendary", icon:"💎", desc:"Holographic iridescent button.",                 color:"#ffd700" },

  // ── Puck Skin ──
  { id:"puck_default",  name:"Default Puck",      type:"puck",     price:0,      rarity:"common",    icon:"🏒", desc:"Classic white puck.",                            color:"#ffffff" },
  { id:"puck_fire",     name:"Fire Puck",         type:"puck",     price:3000,   rarity:"rare",      icon:"🔥", desc:"A blazing puck that leaves fire trails.",        color:"#ff6600" },
  { id:"puck_ice",      name:"Ice Puck",          type:"puck",     price:3000,   rarity:"rare",      icon:"🧊", desc:"Frosty blue puck with crystal shards.",          color:"#00f0ff" },
  { id:"puck_void",     name:"Void Puck",         type:"puck",     price:9000,   rarity:"epic",      icon:"🕳️", desc:"A black hole in puck form.",                     color:"#9945ff" },
  { id:"puck_gold",     name:"Gold Puck",         type:"puck",     price:12000,  rarity:"legendary", icon:"✨", desc:"Solid gold. Heavy but worth it.",                color:"#ffd700" },

  // ── Paddle Skin ──
  { id:"paddle_default",name:"Default Paddle",    type:"paddle",   price:0,      rarity:"common",    icon:"🏓", desc:"Standard paddle.",                               color:"#ffffff" },
  { id:"paddle_neon",   name:"Neon Paddle",       type:"paddle",   price:2000,   rarity:"rare",      icon:"💡", desc:"Blinding neon glow.",                            color:"#00f0ff" },
  { id:"paddle_lava",   name:"Lava Paddle",       type:"paddle",   price:4000,   rarity:"epic",      icon:"🌋", desc:"Scorching hot paddle.",                          color:"#ff4400" },
  { id:"paddle_gold",   name:"Gold Paddle",       type:"paddle",   price:5000,   rarity:"epic",      icon:"🏆", desc:"Golden paddle. Intimidate your opponent.",       color:"#ffd700" },
  { id:"paddle_holo",   name:"Holo Paddle",       type:"paddle",   price:18000,  rarity:"legendary", icon:"🌀", desc:"Holographic paddle that shifts colours.",        color:"#ff00ff" },

  // ── Badges (staff-grant or milestone-earned — not purchasable) ──
  { id:"badge_og",      name:"OG Badge",          type:"badge",    price:null,   rarity:"legendary", icon:"🏅", desc:"One of the first players ever. Staff-granted.",  color:"#ffd700", staffGrant:true },
  { id:"badge_whale",   name:"Whale Badge",       type:"badge",    price:null,   rarity:"epic",      icon:"🐳", desc:"Spent 50,000+ coins in the shop.",               color:"#00f0ff" },
  { id:"badge_clickgod",name:"Click God",         type:"badge",    price:null,   rarity:"epic",      icon:"🖱️", desc:"Achieved 100,000 total clicks.",                 color:"#ff3060" },
  { id:"badge_staff",   name:"Staff Badge",       type:"badge",    price:null,   rarity:"legendary", icon:"⚡", desc:"Official DEVHUB staff member.",                  color:"#ffd700", staffOnly:true },
];

const RARITY_COLORS = {
  common:"#aaaaaa", uncommon:"#00ff88", rare:"#00a0ff", epic:"#9945ff", legendary:"#ffd700"
};

const DEFAULT_EQUIPPED = {
  clickfx:"fx_default", trail:"trail_none", namecolor:"name_default",
  button:"btn_default",  puck:"puck_default", paddle:"paddle_default"
};
const DEFAULT_OWNED = ["fx_default","trail_none","name_default","btn_default","puck_default","paddle_default"];

// ── API CALL ──────────────────────────────────────────────
async function pfCall(endpoint, body={}, useSecret=false) {
  const headers = { "Content-Type":"application/json" };
  if (useSecret) headers["X-SecretKey"] = PF_SECRET;
  else if (window._pfSession) headers["X-Authorization"] = window._pfSession;
  const res = await fetch(`${PF_BASE}${endpoint}`, {
    method:"POST", headers, body: JSON.stringify(body)
  });
  const data = await res.json();
  if (data.code !== 200) {
    const msg = data.errorMessage || data.error || data.message ||
      (data.errorDetails ? Object.values(data.errorDetails).flat().join(', ') : null) ||
      `PlayFab error ${data.code || res.status}`;
    console.error('[PlayFab] Error on', endpoint, data);
    throw new Error(msg);
  }
  return data.data;
}

async function pfBatch(promises) { return Promise.all(promises); }

// ── AUTH ──────────────────────────────────────────────────
async function pfRegister(displayName, email, password) {
  const internalUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 20) + Math.floor(Math.random() * 9000 + 1000);
  const data = await pfCall("/Client/RegisterPlayFabUser", {
    TitleId: PF_TITLE, Username: internalUsername,
    Email: email, Password: password,
    RequireBothUsernameAndEmail: true
  });
  window._pfSession = data.SessionTicket;
  window._pfPlayer = { id: data.PlayFabId, username: displayName, email };
  saveSession();
  await pfCall("/Client/UpdateUserTitleDisplayName", { DisplayName: displayName.slice(0, 25) });
  await initPlayerData();
  return data;
}

async function pfLogin(email, password) {
  const data = await pfCall("/Client/LoginWithEmailAddress", {
    TitleId: PF_TITLE, Email: email.trim(), Password: password,
    InfoRequestParameters: { GetUserAccountInfo: true }
  });
  window._pfSession = data.SessionTicket;
  let username = data.InfoResultPayload?.AccountInfo?.TitleInfo?.DisplayName || email.split('@')[0];
  if (!data.InfoResultPayload?.AccountInfo?.TitleInfo?.DisplayName) {
    try {
      const profile = await pfCall("/Client/GetPlayerProfile", { ProfileConstraints: { ShowDisplayName: true } });
      username = profile.PlayerProfile?.DisplayName || username;
    } catch {}
  }
  window._pfPlayer = { id: data.PlayFabId, username, email: email.trim() };
  saveSession();
  return data;
}

async function pfSendPasswordReset(email) {
  return pfCall("/Client/SendAccountRecoveryEmail", { TitleId: PF_TITLE, Email: email.trim() });
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
async function pfGetTitleData(keys=[]) {
  return pfCall("/Client/GetTitleData", keys.length ? { Keys: keys } : {});
}
async function pfSetTitleData(key, value) {
  return pfCall("/Admin/SetTitleData", { Key: key, Value: JSON.stringify(value) }, true);
}
async function pfGetInventory() {
  return pfCall("/Client/GetUserInventory", {});
}

// ── SHOP PURCHASE ─────────────────────────────────────────
async function pfPurchaseCosmetic(itemId) {
  const item = COSMETICS_CATALOG.find(c => c.id === itemId);
  if (!item) throw new Error("Unknown item");
  if (item.price === null || item.price === undefined) throw new Error("This item cannot be purchased");

  const fresh = await pfGetPlayerData(["coins", "owned_cosmetics"]);
  const serverCoins = parseInt(fresh.Data?.coins?.Value || "0");
  const serverOwned = JSON.parse(fresh.Data?.owned_cosmetics?.Value || "[]");

  if (serverOwned.includes(itemId)) throw new Error("Already owned");
  if (serverCoins < item.price)     throw new Error("Not enough coins");

  const newCoins = serverCoins - item.price;
  const newOwned = [...serverOwned, itemId];

  await pfSetPlayerData({ coins: String(newCoins), owned_cosmetics: JSON.stringify(newOwned) });
  await pfUpdateStat("TotalCoins", newCoins);

  return { newCoins, newOwned };
}

// ── STAFF CHECK ───────────────────────────────────────────
async function isStaff() {
  if (!window._pfPlayer?.id) return false;
  try {
    const d = await pfCall("/Admin/GetUserData", { PlayFabId: window._pfPlayer.id, Keys: ["is_staff"] }, true);
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

// ── INIT PLAYER DATA ──────────────────────────────────────
async function initPlayerData() {
  await pfSetPlayerData({
    coins: "0", clicks: "0", upgrades: "{}",
    equipped: JSON.stringify(DEFAULT_EQUIPPED),
    owned_cosmetics: JSON.stringify(DEFAULT_OWNED),
  });
  await pfUpdateStat("TotalClicks", 0);
  await pfUpdateStat("TotalCoins", 0);
}
