/* TFS PUBLISH | utils.js | Version 49 | July 11, 2026 */
/* Saves go through the password-gated set-publishing-data endpoint; password entered via in-app unlock bar (no native popups). */

var SUPABASE_URL = "https://gewufsselhrzbzrctruo.supabase.co";
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdld3Vmc3NlbGhyemJ6cmN0cnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzA5MDYsImV4cCI6MjA5MzE0NjkwNn0.rxkzHvpy6Gkw454cSWOApp8ycf-SjqBL4yg1sj7HFXU";
var _sbLib = window.supabase || window.Supabase || null;
var _sb = _sbLib ? _sbLib.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
if (!_sb) console.warn("Supabase not loaded. window.supabase:", typeof window.supabase, "window.Supabase:", typeof window.Supabase);
else console.log("Supabase connected");

var STORAGE_URL = SUPABASE_URL + "/storage/v1/object/public/media/";

var _saveTimers = {};
var _lastSaved = {};
var _pendingSaves = {};

// ---- SECURE SAVE (in-app unlock, no native popups) --------------------------
// Writes go through the password-gated edge function, never the public anon key.
// The password is entered once via a small in-app "unlock" bar (NOT window.prompt,
// which browsers suppress on timer-driven calls) and cached locally. A missing or
// wrong password shows the unlock bar and queues the save until it is provided.
var PUBLISH_FN = SUPABASE_URL + "/functions/v1/set-publishing-data";

function _getSecret() { try { return localStorage.getItem("tfs_publish_secret") || ""; } catch (e) { return ""; } }
function _setSecret(s) { try { localStorage.setItem("tfs_publish_secret", s); } catch (e) {} }
function _clearSecret() { try { localStorage.removeItem("tfs_publish_secret"); } catch (e) {} }

function _flushPending() {
  var ids = Object.keys(_pendingSaves);
  ids.forEach(function(id) { var v = _pendingSaves[id]; delete _pendingSaves[id]; _secureSave(id, v); });
}

function showUnlockBar(msg) {
  var existing = document.getElementById("tfs-unlock");
  if (existing) { var mm = existing.querySelector(".tfs-unlock-msg"); if (mm && msg) mm.textContent = msg; return; }
  if (!document.body) { return; }
  var css = "position:fixed;left:0;right:0;bottom:0;z-index:2147483647;"
    + "padding:12px 14px calc(12px + env(safe-area-inset-bottom));"
    + "background:#1a1a2e;color:#fff;box-shadow:0 -6px 24px rgba(0,0,0,.28);"
    + "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;";
  var bar = document.createElement("div");
  bar.id = "tfs-unlock";
  bar.setAttribute("style", css);
  bar.innerHTML =
    '<div style="max-width:600px;margin:0 auto;display:flex;flex-direction:column;gap:8px;">'
    + '<div class="tfs-unlock-msg" style="font-size:13px;font-weight:700;letter-spacing:.3px;color:#f97316;">'
    + (msg || "Enter your save password to sync changes") + '</div>'
    + '<div style="display:flex;gap:8px;">'
    + '<input type="password" class="tfs-unlock-in" autocomplete="current-password" placeholder="Save password" '
    + 'style="flex:1;min-width:0;font-size:16px;padding:11px 12px;border:1px solid #3a3a52;border-radius:10px;background:#0f0f1e;color:#fff;outline:none;" />'
    + '<button class="tfs-unlock-btn" style="flex:0 0 auto;font-size:15px;font-weight:800;padding:11px 16px;border:none;border-radius:10px;background:#f97316;color:#fff;cursor:pointer;">Unlock</button>'
    + '</div></div>';
  document.body.appendChild(bar);
  var input = bar.querySelector(".tfs-unlock-in");
  var btn = bar.querySelector(".tfs-unlock-btn");
  function submit() {
    var v = (input.value || "").trim();
    if (!v) { input.focus(); return; }
    _setSecret(v); bar.remove(); _flushPending();
  }
  btn.addEventListener("click", submit);
  input.addEventListener("keydown", function(e) { if (e.key === "Enter") submit(); });
  setTimeout(function() { try { input.focus(); } catch (e) {} }, 60);
}

function _secureSave(id, val) {
  var secret = _getSecret();
  if (!secret) { _pendingSaves[id] = val; showUnlockBar(); return; }
  fetch(PUBLISH_FN, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-publishing-secret": secret },
    body: JSON.stringify({ id: id, value: val })
  }).then(function(r) {
    if (r.status === 401) { _clearSecret(); _pendingSaves[id] = val; showUnlockBar("That password was wrong. Try again."); }
    else if (!r.ok) { r.text().then(function(t) { console.error("Save failed:", id, r.status, t); }); }
  }).catch(function(e) { console.error("Save network error:", id, e); });
}

function debounceSave(id, val) {
  try { localStorage.setItem("tfs_" + id, JSON.stringify(val)); } catch (e) {}
  if (_saveTimers[id]) clearTimeout(_saveTimers[id]);
  _saveTimers[id] = setTimeout(function() { _lastSaved[id] = Date.now(); _secureSave(id, val); }, 1000);
}

function lsLoad(id, fallback) {
  try { var v = localStorage.getItem("tfs_" + id); return v ? JSON.parse(v) : fallback; }
  catch (e) { return fallback; }
}

function scanAlgo(t) {
  if (!t) return [];
  var r = [];
  ALGO_WORDS.forEach(function(w) {
    var re = new RegExp("\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi");
    var m;
    while ((m = re.exec(t.toLowerCase())) !== null) {
      r.push({ word: m[0], safe: ALGO_SAFE[w] || "?" });
    }
  });
  return r;
}

function addD(ds, n) {
  if (!ds) return "";
  var d = new Date(ds + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function fmtD(ds) {
  if (!ds) return "";
  var d = new Date(ds + "T12:00:00");
  return MONTHS[d.getMonth()] + " " + d.getDate();
}

function fmtTimer(ms) {
  if (ms <= 0) return "0:00";
  var m = Math.floor(ms / 60000);
  var s = Math.floor((ms % 60000) / 1000);
  return m + ":" + (s < 10 ? "0" : "") + s;
}

function fmtSize(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return Math.round(b / 1024) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

function isImgUrl(u) {
  if (!u) return false;
  var l = u.toLowerCase();
  return l.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/) ||
    l.indexOf("images.squarespace") !== -1 ||
    l.indexOf("imgur.com") !== -1 ||
    l.indexOf("i.ibb.co") !== -1 ||
    l.indexOf("supabase.co/storage") !== -1;
}

// ---- MARKDOWN IMPORT/EXPORT ----

var MD_SECTION_MAP = {
  "shared": "shared",
  "tiktok": "tiktok",
  "instagram": "instagram",
  "youtube": "youtube",
  "fb personal": "fb_personal",
  "fb page": "fb_page",
  "fb groups": "fb_groups",
  "x": "x",
  "reddit": "reddit"
};

var MD_SECTION_LABELS = {
  "shared": "Shared",
  "tiktok": "TikTok",
  "instagram": "Instagram",
  "youtube": "YouTube",
  "fb_personal": "FB Personal",
  "fb_page": "FB Page",
  "x": "X",
  "reddit": "Reddit"
};

var MD_KEY_MAP = {
  "caption": "copy",
  "hashtags": "hashtags",
  "keywords": "keywords",
  "prompt": "prompt",
  "music": "music",
  "title": "title",
  "description": "description",
  "tags": "tags",
  "reel title": "reel_title",
  "related video": "relatedVideo",
  "content type": "_contentType",
  "salesy": "_salesy",
  "post time": "_postTime",
  "body": "copy"
};

var MD_CONTENT_TYPE_MAP = {
  "personal story": "personal",
  "world / lore": "world",
  "world/lore": "world",
  "behind the scenes": "bts",
  "book pitch": "pitch",
  "writing craft": "craft",
  "community / fan": "community",
  "community/fan": "community",
  "collab / feature": "collab",
  "collab/feature": "collab",
  "not set": "none",
  "": "none"
};

var MD_SALESY_MAP = {
  "no mention": "none",
  "soft": "soft",
  "full": "full",
  "": "none"
};

function generateBlankMd(dayNum) {
  var lines = [];
  lines.push("# " + dayNum + ": [Video Title]");
  lines.push("Content Type: [Personal Story / World / Lore / Behind the Scenes / Book Pitch / Writing Craft / Community / Fan / Collab / Feature]");
  lines.push("Salesy: [No Mention / Soft / Full]");
  lines.push("Post Time: [HH:MM]");
  lines.push("");
  lines.push("## Shared");
  lines.push("Caption:");
  lines.push("[Base caption for all platforms. 100-300 characters ideal.]");
  lines.push("");
  lines.push("Hashtags: [4 total: 1 anchor + 1-2 genre + 0-1 comp. e.g. #thefirststone #yabooks #epicfantasy #grishaverse]");
  lines.push("Keywords: [On-screen text overlay for indexing]");
  lines.push("Prompt: [Engagement question / CTA question]");
  lines.push("Music: [Trending sound name or mood direction]");
  lines.push("");
  lines.push("## TikTok");
  lines.push("Caption:");
  lines.push("[Edit from shared if needed. 800ch max, ONE CTA]");
  lines.push("");
  lines.push("Hashtags: [4 max: 1 anchor + 1-2 genre + 0-1 comp]");
  lines.push("Related Video: [Which content piece connects to this one]");
  lines.push("");
  lines.push("## Instagram");
  lines.push("Caption:");
  lines.push("[Edit from shared. 500ch max, ONE CTA, link in bio OK]");
  lines.push("");
  lines.push("Hashtags: [5 max: #thefirststone + 4]");
  lines.push("Prompt: [Pinned comment question]");
  lines.push("Related Video:");
  lines.push("");
  lines.push("## YouTube");
  lines.push("Title: [100ch max, Title Case, keyword-rich]");
  lines.push("Description:");
  lines.push("[Add from desktop. Hashtags go here.]");
  lines.push("");
  lines.push("Hashtags: [2-3 discovery hashtags, no #Shorts]");
  lines.push("Tags: [5-10 keyword tags, comma-separated]");
  lines.push("Related Video:");
  lines.push("");
  lines.push("## FB Personal");
  lines.push("Title: [Match YouTube Shorts title]");
  lines.push("Caption:");
  lines.push("[Casual Robert. No hashtags, no CTAs.]");
  lines.push("");
  lines.push("Related Video:");
  lines.push("");
  lines.push("## FB Page");
  lines.push("Caption:");
  lines.push("[Polished brand voice. Links in comment only.]");
  lines.push("");
  lines.push("Reel Title: [Required]");
  lines.push("Hashtags: [0-1]");
  lines.push("Related Video:");
  lines.push("");
  lines.push("## X");
  lines.push("Caption:");
  lines.push("[280ch max. Sentence case. ONE CTA.]");
  lines.push("");
  lines.push("Hashtags: [2 exactly]");
  lines.push("Related Video:");
  lines.push("");
  return lines.join("\n");
}

function exportDayMd(dayNum, dc) {
  if (!dc) return generateBlankMd(dayNum);
  var sh = dc.shared || {};
  var lines = [];
  lines.push("# " + dayNum + ": " + (dc.topicTitle || "[Video Title]"));
  var ctObj = CONTENT_TYPES.find(function(c) { return c.id === (dc.contentType || "none"); });
  lines.push("Content Type: " + (ctObj && ctObj.id !== "none" ? ctObj.label : ""));
  var slObj = SALESY_LEVELS.find(function(s) { return s.id === (dc.salesy || "none"); });
  lines.push("Salesy: " + (slObj && slObj.id !== "none" ? slObj.label : ""));
  lines.push("Post Time: " + (dc.postTime || ""));
  lines.push("");
  lines.push("## Shared");
  lines.push("Caption:");
  lines.push(sh.caption || "");
  lines.push("");
  lines.push("Hashtags: " + (sh.hashtags || ""));
  lines.push("Keywords: " + (sh.keywords || ""));
  lines.push("Prompt: " + (sh.prompt || ""));
  lines.push("Music: " + (sh.music || ""));
  lines.push("");
  var platOrder = ["tiktok", "instagram", "youtube", "fb_personal", "fb_page", "x", "reddit"];
  platOrder.forEach(function(pid) {
    var tpl = TEMPLATES[pid];
    if (!tpl || !tpl.length) return;
    var pc = (dc.platforms && dc.platforms[pid]) || {};
    lines.push("## " + MD_SECTION_LABELS[pid]);
    tpl.forEach(function(f) {
      var val = pc[f.key] || "";
      var label = f.label;
      if (f.key === "copy") label = "Caption";
      if (f.key === "reel_title") label = "Reel Title";
      if (f.key === "relatedVideo") label = "Related Video";
      if (f.multi) {
        lines.push(label + ":");
        lines.push(val);
        lines.push("");
      } else {
        lines.push(label + ": " + val);
      }
    });
    lines.push("");
  });
  return lines.join("\n");
}

function parseDayMd(mdText) {
  var lines = mdText.split(/\r?\n/);
  var result = {
    dayNum: null,
    topicTitle: "",
    contentType: "none",
    salesy: "none",
    postTime: "",
    shared: {},
    platforms: {}
  };
  var currentSection = "header";
  var currentKey = null;
  var currentVal = [];

  var flushKey = function() {
    if (!currentKey) return;
    var val = currentVal.join("\n").trim();
    if (!val) { currentKey = null; currentVal = []; return; }
    var mapped = MD_KEY_MAP[currentKey.toLowerCase()] || currentKey.toLowerCase();
    if (mapped === "_contentType") {
      result.contentType = MD_CONTENT_TYPE_MAP[val.toLowerCase()] || "none";
    } else if (mapped === "_salesy") {
      result.salesy = MD_SALESY_MAP[val.toLowerCase()] || "none";
    } else if (mapped === "_postTime") {
      result.postTime = val;
    } else if (currentSection === "shared") {
      if (mapped === "copy") mapped = "caption";
      result.shared[mapped] = val;
    } else if (currentSection && currentSection !== "header") {
      if (!result.platforms[currentSection]) result.platforms[currentSection] = {};
      result.platforms[currentSection][mapped] = val;
    }
    currentKey = null;
    currentVal = [];
  };

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    // Match both "# Day 5: Title" (legacy) and "# 5: Title" (v41)
    var h1 = line.match(/^#\s+(?:Day\s+)?(\d+)\s*:\s*(.*)/i);
    if (h1) {
      flushKey();
      result.dayNum = parseInt(h1[1]);
      result.topicTitle = h1[2].replace(/^\[.*\]$/, "").trim();
      currentSection = "header";
      continue;
    }
    var h2 = line.match(/^##\s+(.+)/);
    if (h2) {
      flushKey();
      var secName = h2[1].trim().toLowerCase();
      currentSection = MD_SECTION_MAP[secName] || secName;
      continue;
    }
    var kvMatch = line.match(/^([A-Za-z][A-Za-z /]*?)\s*:\s*(.*)/);
    if (kvMatch && !line.match(/^https?:\/\//)) {
      flushKey();
      currentKey = kvMatch[1].trim();
      var inlineVal = kvMatch[2].trim();
      if (inlineVal && !inlineVal.match(/^\[.*\]$/)) {
        currentVal = [inlineVal];
      } else if (inlineVal.match(/^\[.*\]$/)) {
        currentVal = [];
      } else {
        currentVal = [];
      }
      continue;
    }
    if (currentKey !== null) {
      if (line.trim() === "" && currentVal.length > 0) {
        flushKey();
      } else if (line.trim() !== "" && !line.match(/^\[.*\]$/)) {
        currentVal.push(line);
      }
    }
  }
  flushKey();
  return result;
}

function mergeDayMd(parsed, existingContent) {
  var dc = Object.assign({
    topicTitle: "", contentType: "none", salesy: "none", postTime: "",
    platforms: {}, shared: {}, stories: {}
  }, existingContent || {});

  if (parsed.topicTitle) dc.topicTitle = parsed.topicTitle;
  if (parsed.contentType && parsed.contentType !== "none") dc.contentType = parsed.contentType;
  if (parsed.salesy && parsed.salesy !== "none") dc.salesy = parsed.salesy;
  if (parsed.postTime) dc.postTime = parsed.postTime;

  dc.shared = Object.assign({}, dc.shared || {});
  for (var sk in parsed.shared) {
    if (parsed.shared[sk]) dc.shared[sk] = parsed.shared[sk];
  }

  dc.platforms = Object.assign({}, dc.platforms || {});
  for (var pid in parsed.platforms) {
    dc.platforms[pid] = Object.assign({}, dc.platforms[pid] || {});
    for (var fk in parsed.platforms[pid]) {
      if (parsed.platforms[pid][fk]) dc.platforms[pid][fk] = parsed.platforms[pid][fk];
    }
  }

  return dc;
}

function normHashtags(text, plat){
  text = text || "";
  var tagRe = /#[A-Za-z0-9_]+/g;
  var found = text.match(tagRe) || [];
  if(!found.length) return text;
  var seen = {}, uniq = [];
  found.forEach(function(h){ var k = h.toLowerCase(); if(!seen[k]){ seen[k] = 1; uniq.push(h); } });
  if(plat === "instagram"){
    var i = uniq.map(function(h){ return h.toLowerCase(); }).indexOf("#thefirststone");
    if(i > 0){ uniq.unshift(uniq.splice(i,1)[0]); }
    else if(i < 0){ uniq.unshift("#thefirststone"); }
  }
  var L = (typeof PLAT_HASHTAG_LIMITS !== "undefined") ? PLAT_HASHTAG_LIMITS : {};
  var lim = (plat === "x") ? uniq.length : ((plat in L) ? L[plat] : uniq.length);
  var kept = uniq.slice(0, lim);
  var body = text.replace(tagRe, "").replace(/[ \t]+/g, " ").replace(/ *\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/\s+$/, "");
  return kept.length ? (body + "\n\n" + kept.join(" ")) : body;
}
