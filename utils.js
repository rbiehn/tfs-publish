/* TFS PUBLISH | utils.js | Version 42 | March 19, 2026 */

var SUPABASE_URL = "https://fiyamhxmszuxfpnfnuwz.supabase.co";
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpeWFtaHhtc3p1eGZwbmZudXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDg3NjMsImV4cCI6MjA4ODgyNDc2M30.cbQvMcCJnhon4qQ-C9uViubQyKapfBpVpA3Q8tU4KIM";
var _sbLib = window.supabase || window.Supabase || null;
var _sb = _sbLib ? _sbLib.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
if (!_sb) console.warn("Supabase not loaded. window.supabase:", typeof window.supabase, "window.Supabase:", typeof window.Supabase);
else console.log("Supabase connected");

var STORAGE_URL = SUPABASE_URL + "/storage/v1/object/public/media/";

var _saveTimers = {};
var _lastSaved = {};
function debounceSave(id, val) {
  try { localStorage.setItem("tfs_" + id, JSON.stringify(val)); } catch (e) {}
  if (!_sb) return;
  if (_saveTimers[id]) clearTimeout(_saveTimers[id]);
  _saveTimers[id] = setTimeout(function() {
    _lastSaved[id] = Date.now();
    _sb.from("publishing_data").upsert({ id: id, value: val }).then(function(r) {
      if (r.error) console.error("Save:", id, r.error);
    });
  }, 1000);
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


