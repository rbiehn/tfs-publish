/* TFS PUBLISH | app.js | Version 46 | March 19, 2026 */

var useState = React.useState;
var useEffect = React.useEffect;

function App() {
  // ---- STATE ----
  var _v = useState("tasks"), view = _v[0], setView = _v[1];
  var _pv = useState("tasks"), prevView = _pv[0], setPrevView = _pv[1];
  var goTo = function(v) { setPrevView(view); setView(v); };
  var goBack = function() { var target = prevView || "tasks"; setPrevView("tasks"); setView(target); };
  var _d = useState(1), day = _d[0], setDay = _d[1];
  var _p = useState("tiktok"), plat = _p[0], setPlat = _p[1];
  var _vr = useState("a"), ver = _vr[0], setVer = _vr[1];
  var _dp = useState(false), showDP = _dp[0], setShowDP = _dp[1];
  var _ed = useState(false), showEd = _ed[0], setShowEd = _ed[1];
  var _ef = useState(null), edFld = _ef[0], setEdFld = _ef[1];
  var _ev = useState(""), edVal = _ev[0], setEdVal = _ev[1];
  var _to = useState(""), toast = _to[0], setToast = _to[1];
  var _cm = useState("month"), calMode = _cm[0], setCalMode = _cm[1];
  var _cmo = useState({ y: new Date().getFullYear(), m: new Date().getMonth() }), calMo = _cmo[0], setCalMo = _cmo[1];
  var _dc = useState(14), dayCount = _dc[0], setDayCount = _dc[1];
  var _cf = useState(false), showConfirm = _cf[0], setShowConfirm = _cf[1];
  var _sm = useState(false), showMore = _sm[0], setShowMore = _sm[1];
  var _stg = useState(false), showTags = _stg[0], setShowTags = _stg[1];
  var _delGrp = useState(null), delGrpIdx = _delGrp[0], setDelGrp = _delGrp[1];
  var _openSec = useState(null), openSec = _openSec[0], setOpenSec = _openSec[1];
  var _ct = useState({}), content = _ct[0], setCt = _ct[1];
  var _ck = useState({}), checks = _ck[0], setCk = _ck[1];
  var _st = useState({}), statuses = _st[0], setSt = _st[1];
  var _nt = useState({}), notes = _nt[0], setNt = _nt[1];
  var _tm = useState({}), timers = _tm[0], setTm = _tm[1];
  var _fg = useState({}), fbG = _fg[0], setFbG = _fg[1];
  var _vd = useState({}), verD = _vd[0], setVD = _vd[1];
  var _md = useState({}), media = _md[0], setMd = _md[1];
  var _gg = useState([]), globalGroups = _gg[0], setGG = _gg[1];
  var _tick = useState(0), tick = _tick[0], setTick = _tick[1];
  var _lo = useState(false), loaded = _lo[0], setLoaded = _lo[1];
  var _anl = useState(lsLoad("analytics", {})), analytics = _anl[0], setAnalytics = _anl[1];
  var _strk = useState(lsLoad("streakDates", [])), streakDates = _strk[0], setStreakDates = _strk[1];

  // ---- EFFECTS ----
  useEffect(function() { if (loaded) { try { localStorage.setItem("tfs_streakDates", JSON.stringify(streakDates)); } catch (e) {} } }, [streakDates]);
  useEffect(function() { if (loaded) { try { localStorage.setItem("tfs_analytics", JSON.stringify(analytics)); } catch (e) {} } }, [analytics]);
  useEffect(function() { var iv = setInterval(function() { setTick(function(t) { return t + 1; }); }, 1000); return function() { clearInterval(iv); }; }, []);
  useEffect(function() { var params = new URLSearchParams(window.location.search); var pDay = params.get("day"); var pVer = params.get("ver"); if (pDay) setDay(parseInt(pDay)); if (pVer) setVer(pVer); if (pDay || pVer) window.history.replaceState({}, "", window.location.pathname); }, []);

  // ---- SUPABASE LOAD ----
  useEffect(function() {
    if (!_sb) {
      setCt(lsLoad("content", {})); setCk(lsLoad("checks", {})); setSt(lsLoad("statuses", {}));
      setNt(lsLoad("notes", {})); setVD(lsLoad("verD", {})); setMd(lsLoad("media", {}));
      setFbG(lsLoad("fbG", {})); setGG(lsLoad("globalGroups", [])); setTm(lsLoad("timers", {}));
      var lsDc = lsLoad("dayCount", 14); if (lsDc) setDayCount(lsDc);
      setLoaded(true); return;
    }
    _sb.from("publishing_data").select("*").then(function(res) {
      if (res.data) { res.data.forEach(function(row) {
        var v = row.value;
        if (row.id === "content" && v && typeof v === "object" && Object.keys(v).length) setCt(v);
        if (row.id === "checks" && v && typeof v === "object" && Object.keys(v).length) setCk(v);
        if (row.id === "statuses" && v && typeof v === "object" && Object.keys(v).length) setSt(v);
        if (row.id === "notes" && v && typeof v === "object" && Object.keys(v).length) setNt(v);
        if (row.id === "verD" && v && typeof v === "object" && Object.keys(v).length) setVD(v);
        if (row.id === "media" && v && typeof v === "object" && Object.keys(v).length) setMd(v);
        if (row.id === "fbG" && v && typeof v === "object" && Object.keys(v).length) setFbG(v);
        if (row.id === "globalGroups" && Array.isArray(v) && v.length) setGG(v);
        if (row.id === "timers" && v && typeof v === "object" && Object.keys(v).length) setTm(v);
        if (row.id === "dayCount" && v) setDayCount(typeof v === "number" ? v : parseInt(v));
      }); }
      setLoaded(true);
    }).catch(function() { setLoaded(true); });
    var channel = _sb.channel("publishing_realtime").on("postgres_changes", { event: "UPDATE", schema: "public", table: "publishing_data" }, function(payload) { applyRow(payload.new); }).subscribe();
    return function() { _sb.removeChannel(channel); };
  }, []);

  var applyRow = function(row) {
    var v = row.value; if (!v) return;
    if (_lastSaved[row.id] && (Date.now() - _lastSaved[row.id]) < 3000) return;
    if (row.id === "content") setCt(v);
    if (row.id === "checks") setCk(v);
    if (row.id === "statuses") setSt(v);
    if (row.id === "notes") setNt(v);
    if (row.id === "verD") setVD(v);
    if (row.id === "media") setMd(v);
    if (row.id === "fbG") setFbG(v);
    if (row.id === "globalGroups") setGG(v);
    if (row.id === "timers") setTm(v);
    if (row.id === "dayCount") setDayCount(typeof v === "number" ? v : parseInt(v));
  };

  // ---- SAVE EFFECTS ----
  useEffect(function() { if (loaded) debounceSave("content", content); }, [content]);
  useEffect(function() { if (loaded) debounceSave("checks", checks); }, [checks]);
  useEffect(function() { if (loaded) debounceSave("statuses", statuses); }, [statuses]);
  useEffect(function() { if (loaded) debounceSave("notes", notes); }, [notes]);
  useEffect(function() { if (loaded) debounceSave("verD", verD); }, [verD]);
  useEffect(function() { if (loaded) debounceSave("media", media); }, [media]);
  useEffect(function() { if (loaded) debounceSave("fbG", fbG); }, [fbG]);
  useEffect(function() { if (loaded) debounceSave("globalGroups", globalGroups); }, [globalGroups]);
  useEffect(function() { if (loaded) debounceSave("dayCount", dayCount); }, [dayCount]);
  useEffect(function() { if (loaded) debounceSave("timers", timers); }, [timers]);

  // ---- DERIVED STATE ----
  var dK = "d" + day, pK = dK + "_" + plat, vK = dK + "_v" + ver;
  var dc = content[day], pc = dc && dc.platforms && dc.platforms[plat];
  var tpl = TEMPLATES[plat];
  var st = statuses[pK] || "not_started", myN = notes[pK] || "";
  var pCk = checks[pK] || {}, vd = verD[vK] || {}, cm = media[vK] || {};
  var aPlat = PLATFORMS.find(function(p) { return p.id === plat; });
  var isSpecial = aPlat && aPlat.special;
  var shared = (dc && dc.shared) || {};
  var cType = CONTENT_TYPES.find(function(c) { return c.id === (dc && dc.contentType || "none"); });
  var sLevel = SALESY_LEVELS.find(function(s) { return s.id === (dc && dc.salesy || "none"); });
  var videoTitle = (dc && dc.topicTitle) || "";
  var schedDate = vd.date ? fmtD(vd.date) : "Unscheduled";

  // ---- PROGRESS (v46: flat checklist) ----
  var countProgress = function(d, pid) {
    var k = "d" + d + "_" + pid;
    var ck = checks[k] || {};
    var total = 0, done = 0;
    var steps = CHECKLISTS[pid] || [];
    steps.forEach(function(_, i) { total++; if (ck["p_" + i]) done++; });
    if (pid === "youtube") {
      var ytc = CHECKLISTS.yt_community || [];
      ytc.forEach(function(_, i) { total++; if (ck["ytc_" + i]) done++; });
    }
    var sc = STORY_CHECKLISTS[pid] || {};
    ["s1", "s2", "s3"].forEach(function(sk) {
      if (sc[sk]) sc[sk].forEach(function(_, i) { total++; if (ck[sk + "_" + i]) done++; });
    });
    return { total: total, done: done, pct: total ? Math.round(done / total * 100) : 0 };
  };
  var prog = countProgress(day, plat);

  // ---- HELPERS ----
  var flash = function(m) { setToast(m); setTimeout(function() { setToast(""); }, 2000); };

  var setShared = function(f, v) { setCt(function(p) { var dd = Object.assign({ topicTitle: "", contentType: "none", salesy: "none", postTime: "", platforms: {}, shared: {}, indexEvergreen: INDEX_EVERGREEN_DEFAULT, indexTopic: "" }, p[day] || {}); dd.shared = Object.assign({}, dd.shared || {}); dd.shared[f] = v; var o = Object.assign({}, p); o[day] = dd; return o; }); };
  var setFld = function(d, pl, f, v) { setCt(function(p) { var dd = Object.assign({ topicTitle: "", contentType: "none", salesy: "none", postTime: "", platforms: {}, shared: {}, indexEvergreen: INDEX_EVERGREEN_DEFAULT, indexTopic: "" }, p[d] || {}); dd.platforms = Object.assign({}, dd.platforms); dd.platforms[pl] = Object.assign({}, dd.platforms[pl] || {}); dd.platforms[pl][f] = v; var o = Object.assign({}, p); o[d] = dd; return o; }); };
  var setMeta = function(d, f, v) { setCt(function(p) { var dd = Object.assign({ topicTitle: "", contentType: "none", salesy: "none", postTime: "", platforms: {}, shared: {}, indexEvergreen: INDEX_EVERGREEN_DEFAULT, indexTopic: "" }, p[d] || {}); dd[f] = v; var o = Object.assign({}, p); o[d] = dd; return o; }); };
  var getVD = function(d, v) { return verD["d" + d + "_v" + v] || {}; };
  var setVF = function(d, v, f, val) { var k2 = "d" + d + "_v" + v; setVD(function(p) { var o = Object.assign({}, p); o[k2] = Object.assign({}, o[k2] || {}); o[k2][f] = val; return o; }); };
  var _notifySent = {};
  var sendNotify = function(type, d, v) { var nk = type + "_d" + d + "_v" + v; if (_notifySent[nk]) return; _notifySent[nk] = true; if (!_sb) return; _sb.rpc("send_notification", { notify_type: type, day_num: d, ver_letter: v }).then(function(r) { if (r.error) { console.error("Notify error:", r.error); } else { flash("Notification sent"); } }); };
  var setMF = function(f, v) { var prevMd = media[vK] || {}; setMd(function(p) { var o = Object.assign({}, p); o[vK] = Object.assign({}, o[vK] || {}); o[vK][f] = v; if (f === "rawLink" && v && (!o[vK].mediaStatus || o[vK].mediaStatus === "no_media")) o[vK].mediaStatus = "raw_uploaded"; if ((f === "editedLink" || f === "editedNoMusicLink") && v && o[vK].mediaStatus !== "final") o[vK].mediaStatus = "edited"; if (f === "robertApproved" && v) o[vK].mediaStatus = "final"; if ((f === "finalLink" || f === "finalNoMusicLink") && v) o[vK].mediaStatus = "final"; return o; }); if (f === "rawLink" && v && v.indexOf("http") === 0 && !prevMd.rawLink) sendNotify("raw_uploaded", day, ver); if (f === "editedLink" && v && v.indexOf("http") === 0 && !prevMd.editedLink) sendNotify("edit_uploaded", day, ver); if (f === "editedNoMusicLink" && v && v.indexOf("http") === 0 && !prevMd.editedNoMusicLink) sendNotify("edit_uploaded", day, ver); };
  useEffect(function() { if (ver !== "a" && content[day]) { var a = getVD(day, "a"), c = getVD(day, ver); if (a.date && !c.date) setVF(day, ver, "date", addD(a.date, ver === "b" ? 14 : 28)); if (!c.musicNotes) { var vi = VERSIONS.find(function(x) { return x.id === ver; }); if (vi) setVF(day, ver, "musicNotes", vi.music); } }; }, [ver, day]);
  var onADate = function(d, date) { setVF(d, "a", "date", date); if (date) { if (!getVD(d, "b").date) setVF(d, "b", "date", addD(date, 14)); if (!getVD(d, "c").date) setVF(d, "c", "date", addD(date, 28)); } };

  // ---- EDITING TAB STATE ----
  var editCkKey = "d" + day + "_editing_v" + ver;
  var editCk = checks[editCkKey] || {};
  var toggleEditCk = function(id) { setCk(function(p) { var o = Object.assign({}, p); o[editCkKey] = Object.assign({}, o[editCkKey] || {}); o[editCkKey][id] = !o[editCkKey][id]; return o; }); };

  // ---- CHECKLIST HELPERS (v46) ----
  var toggleCk = function(id) { setCk(function(p) { var o = Object.assign({}, p); o[pK] = Object.assign({}, o[pK] || {}); o[pK][id] = !o[pK][id]; return o; }); };
  var resetCk = function() { setCk(function(p) { var o = Object.assign({}, p); o[pK] = {}; return o; }); flash("Checklist reset"); };
  var checkSection = function(prefix, items) { if (!items || !items.length) return; setCk(function(p) { var o = Object.assign({}, p); o[pK] = Object.assign({}, o[pK] || {}); var allDone = true; items.forEach(function(_, i) { if (!o[pK][prefix + i]) allDone = false; }); items.forEach(function(_, i) { o[pK][prefix + i] = !allDone; }); return o; }); };

  // ---- DELETE DAY ----
  var _delDay = useState(false), showDelDay = _delDay[0], setShowDelDay = _delDay[1];
  var deleteDay = function() { setCt(function(p) { var o = Object.assign({}, p); delete o[day]; return o; }); setCk(function(p) { var o = Object.assign({}, p); REAL_PLATFORMS.forEach(function(pl) { delete o["d" + day + "_" + pl.id]; }); return o; }); setSt(function(p) { var o = Object.assign({}, p); REAL_PLATFORMS.forEach(function(pl) { delete o["d" + day + "_" + pl.id]; }); return o; }); setNt(function(p) { var o = Object.assign({}, p); REAL_PLATFORMS.forEach(function(pl) { delete o["d" + day + "_" + pl.id]; }); return o; }); setTm(function(p) { var o = Object.assign({}, p); REAL_PLATFORMS.forEach(function(pl) { delete o["d" + day + "_" + pl.id]; }); return o; }); setVD(function(p) { var o = Object.assign({}, p); VERSIONS.forEach(function(v2) { delete o["d" + day + "_v" + v2.id]; }); return o; }); setMd(function(p) { var o = Object.assign({}, p); VERSIONS.forEach(function(v2) { delete o["d" + day + "_v" + v2.id]; }); return o; }); setFbG(function(p) { var o = Object.assign({}, p); delete o["d" + day]; return o; }); setShowDelDay(false); flash("Deleted"); };

  // ---- EDITOR MODAL ----
  var openEd = function(fld) { setEdFld(fld); if (fld === "notes") setEdVal(myN); else if (fld === "topicTitle") setEdVal((dc && dc.topicTitle) || ""); else if (fld === "musicNotes") setEdVal(vd.musicNotes || ""); else if (fld === "stephNotes") setEdVal(cm.stephNotes || ""); else setEdVal((pc && pc[fld]) || ""); setShowEd(true); };
  var saveEd = function() { if (edFld === "notes") setNt(function(p) { var o = Object.assign({}, p); o[pK] = edVal; return o; }); else if (edFld === "topicTitle") setMeta(day, "topicTitle", edVal); else if (edFld === "musicNotes") setVF(day, ver, "musicNotes", edVal); else if (edFld === "stephNotes") setMF("stephNotes", edVal); else { setFld(day, plat, edFld, edVal); } setShowEd(false); flash("Saved"); };
  var edPlatName = aPlat ? aPlat.label : "";
  var edContext = (edFld === "topicTitle" || edFld === "musicNotes" || edFld === "stephNotes" || edFld === "notes") ? (videoTitle || "#" + day) : edPlatName;
  var edCharMax = null;
  if (tpl && edFld) { var tf2 = tpl.find(function(t) { return t.key === edFld; }); if (tf2 && tf2.max) edCharMax = tf2.max; }

  // ---- FB GROUPS ----
  var gd = fbG[dK] || {};
  var addGlobalGrp = function(n) { if (!n || globalGroups.indexOf(n) !== -1) return; setGG(function(p) { return p.concat([n]); }); };
  var removeGlobalGrp = function(i) { setGG(function(p) { var a = p.slice(); a.splice(i, 1); return a; }); };
  var togGrp = function(name, f) { setFbG(function(p) { var c = Object.assign({}, p[dK] || {}); c[name] = Object.assign({ shared: false, pending: false, time: null }, c[name] || {}); c[name][f] = !c[name][f]; if (f === "shared") { if (c[name].shared) { c[name].time = new Date().toLocaleTimeString(); } else { c[name].time = null; } } var o = Object.assign({}, p); o[dK] = c; return o; }); };

  // ---- EXPORT/IMPORT ----
  var doExport = function() { var blob = new Blob([JSON.stringify({ v: 41, content: content, checks: checks, statuses: statuses, notes: notes, verD: verD, media: media, fbG: fbG, globalGroups: globalGroups, timers: timers, dayCount: dayCount, analytics: analytics, streakDates: streakDates }, null, 2)], { type: "application/json" }); var u = URL.createObjectURL(blob); var a = document.createElement("a"); a.href = u; a.download = "TFS_" + new Date().toISOString().slice(0, 10) + ".json"; a.click(); flash("Downloaded"); };
  var doImport = function() { var inp = document.createElement("input"); inp.type = "file"; inp.accept = ".json"; inp.onchange = function(e) { var f = e.target.files[0]; if (!f) return; var r = new FileReader(); r.onload = function(ev) { try { var d = JSON.parse(ev.target.result); if (d.content) setCt(d.content); if (d.checks) setCk(d.checks); if (d.statuses) setSt(d.statuses); if (d.notes) setNt(d.notes); if (d.verD) setVD(d.verD); if (d.media) setMd(d.media); if (d.fbG) setFbG(d.fbG); if (d.globalGroups) setGG(d.globalGroups); if (d.timers) setTm(d.timers); if (d.dayCount) setDayCount(d.dayCount); if (d.analytics) setAnalytics(d.analytics); if (d.streakDates) setStreakDates(d.streakDates); flash("Restored"); } catch (err) { flash("Error"); } }; r.readAsText(f); }; inp.click(); };
  var dlDayMd = function() { var md = exportDayMd(day, content[day]); var blob = new Blob([md], { type: "text/markdown" }); var u = URL.createObjectURL(blob); var a = document.createElement("a"); a.href = u; a.download = "TFS_" + day + ".md"; a.click(); flash("Markdown downloaded"); };
  var dlBlankMd = function() { var md = generateBlankMd(day); var blob = new Blob([md], { type: "text/markdown" }); var u = URL.createObjectURL(blob); var a = document.createElement("a"); a.href = u; a.download = "TFS_" + day + "_template.md"; a.click(); flash("Template downloaded"); };
  var importDayMd = function() { var inp = document.createElement("input"); inp.type = "file"; inp.accept = ".md,.txt,.markdown"; inp.onchange = function(e) { var f = e.target.files[0]; if (!f) return; var r = new FileReader(); r.onload = function(ev) { try { var parsed = parseDayMd(ev.target.result); var targetDay = parsed.dayNum || day; var merged = mergeDayMd(parsed, content[targetDay]); setCt(function(p) { var o = Object.assign({}, p); o[targetDay] = merged; return o; }); if (targetDay !== day) setDay(targetDay); flash("Imported (" + Object.keys(parsed.platforms).length + " platforms)"); } catch (err) { console.error("MD import error:", err); flash("Import error"); } }; r.readAsText(f); }; inp.click(); };
  var quickFill = function(srcDay) { var src = content[srcDay]; if (!src) return; setCt(function(p) { var o = Object.assign({}, p); var dd = Object.assign({ topicTitle: "", contentType: "none", salesy: "none", postTime: "", platforms: {}, shared: {}, indexEvergreen: INDEX_EVERGREEN_DEFAULT, indexTopic: "" }, o[day] || {}); if (src.shared) dd.shared = JSON.parse(JSON.stringify(src.shared)); if (src.platforms) { REAL_PLATFORMS.forEach(function(rp) { if (src.platforms[rp.id]) { dd.platforms = Object.assign({}, dd.platforms); dd.platforms[rp.id] = JSON.parse(JSON.stringify(src.platforms[rp.id])); } }); } dd.contentType = src.contentType || "none"; o[day] = dd; return o; }); flash("Filled from #" + srcDay); };
  var exportDayCopy = function() { var lines = ["=== " + (videoTitle || "#" + day) + " ==="]; if (dc && dc.postTime) lines.push("Post Time: " + dc.postTime); var vda = getVD(day, "a"); if (vda.date) lines.push("Date: " + vda.date); lines.push(""); if (shared) { ["caption", "hashtags", "keywords", "music", "prompt", "title"].forEach(function(f) { if (shared[f]) lines.push("SHARED " + f.toUpperCase() + ": " + shared[f]); }); } lines.push(""); REAL_PLATFORMS.forEach(function(p) { var pcc = dc && dc.platforms && dc.platforms[p.id]; if (!pcc) return; lines.push("--- " + (p.label || "X").toUpperCase() + " ---"); if (pcc.title) lines.push("Title: " + pcc.title); if (pcc.copy) lines.push("Caption: " + pcc.copy); if (pcc.hashtags) lines.push("Hashtags: " + pcc.hashtags); if (pcc.prompt) lines.push("Prompt: " + pcc.prompt); if (pcc.description) lines.push("Description: " + pcc.description); if (pcc.tags) lines.push("Tags: " + pcc.tags); if (pcc.reel_title) lines.push("Reel Title: " + pcc.reel_title); lines.push(""); }); var txt = lines.join("\n"); navigator.clipboard.writeText(txt).then(function() { flash("All copy exported"); }); };

  // ---- SEND POST EMAIL ----
  var sendPostEmail = function(d, platId) { if (!_sb) return; var dc2 = content[d] || {}; var pObj = PLATFORMS.find(function(p) { return p.id === platId; }); _sb.rpc("send_post_email", { day_num: d, plat_name: pObj ? (pObj.label || "X") : "", topic: dc2.topicTitle || "#" + d, remaining_items: "", app_url: "https://rbiehn.github.io/tfs-publish/?day=" + d }).catch(function(err) { console.error("Email error:", err); }); };

  // ---- DAY HELPERS ----
  var dayPct = function(d) { var t = 0, c2 = 0; REAL_PLATFORMS.forEach(function(p) { var pr = countProgress(d, p.id); t += pr.total; c2 += pr.done; }); return t ? Math.round(c2 / t * 100) : 0; };
  var dayAllDone = function(d) { var all = true; REAL_PLATFORMS.forEach(function(p) { if ((statuses["d" + d + "_" + p.id] || "not_started") !== "done") all = false; }); return all; };
  var getCopyDiff = function(d) { var dc2 = content[d]; if (!dc2 || !dc2.shared || !dc2.shared.caption) return []; var base = dc2.shared.caption; var diffs = []; REAL_PLATFORMS.forEach(function(rp) { var pcc = dc2.platforms && dc2.platforms[rp.id]; var platCopy = (pcc && (rp.id === "youtube" ? pcc.description : pcc.copy)) || ""; if (!platCopy) return; if (platCopy === base) diffs.push({ plat: rp, status: "match" }); else diffs.push({ plat: rp, status: "edited", copy: platCopy }); }); return diffs; };
  var titleFor = function(d) { return (content[d] && content[d].topicTitle) || "#" + d; };

  // ---- TIMER ----
  var timerMs = 0; var timerPlat = ""; var timerDay = 0;
  for (var tKey in timers) { if (timers[tKey]) { var remaining = Math.max(0, 3600000 - (Date.now() - timers[tKey])); if (remaining > 0 && remaining > timerMs) { timerMs = remaining; var tParts = tKey.split("_"); timerDay = parseInt(tParts[0].slice(1)); var tPlatId = tParts.slice(1).join("_"); var tPlatObj = PLATFORMS.find(function(p) { return p.id === tPlatId; }); timerPlat = (timerDay !== day ? titleFor(timerDay) + " " : "") + (tPlatObj ? tPlatObj.label : ""); } } }

  // ---- CALENDAR DATA ----
  var calItems = [];
  for (var di = 1; di <= dayCount; di++) { if (!content[di]) continue; VERSIONS.forEach(function(v) { var vdi = verD["d" + di + "_v" + v.id]; if (vdi && vdi.date) calItems.push({ day: di, ver: v.id, vL: v.short, date: vdi.date, topicTitle: titleFor(di), color: v.id === "a" ? "#f97316" : v.id === "b" ? "#a855f7" : "#06b6d4" }); }); }

  // ---- MEDIA QUEUE ----
  var mediaQueue = [];
  for (var qi = 1; qi <= dayCount; qi++) { if (!content[qi]) continue; VERSIONS.forEach(function(v) { var mk = "d" + qi + "_v" + v.id; var mv = media[mk] || {}; var ms = mv.mediaStatus || "no_media"; var hasRaw = !!mv.rawLink; var hasEdit = !!mv.editedLink; if (ms === "no_media" && !hasRaw && !hasEdit) return; var need = ""; if (hasRaw && !hasEdit) need = "Needs editing"; else if (ms === "raw_uploaded") need = "Needs editing"; else if (ms === "in_editing") need = "In progress"; else if (ms === "edited" && !hasEdit) need = "Paste edited link"; else if (ms === "final") return; if (!need && hasRaw && hasEdit) return; if (!need && ms === "edited") return; if (!need) need = "Check status"; mediaQueue.push({ day: qi, ver: v.id, vL: v.short, topicTitle: titleFor(qi), status: ms, need: need, hasRaw: hasRaw, hasEdit: hasEdit }); }); }
  var stephQueueCount = mediaQueue.length;

  // ---- ANALYTICS DATA ----
  var salesyCounts = { none: 0, soft: 0, full: 0 }; var salesyTotal = 0;
  var hashtagUse = {}; COMP_TAGS.forEach(function(h) { hashtagUse[h] = 0; });
  for (var si = 1; si <= dayCount; si++) { var sc2 = content[si]; if (!sc2) continue; var sl = sc2.salesy || "none"; if (sl !== "none") { salesyCounts[sl]++; salesyTotal++; } else if (sc2.topicTitle) { salesyCounts.none++; salesyTotal++; } if (sc2.platforms) { REAL_PLATFORMS.forEach(function(p) { var pp = sc2.platforms[p.id]; if (pp && pp.hashtags) { var ht = pp.hashtags.toLowerCase(); COMP_TAGS.forEach(function(ct) { if (ht.indexOf(ct) !== -1) hashtagUse[ct]++; }); } }); } }

  // ---- TASK FEED DATA ----
  var todayISO = new Date().toISOString().slice(0, 10);
  var todayDow = new Date().getDay();
  var isWeekend = todayDow === 0 || todayDow === 6;
  var todayCItem = calItems.find(function(ci) { return ci.date === todayISO; });
  var taskDay = todayCItem ? todayCItem.day : day;
  var taskVer = todayCItem ? todayCItem.ver : ver;
  var taskDc = content[taskDay] || {};
  var taskSh = taskDc.shared || {};

  var genTasks = function() {
    var tasks = []; var tid = 0;
    var shFields = ["caption", "hashtags", "prompt", "music"];
    var shDone = 0; shFields.forEach(function(f) { if (taskSh[f]) shDone++; });
    tasks.push({ id: tid++, phase: "prep", label: "Prep shared fields (" + shDone + "/" + shFields.length + ")", done: shDone === shFields.length, nav: function() { setDay(taskDay); setPlat("shared"); goTo("publish"); } });
    var mDone = (media["d" + taskDay + "_v" + taskVer] || {}).mediaStatus === "final";
    tasks.push({ id: tid++, phase: "prep", label: "Media v" + taskVer.toUpperCase() + " finalized", done: mDone, nav: function() { setDay(taskDay); setPlat("editing"); goTo("publish"); } });
    REAL_PLATFORMS.filter(function(p) { return p.id !== "fb_groups" && p.id !== "reddit"; }).forEach(function(p) {
      var pSt = statuses["d" + taskDay + "_" + p.id] || "not_started";
      var posted = pSt === "posted" || pSt === "done";
      tasks.push({ id: tid++, phase: "post", label: "Post " + (p.label || "X"), done: posted, icon: p.icon, iconColor: p.color, nav: function() { setDay(taskDay); setPlat(p.id); goTo("publish"); } });
      if (pSt === "posted") { var tmKey = "d" + taskDay + "_" + p.id; var tmVal = timers[tmKey]; var rem = tmVal ? Math.max(0, 3600000 - (Date.now() - tmVal)) : 0; if (rem > 0) { tasks.push({ id: tid++, phase: "live", label: (p.label || "X") + " comments (" + Math.round(rem / 60000) + "m)", done: false, timer: rem, icon: p.icon, iconColor: p.color, nav: function() { setDay(taskDay); setPlat(p.id); goTo("publish"); } }); } }
    });
    var gd4 = fbG["d" + taskDay] || {}; var gDone = globalGroups.filter(function(gn) { return gd4[gn] && gd4[gn].shared; }).length; var gTotal = globalGroups.length;
    if (gTotal > 0) tasks.push({ id: tid++, phase: "followup", label: "Groups batch (" + gDone + "/" + gTotal + ")", done: gDone >= gTotal, nav: function() { setDay(taskDay); setPlat("fb_groups"); goTo("publish"); } });
    var liveTasks = tasks.filter(function(t) { return t.phase === "live"; });
    return { prep: tasks.filter(function(t) { return t.phase === "prep"; }), live: liveTasks, post: tasks.filter(function(t) { return t.phase === "post"; }), followup: tasks.filter(function(t) { return t.phase === "followup"; }), all: tasks };
  };
  var taskData = genTasks();
  var allTasksList = taskData.all;
  var doneCount = allTasksList.filter(function(t) { return t.done; }).length;
  var isPerfectDay = doneCount === allTasksList.length && allTasksList.length > 0;

  // ---- STREAK ----
  var calcStreak = function() { var streak = 0; var d2 = new Date(); d2.setDate(d2.getDate() - 1); for (var i = 0; i < 365; i++) { var dow = d2.getDay(); if (dow === 0 || dow === 6) { d2.setDate(d2.getDate() - 1); continue; } if (streakDates.indexOf(d2.toISOString().slice(0, 10)) !== -1) { streak++; d2.setDate(d2.getDate() - 1); } else break; } return streak; };
  var currentStreak = calcStreak() + (isPerfectDay ? 1 : 0);
  var bestStreak = Math.max(currentStreak, lsLoad("bestStreak", 0));
  useEffect(function() { if (isPerfectDay && streakDates.indexOf(todayISO) === -1) { setStreakDates(function(p) { return p.concat([todayISO]); }); try { localStorage.setItem("tfs_bestStreak", JSON.stringify(Math.max(currentStreak, lsLoad("bestStreak", 0)))); } catch (e) {} } }, [isPerfectDay]);
  var consist = function() { var c2 = 0, t2 = 0; var d3 = new Date(); for (var i = 0; i < 30; i++) { d3.setDate(d3.getDate() - 1); if (d3.getDay() === 0 || d3.getDay() === 6) continue; t2++; if (streakDates.indexOf(d3.toISOString().slice(0, 10)) !== -1) c2++; } return t2 ? Math.round(c2 / t2 * 100) : 0; }();

  // ---- SECTIONS BUILDER (ordered list per platform) ----
  var getSections = function(pid) {
    var secs = [];
    var sc = STORY_CHECKLISTS[pid] || {};
    // YouTube Community Post is the Story 1 equivalent - goes first
    if (pid === "youtube" && CHECKLISTS.yt_community && CHECKLISTS.yt_community.length) secs.push({ key: "ytc", title: "Community Post (pre-post)", color: "#a855f7", items: CHECKLISTS.yt_community, prefix: "ytc_" });
    // Story 1 for non-YouTube platforms
    if (sc.s1 && sc.s1.length) secs.push({ key: "s1", title: "Story 1 (Pre-post)", color: "#a855f7", items: sc.s1, prefix: "s1_" });
    // Main posting steps
    if (CHECKLISTS[pid] && CHECKLISTS[pid].length) secs.push({ key: "post", title: "Posting Steps", color: (aPlat ? aPlat.color : "#888"), items: CHECKLISTS[pid], prefix: "p_" });
    // Post-live stories
    if (sc.s2 && sc.s2.length) secs.push({ key: "s2", title: "Story 2 (After live)", color: "#3b82f6", items: sc.s2, prefix: "s2_" });
    if (sc.s3 && sc.s3.length) secs.push({ key: "s3", title: "Story 3 (Personal)", color: "#22c55e", items: sc.s3, prefix: "s3_" });
    return secs;
  };

  var secDoneCount = function(items, prefix) { var c3 = 0; items.forEach(function(_, i) { if (pCk[prefix + i]) c3++; }); return c3; };

  // Auto-open first incomplete section when platform changes
  useEffect(function() {
    if (isSpecial || plat === "fb_groups") return;
    var secs = getSections(plat);
    var found = false;
    for (var si2 = 0; si2 < secs.length; si2++) {
      if (secDoneCount(secs[si2].items, secs[si2].prefix) < secs[si2].items.length) { setOpenSec(secs[si2].key); found = true; break; }
    }
    if (!found && secs.length) setOpenSec(null);
  }, [plat, day]);

  // ---- COLLAPSIBLE CHECKLIST SECTION RENDERER ----
  function renderCollapsible(sec, secs) {
    if (!sec || !sec.items || !sec.items.length) return null;
    var done = secDoneCount(sec.items, sec.prefix);
    var allChecked = done === sec.items.length;
    var isOpen = openSec === sec.key;

    var onToggle = function() { setOpenSec(isOpen ? null : sec.key); };
    var onCheckAll = function(e) { e.stopPropagation(); checkSection(sec.prefix, sec.items); };

    // After toggling a check, if section just completed, auto-open next
    var onItemClick = function(ck) {
      toggleCk(ck);
      // Defer to let state update
      setTimeout(function() {
        var newChecks = Object.assign({}, pCk);
        newChecks[ck] = !pCk[ck];
        var nowDone = 0; sec.items.forEach(function(_, i) { if (newChecks[sec.prefix + i]) nowDone++; });
        if (nowDone === sec.items.length) {
          // Find next incomplete section
          var idx = -1;
          for (var si3 = 0; si3 < secs.length; si3++) { if (secs[si3].key === sec.key) { idx = si3; break; } }
          for (var si4 = idx + 1; si4 < secs.length; si4++) {
            if (secDoneCount(secs[si4].items, secs[si4].prefix) < secs[si4].items.length) { setOpenSec(secs[si4].key); return; }
          }
          setOpenSec(null); // all done
        }
      }, 50);
    };

    return (
      <div style={{ marginBottom: 8 }}>
        {/* Section header (always visible, tap to expand/collapse) */}
        <div onClick={onToggle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: allChecked ? "#f0fdf420" : isOpen ? sec.color + "08" : "#fff", border: "1px solid " + (allChecked ? "#bbf7d0" : isOpen ? sec.color + "30" : "#eeeef2"), borderRadius: isOpen ? "12px 12px 0 0" : 12, cursor: "pointer", transition: "all 0.15s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <i className={"fa-solid fa-chevron-" + (isOpen ? "down" : "right")} style={{ fontSize: 10, color: sec.color, transition: "transform 0.15s" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: allChecked ? "#22c55e" : sec.color, textTransform: "uppercase", letterSpacing: 0.5 }}>{sec.title}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: allChecked ? "#22c55e" : "#aaa", fontWeight: 600 }}>{done}/{sec.items.length}</span>
            {allChecked && <i className="fa-solid fa-check-circle" style={{ color: "#22c55e", fontSize: 14 }} />}
            {!allChecked && isOpen && <button onClick={onCheckAll} style={{ background: "#f0f0f4", border: "1px solid #d4d4db", borderRadius: 8, padding: "3px 10px", fontSize: 11, color: "#888", cursor: "pointer", fontWeight: 600 }}>All</button>}
          </div>
        </div>
        {/* Expanded items */}
        {isOpen && <div style={{ border: "1px solid " + (sec.color + "30"), borderTop: "none", borderRadius: "0 0 12px 12px", padding: "6px 6px 8px", background: "#fafafa" }}>
          {sec.items.map(function(it, i) { var ck = sec.prefix + i; var itemDone = !!pCk[ck]; return (
            <div key={ck} onClick={function() { onItemClick(ck); }} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 10px", marginBottom: 2, background: itemDone ? "#f0fdf4" : "#fff", border: "1px solid " + (itemDone ? "#bbf7d0" : "#eeeef2"), borderRadius: 10, cursor: "pointer", transition: "all 0.1s", userSelect: "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, border: "2px solid " + (itemDone ? "#22c55e" : "#ccc"), background: itemDone ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{itemDone && <i className="fa-solid fa-check" style={{ color: "#fff", fontSize: 9 }} />}</div>
              <span style={{ fontSize: 13, color: itemDone ? "#999" : "#333", textDecoration: itemDone ? "line-through" : "none", lineHeight: 1.4 }}>{it}</span>
            </div>
          ); })}
        </div>}
      </div>
    );
  }

  // ---- OLD renderSteps kept for non-platform use (editing tab) ----
  function renderSteps(title, color, items, prefix) {
    if (!items || !items.length) return null;
    var secDone2 = 0; items.forEach(function(_, i) { if (pCk[prefix + i]) secDone2++; });
    var allChecked = secDone2 === items.length;
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, marginTop: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: 0.5 }}>{title} <span style={{ color: allChecked ? "#22c55e" : "#aaa" }}>({secDone2}/{items.length})</span></span>
          <button onClick={function() { checkSection(prefix, items); }} style={{ background: allChecked ? "#22c55e18" : "#f0f0f4", border: "1px solid " + (allChecked ? "#22c55e40" : "#d4d4db"), borderRadius: 10, padding: "6px 12px", fontSize: 11, color: allChecked ? "#22c55e" : "#888", cursor: "pointer", fontWeight: 600 }}>{allChecked ? "Uncheck" : "All"}</button>
        </div>
        {items.map(function(it, i) { var ck = prefix + i; var done = !!pCk[ck]; return (
          <div key={ck} onClick={function() { toggleCk(ck); }} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", marginBottom: 4, background: done ? "#f0fdf4" : "#fff", border: "1px solid " + (done ? "#bbf7d0" : "#eeeef2"), borderRadius: 12, cursor: "pointer", transition: "all 0.15s", userSelect: "none", boxShadow: done ? "none" : "0 1px 3px #00000006" }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, border: "2px solid " + (done ? "#22c55e" : "#ccc"), background: done ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "all 0.15s" }}>{done && <i className="fa-solid fa-check" style={{ color: "#fff", fontSize: 10 }} />}</div>
            <span style={{ fontSize: 14, color: done ? "#999" : "#333", textDecoration: done ? "line-through" : "none", lineHeight: 1.45 }}>{it}</span>
          </div>
        ); })}
      </div>
    );
  }

  // ---- LOADING ----
  if (!loaded) return (
    <div className="tfs-app" style={S.ctn}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #fb923c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className="fa-solid fa-fire" style={{ color: "#fff", fontSize: 20 }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.5, color: "#f97316" }}>TFS PUBLISH</span>
        <span style={{ fontSize: 12, color: "#999" }}>Loading...</span>
      </div>
    </div>
  );

  // ==================================================================
  // TASK FEED VIEW
  // ==================================================================
  if (view === "tasks") {
    var wkDays = []; var wkD = new Date(); var wkStart = new Date(wkD); wkStart.setDate(wkStart.getDate() - (wkD.getDay() || 7) + 1);
    for (var wi = 0; wi < 7; wi++) { var wd = new Date(wkStart); wd.setDate(wkStart.getDate() + wi); var wds = wd.toISOString().slice(0, 10); var wkDone = streakDates.indexOf(wds) !== -1; var isToday2 = wds === todayISO; wkDays.push({ date: wds, day: ["M", "T", "W", "T", "F", "S", "S"][wi], done: wkDone, today: isToday2, weekend: wi >= 5 }); }

    var renderPhase = function(label, color, tasks2) {
      if (!tasks2 || !tasks2.length) return null;
      var phaseDone = tasks2.every(function(t) { return t.done; });
      return (
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 0 10px" }}>
            <div style={{ height: 1, flex: 1, background: color + "30" }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: color, letterSpacing: 1.5, textTransform: "uppercase" }}>{label}{phaseDone ? " \u2713" : ""}</span>
            <div style={{ height: 1, flex: 1, background: color + "30" }} />
          </div>
          {tasks2.map(function(t) { return (
            <div key={t.id} onClick={t.nav} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", marginBottom: 6, background: t.done ? "#f8faf8" : t.timer ? "#f0f7ff" : "#fff", border: "1px solid " + (t.done ? "#dcfce7" : t.timer ? "#bfdbfe" : "#eeeef2"), borderRadius: 16, cursor: "pointer", opacity: t.done ? 0.75 : 1, transition: "all 0.15s", boxShadow: t.done ? "none" : "0 1px 4px #00000006" }}>
              {t.done
                ? <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className="fa-solid fa-check" style={{ color: "#fff", fontSize: 11 }} /></div>
                : <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid " + (t.timer ? "#3b82f6" : "#d4d4db"), background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t.icon && <i className={t.icon} style={{ fontSize: 11, color: t.iconColor || "#bbb" }} />}</div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.done ? "#aaa" : "#222" }}>{t.label}</div>
              </div>
              {t.timer && <span style={{ fontSize: 15, fontWeight: 800, color: "#3b82f6", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{Math.round(t.timer / 60000)}m</span>}
              {!t.done && !t.timer && <i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: "#d4d4db", flexShrink: 0 }} />}
              {t.done && <i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: "#ddd", flexShrink: 0 }} />}
            </div>
          ); })}
        </div>
      );
    };

    var progressPct = allTasksList.length ? Math.round(doneCount / allTasksList.length * 100) : 0;

    return (
      <div className="tfs-app" style={S.ctn}>
        <div style={{ padding: "24px 22px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #fb923c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 800, color: "#fff", boxShadow: "0 4px 12px #f9731640" }}>R</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.2 }}>Hey, Robert</div>
              <div style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{titleFor(taskDay)}{taskDc.postTime ? " \u00b7 " + taskDc.postTime : ""}{getVD(taskDay, "a").date ? " \u00b7 " + fmtD(getVD(taskDay, "a").date) : ""}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #fff7ed, #fef3c7)", border: "1px solid #fed7aa", borderRadius: 14, padding: "8px 12px", boxShadow: "0 2px 8px #f9731615" }}>
              <i className="fa-solid fa-fire" style={{ color: "#f97316", fontSize: 18 }} />
              <span style={{ fontSize: 17, fontWeight: 800, color: "#f97316" }}>{currentStreak}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 16 }}>
            {[{l:"Publish",v:"publish",ic:"fa-solid fa-paper-plane"},{l:"Calendar",v:"calendar",ic:"fa-solid fa-calendar-days"},{l:"Dashboard",v:"dashboard",ic:"fa-solid fa-grip"},{l:"Queue",v:"queue",ic:"fa-solid fa-pen"},{l:"Reference",v:"reference",ic:"fa-solid fa-circle-question"}].map(function(b){ return <button key={b.v} onClick={function(){goTo(b.v);}} style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:10,padding:"6px 10px",fontSize:11,color:"#777",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:4}}><i className={b.ic} style={{fontSize:11}}/>{b.l}</button>;})}
          </div>

          <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
            {wkDays.map(function(wd2, i) { return <div key={i} style={{ flex: 1, textAlign: "center", padding: "6px 0", borderRadius: 10, background: wd2.today ? "#f9731618" : wd2.done ? "#f0fdf4" : "transparent", border: "1px solid " + (wd2.today ? "#f97316" : wd2.done ? "#bbf7d0" : "transparent"), opacity: wd2.weekend ? 0.4 : 1 }}><div style={{ fontSize: 11, fontWeight: 700, color: wd2.today ? "#f97316" : "#999" }}>{wd2.day}</div>{wd2.done && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", margin: "3px auto 0" }} />}</div>; })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 10, background: "#f0f0f4", borderRadius: 5, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 5, width: progressPct + "%", background: isPerfectDay ? "#22c55e" : "linear-gradient(90deg, #f97316, #fb923c)", transition: "width 0.5s" }} /></div>
            <span style={{ fontSize: 15, fontWeight: 800, color: isPerfectDay ? "#22c55e" : "#f97316" }}>{progressPct}%</span>
          </div>

          {renderPhase("Prep", "#f97316", taskData.prep)}
          {renderPhase("Post", "#3b82f6", taskData.post)}
          {renderPhase("Live", "#a855f7", taskData.live)}
          {renderPhase("Follow-up", "#22c55e", taskData.followup)}

          <div style={{ padding: "30px 0 60px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#ccc" }}>v46 \u00b7 Best streak: {bestStreak} \u00b7 30d: {consist}%</div>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================================
  // CALENDAR VIEW
  // ==================================================================
  if (view === "calendar") {
    var yr = calMo.y, mo = calMo.m;
    var firstDay = new Date(yr, mo, 1).getDay();
    var daysInMonth = new Date(yr, mo + 1, 0).getDate();
    var cells2 = [];
    for (var ci2 = 0; ci2 < firstDay; ci2++) cells2.push(<div key={"e" + ci2} />);
    for (var cd = 1; cd <= daysInMonth; cd++) { var cds = yr + "-" + String(mo + 1).padStart(2, "0") + "-" + String(cd).padStart(2, "0"); var cItems = calItems.filter(function(ci3) { return ci3.date === cds; }); var isToday3 = cds === todayISO; cells2.push(<div key={cd} style={{ border: "1px solid " + (isToday3 ? "#f97316" : "#eeeef2"), borderRadius: 8, padding: 3, minHeight: 50, background: isToday3 ? "#f9731608" : "#fff", fontSize: 10 }}><div style={{ fontWeight: 700, color: isToday3 ? "#f97316" : "#888" }}>{cd}</div>{cItems.map(function(ci4, j) { return <div key={j} onClick={function() { setDay(ci4.day); setVer(ci4.ver); goTo("publish"); }} style={{ background: ci4.color + "22", color: ci4.color, borderRadius: 4, padding: "1px 3px", fontSize: 9, fontWeight: 700, marginTop: 1, cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ci4.vL}: {ci4.topicTitle}</div>; })}</div>); }
    return (<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Back</button><span style={S.topT}>CALENDAR</span><div style={{width:50}}/></div>
      <div style={{padding:"12px 14px 80px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <button onClick={function(){setCalMo(function(p){var nm=p.m-1,ny=p.y;if(nm<0){nm=11;ny--;}return{y:ny,m:nm};});}} style={S.back}>{"\u2039"}</button>
          <span style={{fontSize:15,fontWeight:700,color:"#444"}}>{MONTHS[mo]} {yr}</span>
          <button onClick={function(){setCalMo(function(p){var nm=p.m+1,ny=p.y;if(nm>11){nm=0;ny++;}return{y:ny,m:nm};});}} style={S.back}>{"\u203a"}</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>{WDAYS.map(function(w,i){return <div key={i} style={{textAlign:"center",fontSize:11,fontWeight:700,color:"#aaa",padding:3}}>{w}</div>;})}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>{cells2}</div>
      </div>
    </div>);
  }

  // ==================================================================
  // DASHBOARD VIEW
  // ==================================================================
  if (view === "dashboard") {
    var cells3 = [];
    for (var ddi = 1; ddi <= dayCount; ddi++) { var ddTitle = titleFor(ddi); cells3.push(<div key={"r"+ddi} style={{fontSize:12,fontWeight:700,color:"#444",padding:"4px 2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"flex",alignItems:"center"}}><span style={{fontSize:10,color:"#aaa",marginRight:4}}>#{ddi}</span>{ddTitle.length>12?ddTitle.slice(0,12)+"...":ddTitle}</div>); REAL_PLATFORMS.forEach(function(p){var k2="d"+ddi+"_"+p.id;var ss2=statuses[k2]||"not_started";cells3.push(<div key={k2} onClick={function(){setDay(ddi);setPlat(p.id);goTo("publish");}} style={{background:ST_C[ss2]+"22",border:"1px solid "+ST_C[ss2]+"44",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:4}}><div style={{width:8,height:8,borderRadius:"50%",background:ST_C[ss2]}}/></div>);});}
    return(<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Home</button><span style={S.topT}>DASHBOARD</span><div style={{display:"flex",gap:4}}><button onClick={function(){if(dayCount<MAX_DAYS){setDayCount(dayCount+7);flash("Added 7");}}} style={{background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:8,padding:"6px 10px",fontSize:12,color:"#888",cursor:"pointer",fontWeight:600}}>+7</button></div></div>
      <div style={{padding:"12px 8px 80px",overflowX:"auto"}}><div style={{display:"grid",gridTemplateColumns:"80px repeat("+REAL_PLATFORMS.length+",1fr)",gap:2,minWidth:400}}>
        <div style={{fontSize:10,fontWeight:700,color:"#aaa",padding:3}}>Title</div>
        {REAL_PLATFORMS.map(function(p){return <div key={p.id} style={{fontSize:11,textAlign:"center"}}><i className={p.icon} style={{color:p.color,fontSize:12}}/></div>;})}
        {cells3}
      </div></div>
    </div>);
  }

  // ==================================================================
  // CROSS-VIEW
  // ==================================================================
  if (view === "crossview") { return (<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Back</button><span style={S.topT}>{videoTitle || "#" + day} CROSS</span><div style={{width:50}}/></div>
    <div style={{padding:"18px 20px 80px"}}>{REAL_PLATFORMS.map(function(p){var pcc=content[day]&&content[day].platforms&&content[day].platforms[p.id],cp=(pcc&&(p.id==="youtube"?pcc.description:pcc.copy))||"",fl=scanAlgo(cp);return(<div key={p.id} style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:8,boxShadow:"0 1px 4px #00000006"}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><i className={p.icon} style={{fontSize:16,color:p.color}}/><span style={{fontSize:14,fontWeight:700,color:"#444",flex:1}}>{p.label}</span><span style={{fontSize:11,color:"#aaa"}}>{cp.length}ch</span><button onClick={function(){setPlat(p.id);goTo("publish");}} style={{background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:8,padding:"6px 10px",fontSize:12,color:"#888",cursor:"pointer"}}>Edit</button><CopyBtn text={cp}/></div><div style={{fontSize:13,color:"#777",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{cp||"(empty)"}</div>{fl.length>0&&<div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:5}}>{fl.map(function(f,i){return <span key={i} style={{background:"#fef2f2",color:"#dc2626",padding:"2px 6px",borderRadius:4,fontSize:11}}>{f.word}</span>;})}</div>}</div>);})}</div>
  </div>);}

  // ==================================================================
  // COPY DIFF VIEW
  // ==================================================================
  if (view === "copydiff") { var diffs = getCopyDiff(day); return (<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Back</button><span style={S.topT}>COPY DIFF</span><div style={{width:50}}/></div>
    <div style={{padding:"18px 20px 80px"}}>{diffs.length===0?<div style={{textAlign:"center",padding:40,color:"#aaa"}}>No platform captions to compare. Fill shared caption first.</div>:diffs.map(function(d2,i){return <div key={i} style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><i className={d2.plat.icon} style={{fontSize:14,color:d2.plat.color}}/><span style={{fontSize:13,fontWeight:700,color:"#444"}}>{d2.plat.label}</span><span style={{fontSize:11,color:d2.status==="match"?"#22c55e":"#f59e0b",fontWeight:600,background:d2.status==="match"?"#f0fdf4":"#fff7ed",padding:"1px 6px",borderRadius:4}}>{d2.status==="match"?"Matches shared":"Edited"}</span></div>{d2.copy&&<div style={{fontSize:12,color:"#666",whiteSpace:"pre-wrap"}}>{d2.copy}</div>}</div>;})}</div>
  </div>);}

  // ==================================================================
  // ANALYTICS VIEW
  // ==================================================================
  if (view === "analytics") { var rawData = analytics.raw || []; return (<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Back</button><span style={S.topT}>ANALYTICS</span><div style={{width:50}}/></div>
    <div style={{padding:"18px 20px 80px"}}><div style={{fontSize:13,color:"#888",marginBottom:12}}>{rawData.length} rows imported</div><button onClick={function(){ var inp=document.createElement("input");inp.type="file";inp.accept=".csv";inp.onchange=function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){try{var lines=ev.target.result.split("\n");var headers=lines[0].split(",").map(function(h){return h.trim().toLowerCase();});var rows=[];for(var i=1;i<lines.length;i++){if(!lines[i].trim())continue;var cols=lines[i].split(",");var row={};headers.forEach(function(h,j){row[h]=cols[j]?cols[j].trim():"";});rows.push(row);}setAnalytics(function(p){var o=Object.assign({},p);o.raw=(o.raw||[]).concat(rows);o.lastImport=new Date().toISOString();return o;});flash("Imported "+rows.length+" rows");}catch(err){flash("CSV error");}};r.readAsText(f);};inp.click();}} style={{background:"#f97316",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer"}}>Import CSV</button></div>
  </div>);}

  // ==================================================================
  // EDIT QUEUE VIEW
  // ==================================================================
  if (view === "queue") { return (<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Back</button><span style={S.topT}>EDIT QUEUE</span><div style={{width:50}}/></div>
    <div style={{padding:"18px 20px 80px"}}>
      <div style={{fontSize:13,color:"#888",marginBottom:12}}>Media needing attention across all content pieces and versions</div>
      {mediaQueue.length===0?<div style={{textAlign:"center",padding:40,color:"#aaa"}}>All clear. No media needs attention.</div>:mediaQueue.map(function(q,i){return <div key={i} onClick={function(){setDay(q.day);setVer(q.ver);setPlat("editing");goTo("publish");}} style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10,boxShadow:"0 1px 4px #00000006"}}>
        <div style={{width:8,height:36,borderRadius:4,background:M_ST_C[q.status],flexShrink:0}}/>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><span style={{fontSize:14,fontWeight:700,color:"#444"}}>{q.topicTitle} / v{q.vL}</span><span style={{fontSize:11,background:M_ST_C[q.status]+"22",color:M_ST_C[q.status],padding:"1px 6px",borderRadius:4,fontWeight:600}}>{M_ST_L[q.status]}</span></div>
          <div style={{fontSize:12,color:q.need==="Needs editing"?"#f59e0b":"#999",fontWeight:600,marginTop:2}}>{q.need}</div>
        </div>
      </div>;})}
    </div>
  </div>);}

  // ==================================================================
  // REFERENCE VIEW
  // ==================================================================
  if (view === "reference") { return (<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Back</button><span style={S.topT}>REFERENCE</span><div style={{width:50}}/></div>
    <div style={{padding:"18px 20px 80px"}}>
      <div style={S.refSec}><div style={S.refT}>Salesy Frequency</div>{SALESY_LEVELS.map(function(s,i){var cnt=salesyCounts[s.id]||0;var pctVal=salesyTotal?Math.round(cnt/salesyTotal*100):0;return <div key={i} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:700,color:"#444"}}>{s.label}</span><span style={{fontSize:12,color:s.color,fontWeight:600}}>{cnt} ({pctVal}%) target: {s.target}</span></div><div style={{height:8,background:"#f0f0f4",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,width:pctVal+"%",background:s.color,transition:"width 0.3s"}}/></div></div>;})}</div>
      <div style={S.refSec}><div style={S.refT}>YouTube Universal Tags</div><div style={{fontSize:12,color:"#666",background:"#fff",borderRadius:10,padding:12,lineHeight:1.8,border:"1px solid #eeeef2",cursor:"pointer"}} onClick={function(){navigator.clipboard.writeText(YT_UNIVERSAL_TAGS).then(function(){flash("Tags copied");});}}>{YT_UNIVERSAL_TAGS}<div style={{fontSize:11,color:"#aaa",marginTop:6}}>Tap to copy. 30 tags, ~493 chars.</div></div></div>
      <div style={S.refSec}><div style={S.refT}>FB Groups Protocol</div><div style={{fontSize:12,color:"#666",background:"#fff",borderRadius:10,padding:12,lineHeight:1.8,border:"1px solid #eeeef2"}}>{Object.keys(FB_GROUPS_PROTOCOL).map(function(k,i){return <div key={i}><span style={{fontWeight:700,textTransform:"capitalize"}}>{k}:</span> {FB_GROUPS_PROTOCOL[k]}</div>;})}</div></div>
      <div style={S.refSec}><div style={S.refT}>Who Posts Where</div>{REAL_PLATFORMS.map(function(p,i){return <div key={i} style={S.refR}><span style={{fontSize:12,fontWeight:700,color:p.color,minWidth:80}}>{p.label||"X"}</span><span style={{fontSize:13,color:"#444"}}>{p.by} via {p.via}</span></div>;})}</div>
      <div style={S.refSec}><div style={S.refT}>Scheduling</div>{Object.keys(SCHED_NOTES).map(function(k,i){var pObj=PLATFORMS.find(function(p){return p.id===k;});return <div key={i} style={S.refR}><span style={{fontSize:12,fontWeight:700,color:pObj?pObj.color:"#444",minWidth:80}}>{pObj?(pObj.label||"X"):k}</span><span style={{fontSize:12,color:"#666"}}>{SCHED_NOTES[k]}</span></div>;})}</div>
      <div style={S.refSec}><div style={S.refT}>Trending Audio</div><div style={{fontSize:12,color:"#777",background:"#fff",borderRadius:10,padding:12,lineHeight:1.8,border:"1px solid #eeeef2"}}>{"Supported: TikTok, Instagram, YouTube, Facebook (Personal + Page)\nNot supported: X, Reddit\nNote: Instagram auto-mutes original audio when trending audio is added\nAll stories: trending music at 3% volume, even on static images"}</div></div>
      <div style={S.refSec}><div style={S.refT}>Algospeak</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{ALGO_WORDS.map(function(w,i){return <span key={i} style={{background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",padding:"4px 8px",borderRadius:6,fontSize:11}}>{w} {"\u2192"} {(ALGO_SAFE[w]||"").split("/")[0]}</span>;})}</div></div>
      <div style={S.refSec}><div style={S.refT}>Voice</div><div style={{fontSize:13,color:"#777",whiteSpace:"pre-wrap",background:"#fff",borderRadius:10,padding:12,lineHeight:1.7,border:"1px solid #eeeef2"}}>{"\"debut YA fantasy novel\"\n\"comes out Fall 2026\"\n\"500+ page book\"\n\"My wife and I\"\n\"8 years\"\nNo em dashes\nNo emojis TikTok/X\nNo ! in hooks\nSharing energy, not selling energy\nOne CTA per post, matched to content energy"}</div></div>
    </div>
  </div>);}

  // ==================================================================
  // MAIN PUBLISH VIEW
  // ==================================================================
  return(<div className="tfs-app" style={S.ctn}>
    <div style={S.hdr}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px 6px"}}>
        <button onClick={function(){goTo("tasks");}} style={{background:"none",border:"none",display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:0}}>
          <i className="fa-solid fa-fire" style={{fontSize:16,color:"#f97316"}}/>
          <span style={{fontSize:15,fontWeight:800,letterSpacing:3,color:"#f97316"}}>TFS PUBLISH</span>
        </button>
        <div style={{display:"flex",gap:3,alignItems:"center"}}>
          <button title="Tasks" onClick={function(){goTo("tasks");}} style={Object.assign({},S.hBtn,{background:"#f9731620",border:"1px solid #f97316",color:"#f97316"})}><i className="fa-solid fa-list-check" style={{fontSize:14}}/></button>
          <button title="Edit Queue" onClick={function(){goTo("queue");}} style={Object.assign({},S.hBtn,{position:"relative"})}><i className="fa-solid fa-pen" style={{fontSize:12}}/>{stephQueueCount>0&&<span style={{position:"absolute",top:-3,right:-3,background:"#ef4444",color:"#fff",fontSize:10,fontWeight:800,borderRadius:8,padding:"1px 4px",minWidth:12,textAlign:"center"}}>{stephQueueCount}</span>}</button>
          <button onClick={function(){setShowMore(!showMore);}} style={S.hBtn}><i className="fa-solid fa-ellipsis" style={{fontSize:14}}/></button>
        </div>
      </div>
      {showMore&&<div style={{padding:"4px 16px 8px",display:"flex",gap:3,flexWrap:"wrap"}}>
        <button onClick={function(){goTo("calendar");setShowMore(false);}} style={S.moreBtn}><i className="fa-solid fa-calendar-days" style={{fontSize:11,marginRight:4}}/>Calendar</button>
        <button onClick={function(){goTo("dashboard");setShowMore(false);}} style={S.moreBtn}><i className="fa-solid fa-grip" style={{fontSize:11,marginRight:4}}/>Dashboard</button>
        <button onClick={function(){goTo("crossview");setShowMore(false);}} style={S.moreBtn}><i className="fa-solid fa-arrows-left-right" style={{fontSize:11,marginRight:4}}/>Cross-view</button>
        <button onClick={function(){goTo("copydiff");setShowMore(false);}} style={S.moreBtn}><i className="fa-solid fa-code-compare" style={{fontSize:11,marginRight:4}}/>Copy Diff</button>
        <button onClick={function(){goTo("reference");setShowMore(false);}} style={S.moreBtn}><i className="fa-solid fa-circle-question" style={{fontSize:11,marginRight:4}}/>Reference</button>
        <button onClick={function(){doImport();setShowMore(false);}} style={S.moreBtn}><i className="fa-solid fa-folder-open" style={{fontSize:11,marginRight:4}}/>Import</button>
        <button onClick={function(){doExport();setShowMore(false);}} style={S.moreBtn}><i className="fa-solid fa-download" style={{fontSize:11,marginRight:4}}/>Export</button>
        <button onClick={function(){importDayMd();setShowMore(false);}} style={S.moreBtn}><i className="fa-solid fa-file-import" style={{fontSize:11,marginRight:4}}/>Import MD</button>
        <button onClick={function(){dlDayMd();setShowMore(false);}} style={S.moreBtn}><i className="fa-solid fa-file-arrow-down" style={{fontSize:11,marginRight:4}}/>Export MD</button>
        <button onClick={function(){exportDayCopy();setShowMore(false);}} style={S.moreBtn}><i className="fa-solid fa-copy" style={{fontSize:11,marginRight:4}}/>Copy All</button>
        {day>1&&<button onClick={function(){quickFill(day-1);setShowMore(false);}} style={S.moreBtn}><i className="fa-solid fa-clone" style={{fontSize:11,marginRight:4}}/>Fill from #{day-1}</button>}
      </div>}
      {timerMs>0&&<div style={{margin:"0 12px",padding:"8px 14px",background:timerMs<300000?"#ef444418":"#3b82f620",border:"1px solid "+(timerMs<300000?"#ef444444":"#3b82f650"),borderRadius:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:timerMs<300000?"#ef4444":"#3b82f6"}}><i className="fa-solid fa-stopwatch" style={{marginRight:6}}/>{timerPlat} Comments</span><span style={{fontSize:20,fontWeight:800,color:timerMs<300000?"#ef4444":"#3b82f6",fontVariantNumeric:"tabular-nums"}}>{fmtTimer(timerMs)}</span></div>}

      {/* CONTENT PIECE SELECTOR */}
      <div style={{display:"flex",alignItems:"center",padding:"8px 8px",gap:3}}>
        <button onClick={function(){setDay(Math.max(1,day-1));setShowDelDay(false);}} style={S.dArr}>{"\u2039"}</button>
        <button onClick={function(){setShowDP(!showDP);}} style={S.dDisp}>
          <span style={{fontSize:15,fontWeight:800,color:"#f97316"}}>{videoTitle || "(untitled #" + day + ")"}{dayAllDone(day)?" \u2713":""}</span>
          <span style={{fontSize:12,color:"#777"}}>{schedDate}{dc&&dc.postTime?" \u00b7 "+dc.postTime:""}</span>
          <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:2}}>
            {cType&&cType.id!=="none"&&<span style={{fontSize:10,background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:4,padding:"1px 5px",color:"#666"}}>{cType.label}</span>}
            {sLevel&&sLevel.id!=="none"&&<span style={{fontSize:10,background:sLevel.color+"18",border:"1px solid "+sLevel.color+"33",borderRadius:4,padding:"1px 5px",color:sLevel.color}}>{sLevel.label}</span>}
          </div>
        </button>
        <button onClick={function(){setDay(Math.min(dayCount,day+1));setShowDelDay(false);}} style={S.dArr}>{"\u203a"}</button>
      </div>
      {showDP&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:3,padding:"4px 12px 8px"}}>{Array.from({length:dayCount},function(_,i){return i+1;}).map(function(d){var t3=titleFor(d);return <button key={d} onClick={function(){setDay(d);setShowDP(false);}} style={{background:d===day?"#f9731620":"#fff",border:"1px solid "+(d===day?"#f97316":"#eeeef2"),borderRadius:8,padding:"6px 4px",cursor:"pointer",textAlign:"left",opacity:content[d]?1:0.35}}><div style={{fontSize:12,fontWeight:700,color:dayAllDone(d)?"#22c55e":"#444",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t3}</div><div style={{fontSize:10,color:"#aaa"}}>{dayPct(d)}%</div></button>;})}</div>}

      {/* VERSION TABS */}
      <div style={{display:"flex",gap:3,padding:"4px 12px",overflowX:"auto"}}>{VERSIONS.map(function(v2){var vdi=getVD(day,v2.id);var vmk="d"+day+"_v"+v2.id;var vms=(media[vmk]||{}).mediaStatus||"no_media";return <button key={v2.id} onClick={function(){setVer(v2.id);}} style={{background:ver===v2.id?"#f9731620":"#fff",border:"1px solid "+(ver===v2.id?"#f97316":"#eeeef2"),borderRadius:10,padding:"9px 12px",fontSize:12,color:ver===v2.id?"#f97316":"#999",cursor:"pointer",flex:1,textAlign:"center",fontWeight:700,display:"flex",flexDirection:"column",alignItems:"center",gap:2,position:"relative"}}><span>{v2.label}</span>{vdi.date&&<span style={{fontSize:10,color:"#888"}}>{fmtD(vdi.date)}</span>}<span style={{width:7,height:7,borderRadius:"50%",background:M_ST_C[vms],position:"absolute",top:3,right:3}}/></button>;})}</div>

      {/* PLATFORM TABS */}
      <div style={{display:"flex",overflowX:"auto",padding:"0 6px",gap:1}}>{PLATFORMS.map(function(p,pi){var k2="d"+day+"_"+p.id,ss=p.special?null:(statuses[k2]||"not_started"),isA=plat===p.id;var showDiv=p.special&&pi===1;return <React.Fragment key={p.id}><button onClick={function(){setPlat(p.id);}} style={{background:"none",border:"none",borderBottom:"2px solid "+(isA?p.color:"transparent"),padding:"10px 12px 12px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:48,flexShrink:0,position:"relative"}}><i className={p.icon} style={{fontSize:16,color:isA?p.color:"#aaa"}}/><span style={{fontSize:12,fontWeight:700,color:isA?p.color:"#aaa"}}>{p.label}</span>{ss&&<span style={{width:8,height:8,borderRadius:"50%",background:ST_C[ss],position:"absolute",top:4,right:4}}/>}</button>{showDiv&&<div style={{width:1,background:"#d4d4db",margin:"6px 2px",flexShrink:0}}/>}</React.Fragment>;})}</div>
    </div>

    <div style={{padding:"18px 20px 120px"}}>

      {/* ============================================ */}
      {/* SHARED TAB */}
      {/* ============================================ */}
      {plat==="shared"&&<div>

        {/* Video Title (inline) */}
        <div style={S.tf}>
          <span style={{fontSize:12,fontWeight:700,color:"#444",marginBottom:4,display:"block"}}>Video Title</span>
          <input type="text" value={videoTitle} onChange={function(e){setMeta(day,"topicTitle",e.target.value);}} placeholder="What this piece is called in Canva or Filmora" style={Object.assign({},S.mI,{fontSize:16,fontWeight:700})}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
          <div><span style={{fontSize:12,fontWeight:700,color:"#444"}}>Content Type</span><select value={(dc&&dc.contentType)||"none"} onChange={function(e){setMeta(day,"contentType",e.target.value);}} style={S.dIn}>{CONTENT_TYPES.map(function(c){return <option key={c.id} value={c.id}>{c.label}</option>;})}</select></div>
          <div><span style={{fontSize:12,fontWeight:700,color:"#444"}}>Salesy</span><select value={(dc&&dc.salesy)||"none"} onChange={function(e){setMeta(day,"salesy",e.target.value);}} style={S.dIn}>{SALESY_LEVELS.map(function(s){return <option key={s.id} value={s.id}>{s.label}</option>;})}</select></div>
          <div><span style={{fontSize:12,fontWeight:700,color:"#444"}}>Post Time</span><input type="time" value={(dc&&dc.postTime)||""} onChange={function(e){setMeta(day,"postTime",e.target.value);}} style={S.dIn}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          <div><span style={{fontSize:12,fontWeight:700,color:"#444"}}>vA Date</span><input type="date" value={getVD(day,"a").date||""} onChange={function(e){onADate(day,e.target.value);}} style={S.dIn}/></div>
          <div><span style={{fontSize:12,fontWeight:700,color:"#444"}}>vA Time</span><input type="time" value={getVD(day,"a").time||""} onChange={function(e){setVF(day,"a","time",e.target.value);}} style={S.dIn}/></div>
        </div>

        {/* Caption */}
        <div style={S.tf}>
          <span style={{fontSize:13,fontWeight:700,color:"#555",marginBottom:4,display:"block"}}>Caption</span>
          <AutoTextarea value={shared.caption||""} onChange={function(e){setShared("caption",e.target.value);}} placeholder="Base caption for all platforms" style={Object.assign({},S.mI,{minHeight:60})}/>
          <AlgoW flags={scanAlgo(shared.caption||"")}/>
        </div>

        {/* Hashtags */}
        <div style={S.tf}>
          <span style={{fontSize:13,fontWeight:700,color:"#555",marginBottom:4,display:"block"}}>Hashtags</span>
          <AutoTextarea value={shared.hashtags||""} onChange={function(e){setShared("hashtags",e.target.value);}} placeholder="4 total: 1 anchor + 1-2 genre + 0-1 comp" style={Object.assign({},S.mI,{minHeight:44})}/>
        </div>

        {/* Prompt / CTA Question */}
        <div style={S.tf}>
          <span style={{fontSize:13,fontWeight:700,color:"#555",marginBottom:4,display:"block"}}>Prompt / CTA Question</span>
          <AutoTextarea value={shared.prompt||""} onChange={function(e){setShared("prompt",e.target.value);}} placeholder="Engagement question. Used as IG comment prompt." style={Object.assign({},S.mI,{minHeight:44})}/>
        </div>

        {/* Music */}
        <div style={S.tf}>
          <span style={{fontSize:13,fontWeight:700,color:"#555",marginBottom:4,display:"block"}}>Music / Trending Sound</span>
          <AutoTextarea value={shared.music||""} onChange={function(e){setShared("music",e.target.value);}} placeholder="Mood, what to search for, trending sound name..." style={Object.assign({},S.mI,{minHeight:44})}/>
        </div>

        {/* On-Screen Indexing (= Keywords, auto-pushed to all) */}
        <div style={S.tf}>
          <span style={{fontSize:13,fontWeight:700,color:"#555",marginBottom:2,display:"block"}}>On-Screen Indexing</span>
          <div style={{fontSize:11,color:"#aaa",marginBottom:8}}>Two phrases baked into every video. Push All sends these as keywords to all platforms.</div>
          <div style={{marginBottom:8}}><span style={{fontSize:12,fontWeight:600,color:"#666"}}>Evergreen</span><input type="text" value={(dc&&dc.indexEvergreen)||INDEX_EVERGREEN_DEFAULT} onChange={function(e){setMeta(day,"indexEvergreen",e.target.value);}} style={S.mI}/></div>
          <div><span style={{fontSize:12,fontWeight:600,color:"#666"}}>Topic</span><input type="text" value={(dc&&dc.indexTopic)||""} onChange={function(e){setMeta(day,"indexTopic",e.target.value);}} placeholder="e.g. book to screen, fantasy worldbuilding" style={S.mI}/></div>
        </div>

        {/* Related Video (shared, not per-platform) */}
        <div style={S.tf}>
          <span style={{fontSize:13,fontWeight:700,color:"#555",marginBottom:4,display:"block"}}>Related Video</span>
          <input type="text" value={shared.relatedVideo||""} onChange={function(e){setShared("relatedVideo",e.target.value);}} placeholder="Which content piece connects to this one" style={S.mI}/>
        </div>

        {/* PUSH ALL BUTTON */}
        {(function(){
          var shFields = ["caption","hashtags","prompt","music"];
          var filledCount = 0; shFields.forEach(function(f) { if (shared[f]) filledCount++; });
          var indexVal = ((dc&&dc.indexEvergreen)||INDEX_EVERGREEN_DEFAULT) + "\n" + ((dc&&dc.indexTopic)||"");
          var doPushAll = function() {
            var pushTargets = ["tiktok","instagram","youtube","fb_page","x"];
            var allTargets = ["tiktok","instagram","youtube","fb_page","fb_personal","x"];
            if (shared.caption) pushTargets.forEach(function(pid) {
              // YouTube uses 'description', all others use 'copy'
              var fieldKey = pid === "youtube" ? "description" : "copy";
              setFld(day, pid, fieldKey, shared.caption);
            });
            if (shared.hashtags) pushTargets.forEach(function(pid) { setFld(day, pid, "hashtags", shared.hashtags); });
            if (shared.prompt) { setFld(day, "instagram", "prompt", shared.prompt); }
            if (shared.music) TRENDING_PLATFORMS.forEach(function(pid) { setFld(day, pid, "musicNote", shared.music); });
            allTargets.forEach(function(pid) { setFld(day, pid, "keywords", indexVal.trim()); });
            setFld(day, "youtube", "tags", YT_UNIVERSAL_TAGS);
            flash("Pushed to all platforms");
          };
          return <div style={{marginBottom:8}}>
            <button onClick={doPushAll} style={{width:"100%",background:"#f97316",border:"none",borderRadius:14,padding:"14px",fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <i className="fa-solid fa-paper-plane"/><span>Push All to Platforms</span>
            </button>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:8}}>
              {shFields.map(function(f){var filled = !!shared[f]; return <span key={f} style={{fontSize:11,fontWeight:600,color:filled?"#22c55e":"#ccc"}}>{filled?"\u2713":"\u25cb"} {f}</span>;})}
              <span style={{fontSize:11,fontWeight:600,color:(dc&&dc.indexTopic)?"#22c55e":"#ccc"}}>{(dc&&dc.indexTopic)?"\u2713":"\u25cb"} indexing</span>
            </div>
          </div>;
        })()}

        {/* Per-platform reminders */}
        <div style={{background:"#f4f4f8",border:"1px solid #eeeef2",borderRadius:12,padding:"10px 14px",marginTop:8}}>
          <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:6}}>After push, customize per platform:</div>
          <div style={{fontSize:12,color:"#666",lineHeight:1.7}}>
            <span style={{color:"#E1306C",fontWeight:600}}>IG:</span> Shorten caption, add "link in bio" CTA<br/>
            <span style={{color:"#4267B2",fontWeight:600}}>FB Pers:</span> Rewrite in casual voice, drop hashtags/CTAs<br/>
            <span style={{color:"#FF0000",fontWeight:600}}>YT:</span> Add title, description, tags<br/>
            <span style={{color:"#1877F2",fontWeight:600}}>FB Page:</span> Add reel title<br/>
            <span style={{color:"#444",fontWeight:600}}>X:</span> Trim to 280ch, set screenshot, exactly 2 hashtags
          </div>
        </div>
      </div>}

      {/* ============================================ */}
      {/* EDITING TAB */}
      {/* ============================================ */}
      {plat==="editing"&&<div>
        <div style={{background:"#2563eb10",border:"1px solid #2563eb30",borderRadius:14,padding:12,marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:800,color:"#2563eb",marginBottom:4}}>Editing v{ver.toUpperCase()}</div>
          <div style={{fontSize:12,color:"#777"}}>Video source: Talking head = Filmora via Google Drive. Everything else = Canva.</div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:13,fontWeight:700,color:"#a855f7",textTransform:"uppercase",letterSpacing:0.5}}>Steph's Section</span></div>
          {EDITING_CL.steph.map(function(it,i){var ck="steph_"+i;var done=!!editCk[ck];return <div key={ck} onClick={function(){toggleEditCk(ck);}} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",marginBottom:6,background:done?"#f0fdf4":"#fff",border:"1px solid "+(done?"#bbf7d0":"#eeeef2"),borderRadius:14,cursor:"pointer",boxShadow:done?"none":"0 1px 4px #00000006"}}><div style={{width:28,height:28,borderRadius:8,border:"2px solid "+(done?"#22c55e":"#ccc"),background:done?"#22c55e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{done&&<i className="fa-solid fa-check" style={{color:"#fff",fontSize:12}}/>}</div><span style={{fontSize:15,color:done?"#999":"#333",textDecoration:done?"line-through":"none",lineHeight:1.4}}>{it}</span></div>;})}
        </div>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:13,fontWeight:700,color:"#f97316",textTransform:"uppercase",letterSpacing:0.5}}>Robert's Section</span></div>
          {EDITING_CL.robert.map(function(it,i){var ck="robert_"+i;var done=!!editCk[ck];return <div key={ck} onClick={function(){toggleEditCk(ck);}} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",marginBottom:6,background:done?"#f0fdf4":"#fff",border:"1px solid "+(done?"#bbf7d0":"#eeeef2"),borderRadius:14,cursor:"pointer",boxShadow:done?"none":"0 1px 4px #00000006"}}><div style={{width:28,height:28,borderRadius:8,border:"2px solid "+(done?"#22c55e":"#ccc"),background:done?"#22c55e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{done&&<i className="fa-solid fa-check" style={{color:"#fff",fontSize:12}}/>}</div><span style={{fontSize:15,color:done?"#999":"#333",textDecoration:done?"line-through":"none",lineHeight:1.4}}>{it}</span></div>;})}
        </div>
        {/* Media Pipeline */}
        <div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}>
          <div style={{fontSize:14,fontWeight:700,color:"#444",marginBottom:12}}>Media Pipeline (v{ver.toUpperCase()})</div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}><div style={{width:10,height:10,borderRadius:"50%",background:M_ST_C[cm.mediaStatus||"no_media"]}}/><span style={{fontSize:13,fontWeight:600,color:"#666"}}>{M_ST_L[cm.mediaStatus||"no_media"]}</span></div>
          <div style={{marginBottom:12}}><span style={S.mL}>Raw Footage (Google Drive)</span><input type="text" value={cm.rawLink||""} onChange={function(e){setMF("rawLink",e.target.value);}} placeholder="Paste link or upload..." style={S.mI}/>{cm.rawLink&&<a href={cm.rawLink} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#2563eb",textDecoration:"none",marginTop:2,display:"inline-block"}}>Open</a>}<UploadBtn day={day} ver={ver} slot="raw" accept="video/*" fileName={cm.rawFileName} fileSize={cm.rawFileSize} onUploaded={function(url,name,size){setMF("rawLink",url);setMF("rawFileName",name);setMF("rawFileSize",size);}} onDelete={function(){setMF("rawLink","");setMF("rawFileName","");setMF("rawFileSize",0);flash("Deleted");}}/></div>
          <div style={{marginBottom:12}}><span style={S.mL}>Edited (no music)</span><input type="text" value={cm.editedNoMusicLink||""} onChange={function(e){setMF("editedNoMusicLink",e.target.value);}} placeholder="Paste edited link..." style={S.mI}/></div>
          <div style={{marginBottom:12}}><span style={S.mL}>Edited (with music)</span><input type="text" value={cm.editedLink||""} onChange={function(e){setMF("editedLink",e.target.value);}} placeholder="Paste edited link..." style={S.mI}/></div>
          <div onClick={function(){setMF("stephReady",!cm.stephReady);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:cm.stephReady?"#a855f710":"#fff",border:"1px solid "+(cm.stephReady?"#a855f740":"#eeeef2"),borderRadius:14,cursor:"pointer",marginBottom:8}}>
            <div style={{width:24,height:24,borderRadius:8,border:"2px solid "+(cm.stephReady?"#a855f7":"#ccc"),background:cm.stephReady?"#a855f7":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{cm.stephReady&&<i className="fa-solid fa-check" style={{color:"#fff",fontSize:11}}/>}</div>
            <span style={{fontSize:13,fontWeight:600,color:cm.stephReady?"#a855f7":"#555"}}>Steph: Ready for Review</span>
          </div>
          <div onClick={function(){setMF("robertApproved",!cm.robertApproved);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:cm.robertApproved?"#f0fdf4":"#fff",border:"1px solid "+(cm.robertApproved?"#bbf7d0":"#eeeef2"),borderRadius:14,cursor:"pointer",marginBottom:12}}>
            <div style={{width:24,height:24,borderRadius:8,border:"2px solid "+(cm.robertApproved?"#22c55e":"#ccc"),background:cm.robertApproved?"#22c55e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{cm.robertApproved&&<i className="fa-solid fa-check" style={{color:"#fff",fontSize:11}}/>}</div>
            <span style={{fontSize:13,fontWeight:600,color:cm.robertApproved?"#22c55e":"#555"}}>Robert: Approved</span>
          </div>
          <div style={{marginBottom:12}}><span style={S.mL}>Final Export</span><input type="text" value={cm.finalLink||""} onChange={function(e){setMF("finalLink",e.target.value);}} placeholder="Paste final link..." style={S.mI}/></div>
          <div style={{marginBottom:12}}><span style={S.mL}>Cover Image</span><input type="text" value={cm.coverLink||""} onChange={function(e){setMF("coverLink",e.target.value);}} placeholder="Paste image link..." style={S.mI}/>{cm.coverLink&&isImgUrl(cm.coverLink)&&<div style={{marginTop:8,borderRadius:10,overflow:"hidden",border:"1px solid #d4d4db",maxWidth:200}}><img src={cm.coverLink} alt="Cover" style={{width:"100%",display:"block"}} onError={function(e){e.target.style.display="none";}}/></div>}</div>
        </div>
      </div>}

      {/* ============================================ */}
      {/* PLATFORM TABS: SINGLE TOP-TO-BOTTOM FLOW */}
      {/* ============================================ */}
      {!isSpecial&&plat!=="fb_groups"&&(function(){
        var platSections = getSections(plat);
        var copyCaption = (pc && (plat === "youtube" ? pc.description : pc.copy)) || "";
        var copyHashtags = (pc && pc.hashtags) || "";
        return <div>
        {/* STATUS BAR */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <button onClick={function(){setShowConfirm(true);}} style={{border:"none",borderRadius:10,padding:"7px 14px",fontSize:12,fontWeight:800,color:"#fff",cursor:"pointer",textTransform:"uppercase",letterSpacing:0.5,background:ST_C[st]}}>{ST_L[st]}</button>
          <div style={{flex:1,height:8,background:"#f0f0f4",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,width:prog.pct+"%",background:aPlat?aPlat.color:"#f97316",transition:"width 0.3s"}}/></div>
          <span style={{fontSize:12,color:"#999",fontWeight:600}}>{prog.done}/{prog.total}</span>
          <button onClick={resetCk} style={{background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:8,padding:"4px 8px",fontSize:11,color:"#999",cursor:"pointer"}}>Reset</button>
        </div>

        {/* STATUS CHANGE */}
        {showConfirm&&<div style={{background:"#fff",border:"1px solid #d4d4db",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 2px 8px #00000010"}}>
          <div style={{fontSize:14,fontWeight:700,color:"#222",marginBottom:10}}>Change status to:</div>
          <div style={{display:"flex",gap:6}}>{["not_started","drafted","posted","done"].map(function(s){return <button key={s} onClick={function(){setSt(function(p){var o=Object.assign({},p);o[pK]=s;return o;});if(s==="posted"){setTm(function(p){var o=Object.assign({},p);o[pK]=Date.now();return o;});sendPostEmail(day,plat);flash("Timer started");}else if(s==="done"){var nxt=REAL_PLATFORMS.find(function(p2){return p2.id!==plat&&p2.id!=="fb_groups"&&p2.id!=="reddit"&&(statuses["d"+day+"_"+p2.id]||"not_started")!=="done";});if(nxt){setPlat(nxt.id);flash("\u2713 Done. Next: "+nxt.label);}else{flash("\u2713 All platforms done!");}}else{flash(ST_L[s]);}setShowConfirm(false);}} style={{flex:1,background:s===st?ST_C[s]+"33":ST_C[s]+"11",border:"2px solid "+(s===st?ST_C[s]:ST_C[s]+"44"),borderRadius:10,padding:"8px 4px",fontSize:11,fontWeight:700,color:ST_C[s],cursor:"pointer",textTransform:"uppercase"}}>{ST_L[s]}</button>;})}</div>
          <button onClick={function(){setShowConfirm(false);}} style={{width:"100%",marginTop:8,background:"none",border:"1px solid #eeeef2",borderRadius:10,padding:"6px",fontSize:12,color:"#999",cursor:"pointer"}}>Cancel</button>
        </div>}

        {/* READY TO POST PROMPT */}
        {!showConfirm&&prog.pct===100&&st!=="done"&&st!=="posted"&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:"8px 12px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,color:"#22c55e",fontWeight:600}}>Checklist complete. Ready to post?</span><button onClick={function(){setShowConfirm(true);}} style={{background:"#22c55e",border:"none",borderRadius:8,padding:"4px 12px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer"}}>Set Status</button></div>}

        {/* COPY FIELDS (always at top for grab-and-go) */}
        {tpl&&tpl.length>0&&<div style={{marginBottom:12}}>
          {tpl.map(function(f){var val=(pc&&pc[f.key])||"";return <div key={f.key} style={{background:"#fff",border:"1px solid "+(val?"#eeeef2":"#f59e0b40"),borderRadius:12,padding:"10px 12px",marginBottom:6,boxShadow:"0 1px 3px #00000006"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,fontWeight:700,color:"#555"}}>{f.label}</span>
              <div style={{display:"flex",gap:4}}>
                <button onClick={function(){openEd(f.key);}} style={S.eBtn}>Edit</button>
                {val&&<button onClick={function(){navigator.clipboard.writeText(val).then(function(){flash(f.label+" copied");});}} style={{background:aPlat?aPlat.color:"#f97316",border:"none",borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer"}}>Copy</button>}
              </div>
            </div>
            {f.hint&&<div style={{fontSize:11,color:"#aaa",marginTop:2}}>{f.hint}</div>}
            {val?<div onClick={function(){navigator.clipboard.writeText(val).then(function(){flash(f.label+" copied");});}} style={{fontSize:13,color:"#2d2d3d",whiteSpace:"pre-wrap",wordBreak:"break-word",lineHeight:1.45,cursor:"pointer",borderRadius:8,padding:4,marginTop:4,background:"#fafafa"}}>{val}</div>
            :<div style={{fontSize:12,color:"#ccc",fontStyle:"italic",marginTop:4}}>Not set. Tap Edit to add.</div>}
            {val&&f.max&&<div style={{fontSize:11,color:val.length>f.max?"#ef4444":"#aaa",marginTop:2}}>{val.length}/{f.max}</div>}
          </div>;})}
        </div>}

        {/* YOUTUBE TAGS (collapsible, pre-filled with universal tags) */}
        {plat==="youtube"&&(function(){
          var tagsVal = (pc && pc.tags) || YT_UNIVERSAL_TAGS;
          return <div style={{marginBottom:12}}>
            <div onClick={function(){setShowTags(!showTags);}} style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:showTags?"12px 12px 0 0":12,padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <i className={"fa-solid fa-chevron-"+(showTags?"down":"right")} style={{fontSize:10,color:"#999"}}/>
                <span style={{fontSize:13,fontWeight:700,color:"#555"}}>Tags</span>
                <span style={{fontSize:11,color:"#aaa"}}>26 universal tags (auto-applied)</span>
              </div>
              <button onClick={function(e){e.stopPropagation();navigator.clipboard.writeText(tagsVal).then(function(){flash("Tags copied");});}} style={{background:"#FF0000",border:"none",borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer"}}>Copy</button>
            </div>
            {showTags&&<div style={{background:"#fafafa",border:"1px solid #eeeef2",borderTop:"none",borderRadius:"0 0 12px 12px",padding:"10px 12px"}}>
              <div style={{fontSize:12,color:"#666",lineHeight:1.6,marginBottom:8}}>{tagsVal}</div>
              <div style={{display:"flex",gap:4}}>
                <button onClick={function(){openEd("tags");}} style={S.eBtn}>Edit</button>
                <button onClick={function(){setFld(day,"youtube","tags","");flash("Reset to defaults");}} style={{background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:10,padding:"5px 14px",fontSize:12,color:"#888",cursor:"pointer",fontWeight:600}}>Reset</button>
              </div>
            </div>}
          </div>;
        })()}

        {/* PRE-POST REMINDER (Story 1 or YT Community Post) */}
        {(function(){
          var sc=STORY_CHECKLISTS[plat]||{};
          var isYT = plat==="youtube";
          var preItems = isYT ? (CHECKLISTS.yt_community||[]) : (sc.s1||[]);
          var prePrefix = isYT ? "ytc_" : "s1_";
          var preLabel = isYT ? "Community Post goes out before your main upload" : "Story 1 goes out before your main post";
          var preSub = isYT ? "Post the Community Post first, then come back for the upload" : "Post Story 1 first, then come back for posting steps";
          if(!preItems.length)return null;
          var preDone=secDoneCount(preItems,prePrefix)===preItems.length;
          if(preDone)return null;
          var preKey = isYT ? "ytc" : "s1";
          return <div onClick={function(){setOpenSec(preKey);}} style={{background:"#a855f708",border:"2px solid #a855f740",borderRadius:12,padding:"10px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
            <i className="fa-solid fa-bell" style={{color:"#a855f7",fontSize:16}}/>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#a855f7"}}>{preLabel}</div><div style={{fontSize:11,color:"#888"}}>{preSub}</div></div>
            <i className="fa-solid fa-chevron-down" style={{color:"#a855f7",fontSize:11}}/>
          </div>;
        })()}

        {/* COLLAPSIBLE SECTIONS (correct order: S1 > Post > YTC > S2 > S3) */}
        {platSections.map(function(sec) { return <div key={sec.key}>{renderCollapsible(sec, platSections)}</div>; })}

        {/* NOTES */}
        <div style={{marginTop:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:13,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:0.5}}>Notes</span><button onClick={function(){openEd("notes");}} style={S.eBtn}>Edit</button></div>
          <div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,minHeight:40}}>{myN?<div style={{fontSize:13,color:"#666",whiteSpace:"pre-wrap"}}>{myN}</div>:<div style={{fontSize:12,color:"#bbb",fontStyle:"italic"}}>No notes</div>}</div>
        </div>

        {/* FLOATING COPY BAR */}
        {(copyCaption||copyHashtags)&&<div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:150,display:"flex",justifyContent:"center"}}><div style={{display:"flex",gap:6,padding:"10px 16px 14px",background:"#ffffffee",borderTop:"1px solid #eeeef2",backdropFilter:"blur(12px)",maxWidth:880,width:"100%",justifyContent:"center"}}>
          {copyCaption&&<button onClick={function(){navigator.clipboard.writeText(copyCaption).then(function(){flash((plat==="youtube"?"Description":"Caption")+" copied");});}} style={{background:aPlat?aPlat.color:"#f97316",border:"none",borderRadius:10,padding:"8px 18px",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer",flex:1,maxWidth:200}}><i className="fa-solid fa-copy" style={{marginRight:5}}/>{plat==="youtube"?"Desc":"Caption"}</button>}
          {copyHashtags&&<button onClick={function(){navigator.clipboard.writeText(copyHashtags).then(function(){flash("Hashtags copied");});}} style={{background:"#2563eb",border:"none",borderRadius:10,padding:"8px 18px",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer",flex:1,maxWidth:200}}><i className="fa-solid fa-hashtag" style={{marginRight:5}}/>Tags</button>}
          {pc&&pc.title&&<button onClick={function(){navigator.clipboard.writeText(pc.title).then(function(){flash("Title copied");});}} style={{background:"#666",border:"none",borderRadius:10,padding:"8px 14px",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer"}}><i className="fa-solid fa-heading" style={{marginRight:5}}/>Title</button>}
        </div></div>}
      </div>;})()}

      {/* ============================================ */}
      {/* FB GROUPS TAB */}
      {/* ============================================ */}
      {plat==="fb_groups"&&<div>
        <div style={{background:"#3b599810",border:"1px solid #3b599830",borderRadius:14,padding:12,marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:800,color:"#3b5998",marginBottom:4}}>FB Groups (Miza, next day)</div>
          <div style={{fontSize:12,color:"#666",lineHeight:1.6}}>
            {FB_GROUPS_PROTOCOL.source}<br/>
            {FB_GROUPS_PROTOCOL.timing}<br/>
            {FB_GROUPS_PROTOCOL.pace}<br/>
            {FB_GROUPS_PROTOCOL.safety}
          </div>
        </div>
        <div style={{marginBottom:12}}>
          <span style={{fontSize:13,fontWeight:700,color:"#444",marginBottom:6,display:"block"}}>Groups ({globalGroups.length})</span>
          <div style={{display:"flex",gap:4,marginBottom:8}}>
            <input type="text" placeholder="Add group name..." style={Object.assign({},S.mI,{flex:1})} id="addGroupInput" onKeyDown={function(e){if(e.key==="Enter"){addGlobalGrp(e.target.value.trim());e.target.value="";}}}/>
            <button onClick={function(){var inp=document.getElementById("addGroupInput");if(inp&&inp.value.trim()){addGlobalGrp(inp.value.trim());inp.value="";}}} style={{background:"#3b5998",border:"none",borderRadius:10,padding:"10px 16px",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer"}}>Add</button>
          </div>
          {globalGroups.map(function(gn,gi){var gs=gd[gn]||{};return <div key={gi} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",marginBottom:4,background:gs.shared?"#f0fdf4":"#fff",border:"1px solid "+(gs.shared?"#bbf7d0":"#eeeef2"),borderRadius:12}}>
            <div onClick={function(){togGrp(gn,"shared");}} style={{width:24,height:24,borderRadius:6,border:"2px solid "+(gs.shared?"#22c55e":"#ccc"),background:gs.shared?"#22c55e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}>{gs.shared&&<i className="fa-solid fa-check" style={{color:"#fff",fontSize:10}}/>}</div>
            <span style={{fontSize:13,color:gs.shared?"#22c55e":"#444",fontWeight:600,flex:1}}>{gn}</span>
            {gs.time&&<span style={{fontSize:11,color:"#aaa"}}>{gs.time}</span>}
            {gs.pending&&<span style={{fontSize:10,background:"#f59e0b22",color:"#f59e0b",padding:"1px 5px",borderRadius:4,fontWeight:600}}>Pending</span>}
            <button onClick={function(){if(delGrpIdx===gi){removeGlobalGrp(gi);setDelGrp(null);}else{setDelGrp(gi);}}} style={{background:"none",border:"none",color:delGrpIdx===gi?"#ef4444":"#ccc",fontSize:14,cursor:"pointer"}}>{delGrpIdx===gi?"\u2713 Remove":"\u2715"}</button>
          </div>;})}
          {globalGroups.length>0&&<div style={{fontSize:12,color:"#aaa",marginTop:8}}>Shared: {globalGroups.filter(function(gn){return gd[gn]&&gd[gn].shared;}).length}/{globalGroups.length}</div>}
        </div>
      </div>}

      {/* DELETE CONTENT PIECE */}
      <div style={{borderTop:"1px solid #eeeef2",paddingTop:16,marginTop:16}}>
        {!showDelDay?<button onClick={function(){setShowDelDay(true);}} style={{width:"100%",background:"#fff",border:"1px solid #ef444440",borderRadius:12,padding:"10px",fontSize:13,color:"#ef4444",cursor:"pointer",fontWeight:600}}>Delete #{day}</button>
        :<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:14,padding:14}}>
          <div style={{fontSize:13,fontWeight:700,color:"#dc2626",marginBottom:8}}>Delete all content for #{day}?</div>
          <div style={{fontSize:12,color:"#999",marginBottom:12}}>This removes video title, captions, checklists, statuses, media links, and notes for all platforms and versions. Cannot be undone.</div>
          <div style={{display:"flex",gap:8}}><button onClick={deleteDay} style={{flex:1,background:"#ef4444",border:"none",borderRadius:10,padding:"10px",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer"}}>Yes, Delete</button><button onClick={function(){setShowDelDay(false);}} style={{flex:1,background:"#f0f0f4",border:"none",borderRadius:10,padding:"10px",fontSize:13,fontWeight:600,color:"#666",cursor:"pointer"}}>Cancel</button></div>
        </div>}
      </div>
    </div>

    {/* EDITOR MODAL */}
    {showEd&&<div onClick={function(e){if(e.target===e.currentTarget)setShowEd(false);}} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.4)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}><div style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:880,maxHeight:"80vh",display:"flex",flexDirection:"column",paddingBottom:"env(safe-area-inset-bottom)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px 12px",borderBottom:"1px solid #eeeef2"}}><div><span style={{fontSize:17,fontWeight:700,color:"#222"}}>{edContext}</span><span style={{fontSize:14,color:"#999",marginLeft:8}}>{edFld}{edCharMax?" ("+edCharMax+" max)":""}</span></div><button onClick={function(){setShowEd(false);}} style={{background:"#f0f0f4",border:"none",borderRadius:10,color:"#888",fontSize:16,cursor:"pointer",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2715"}</button></div>
      <textarea value={edVal} onChange={function(e){setEdVal(e.target.value);}} style={{flex:1,background:"#fff",border:"none",color:"#2d2d3d",fontSize:16,lineHeight:1.7,padding:20,resize:"none",minHeight:180,outline:"none",fontFamily:"inherit"}} autoFocus/>
      <AlgoW flags={scanAlgo(edVal)}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 20px 18px",borderTop:"1px solid #eeeef2"}}><span style={{fontSize:13,color:edCharMax&&edVal.length>edCharMax?"#ef4444":"#aaa",fontWeight:600}}>{edVal.length}ch{edCharMax?" / "+edCharMax:""}</span><button onClick={saveEd} style={{background:"#f97316",border:"none",borderRadius:10,padding:"8px 20px",fontSize:14,fontWeight:700,color:"#fff",cursor:"pointer"}}>Save</button></div>
    </div></div>}

    {/* TOAST */}
    {toast&&<div style={{position:"fixed",bottom:60,left:"50%",transform:"translateX(-50%)",background:"#22c55e",color:"#fff",padding:"10px 24px",borderRadius:14,fontSize:15,fontWeight:700,zIndex:300,boxShadow:"0 4px 20px #00000066"}}>{toast}</div>}
  </div>);
}

// ---- STYLES ----
var S = {
  ctn: { fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',system-ui,sans-serif", background: "#f4f4f8", color: "#1a1a1a", minHeight: "100vh", margin: "0 auto", position: "relative" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #eeeef2", position: "sticky", top: 0, zIndex: 100, background: "#f4f4f8f0", backdropFilter: "blur(20px)" },
  back: { background: "none", border: "none", color: "#f97316", fontSize: 16, cursor: "pointer", fontWeight: 700 },
  topT: { fontSize: 14, fontWeight: 800, letterSpacing: 2.5, color: "#888" },
  hdr: { position: "sticky", top: 0, zIndex: 100, background: "#f4f4f8f0", borderBottom: "1px solid #eeeef2", backdropFilter: "blur(20px)" },
  hBtn: { background: "#fff", border: "1px solid #eeeef2", color: "#777", borderRadius: 10, width: 36, height: 36, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", boxShadow: "0 1px 4px #00000006" },
  dArr: { background: "none", border: "none", color: "#aaa", fontSize: 30, cursor: "pointer", padding: "8px 12px" },
  dDisp: { flex: 1, background: "#fff", border: "1px solid #eeeef2", borderRadius: 14, padding: "8px 12px", cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", gap: 3, boxShadow: "0 1px 4px #00000006" },
  dIn: { background: "#fff", border: "1px solid #d4d4db", borderRadius: 12, color: "#333", padding: "10px 12px", fontSize: 15, width: "100%", boxSizing: "border-box" },
  tf: { marginBottom: 16, padding: "14px 16px", background: "#fff", borderRadius: 16, border: "1px solid #eeeef2", transition: "border-color 0.15s", boxShadow: "0 1px 4px #00000006" },
  tfH: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  tfL: { fontSize: 14, fontWeight: 700, color: "#444" },
  tfV: { fontSize: 15, color: "#2d2d3d", lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word" },
  tfE: { fontSize: 14, color: "#bbb", fontStyle: "italic" },
  eBtn: { background: "#f0f0f4", border: "1px solid #d4d4db", borderRadius: 10, padding: "5px 14px", fontSize: 12, color: "#777", cursor: "pointer", fontWeight: 600, transition: "all 0.15s" },
  mL: { fontSize: 14, fontWeight: 700, color: "#444", display: "block", marginBottom: 6 },
  mI: { background: "#fff", border: "1px solid #d4d4db", borderRadius: 12, color: "#333", padding: "10px 14px", fontSize: 15, width: "100%", boxSizing: "border-box", transition: "border-color 0.15s" },
  refSec: { marginBottom: 24 },
  refT: { fontSize: 15, fontWeight: 800, color: "#f97316", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #eeeef2" },
  refR: { display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid #f4f4f8" },
  refTy: { fontSize: 13, fontWeight: 700, color: "#444", minWidth: 80 },
  moreBtn: { background: "#fff", border: "1px solid #eeeef2", borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 600, color: "#666", cursor: "pointer", display: "flex", alignItems: "center" },
};

var root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
