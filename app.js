/* TFS PUBLISH | app.js | Version 37 | March 13, 2026 */

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
  var _tab = useState("auto"), tab = _tab[0], setTab = _tab[1];
  var _to = useState(""), toast = _to[0], setToast = _to[1];
  var _cm = useState("month"), calMode = _cm[0], setCalMode = _cm[1];
  var _cmo = useState({ y: new Date().getFullYear(), m: new Date().getMonth() }), calMo = _cmo[0], setCalMo = _cmo[1];
  var _dc = useState(14), dayCount = _dc[0], setDayCount = _dc[1];
  var _cf = useState(false), showConfirm = _cf[0], setShowConfirm = _cf[1];
  var _msc = useState(false), showMSC = _msc[0], setShowMSC = _msc[1];
  var _delGrp = useState(null), delGrpIdx = _delGrp[0], setDelGrp = _delGrp[1];
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
  useEffect(function() { var params = new URLSearchParams(window.location.search); var pDay = params.get("day"); var pVer = params.get("ver"); var pTab = params.get("tab"); if (pDay) setDay(parseInt(pDay)); if (pVer) setVer(pVer); if (pTab) setTab(pTab); if (pDay || pVer || pTab) window.history.replaceState({}, "", window.location.pathname); }, []);

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
  var cl = CHECKLISTS[plat], tpl = TEMPLATES[plat];
  var st = statuses[pK] || "not_started", myN = notes[pK] || "";
  var pCk = checks[pK] || {}, vd = verD[vK] || {}, cm = media[vK] || {};
  var aPlat = PLATFORMS.find(function(p) { return p.id === plat; });
  var isSpecial = aPlat && aPlat.special;
  var shared = (dc && dc.shared) || {};
  var stories = (dc && dc.stories) || {};
  var cType = CONTENT_TYPES.find(function(c) { return c.id === (dc && dc.contentType || "none"); });
  var sLevel = SALESY_LEVELS.find(function(s) { return s.id === (dc && dc.salesy || "none"); });
  var eTab = tab === "auto" ? (pc && pc.copy ? "checklist" : "template") : tab;

  // ---- HELPERS ----
  var flash = function(m) { setToast(m); setTimeout(function() { setToast(""); }, 2000); };

  var setShared = function(f, v) { setCt(function(p) { var dd = Object.assign({ topicTitle: "", contentType: "none", salesy: "none", postTime: "", platforms: {}, shared: {}, stories: {} }, p[day] || {}); dd.shared = Object.assign({}, dd.shared || {}); dd.shared[f] = v; var o = Object.assign({}, p); o[day] = dd; return o; }); };
  var pushShared = function(field, platField) { var val = shared[field] || ""; if (!val) { flash("Nothing to push"); return; } var targets = (shared[field + "Push"] || []); if (!targets.length) { flash("No platforms checked"); return; } targets.forEach(function(pid) { setFld(day, pid, platField, val); }); flash("Pushed to " + targets.length + " platforms"); };
  var togSharedPush = function(field, pid) { setCt(function(p) { var dd = Object.assign({ topicTitle: "", contentType: "none", salesy: "none", postTime: "", platforms: {}, shared: {}, stories: {} }, p[day] || {}); dd.shared = Object.assign({}, dd.shared || {}); var arr = (dd.shared[field + "Push"] || []).slice(); var idx = arr.indexOf(pid); if (idx === -1) arr.push(pid); else arr.splice(idx, 1); dd.shared[field + "Push"] = arr; var o = Object.assign({}, p); o[day] = dd; return o; }); };
  var setStoryField = function(sKey, f, v) { setCt(function(p) { var dd = Object.assign({ topicTitle: "", contentType: "none", salesy: "none", postTime: "", platforms: {}, shared: {}, stories: {} }, p[day] || {}); dd.stories = Object.assign({}, dd.stories || {}); dd.stories[sKey] = Object.assign({}, dd.stories[sKey] || {}); dd.stories[sKey][f] = v; var o = Object.assign({}, p); o[day] = dd; return o; }); };
  var togStoryPost = function(sKey, pid) { setCt(function(p) { var dd = Object.assign({ topicTitle: "", contentType: "none", salesy: "none", postTime: "", platforms: {}, shared: {}, stories: {} }, p[day] || {}); dd.stories = Object.assign({}, dd.stories || {}); dd.stories[sKey] = Object.assign({}, dd.stories[sKey] || {}); var pt = Object.assign({}, dd.stories[sKey].postTo || {}); pt[pid] = !pt[pid]; dd.stories[sKey].postTo = pt; var o = Object.assign({}, p); o[day] = dd; return o; }); };
  var togScriptPlat = function(pid) { setCt(function(p) { var dd = Object.assign({ topicTitle: "", contentType: "none", salesy: "none", postTime: "", platforms: {}, shared: {}, stories: {} }, p[day] || {}); var arr = (dd.scriptPlats || []).slice(); var idx = arr.indexOf(pid); if (idx === -1) arr.push(pid); else arr.splice(idx, 1); dd.scriptPlats = arr; var o = Object.assign({}, p); o[day] = dd; return o; }); };
  var editCkKey = "d" + day + "_editing_v" + ver;
  var editCk = checks[editCkKey] || {};
  var toggleEditCk = function(id) { setCk(function(p) { var o = Object.assign({}, p); o[editCkKey] = Object.assign({}, o[editCkKey] || {}); o[editCkKey][id] = !o[editCkKey][id]; return o; }); };

  var setFld = function(d, pl, f, v) { setCt(function(p) { var dd = Object.assign({ topicTitle: "", contentType: "none", salesy: "none", postTime: "", platforms: {}, shared: {}, stories: {} }, p[d] || {}); dd.platforms = Object.assign({}, dd.platforms); dd.platforms[pl] = Object.assign({}, dd.platforms[pl] || {}); dd.platforms[pl][f] = v; var o = Object.assign({}, p); o[d] = dd; return o; }); };
  var setMeta = function(d, f, v) { setCt(function(p) { var dd = Object.assign({ topicTitle: "", contentType: "none", salesy: "none", postTime: "", platforms: {}, shared: {}, stories: {} }, p[d] || {}); dd[f] = v; var o = Object.assign({}, p); o[d] = dd; return o; }); };
  var getVD = function(d, v) { return verD["d" + d + "_v" + v] || {}; };
  var setVF = function(d, v, f, val) { var k2 = "d" + d + "_v" + v; setVD(function(p) { var o = Object.assign({}, p); o[k2] = Object.assign({}, o[k2] || {}); o[k2][f] = val; return o; }); };
  var _notifySent = {};
  var sendNotify = function(type, d, v) { var nk = type + "_d" + d + "_v" + v; if (_notifySent[nk]) return; _notifySent[nk] = true; if (!_sb) return; _sb.rpc("send_notification", { notify_type: type, day_num: d, ver_letter: v }).then(function(r) { if (r.error) { console.error("Notify error:", r.error); } else { flash("Notification sent"); } }); };

  var setMF = function(f, v) { var prevMd = media[vK] || {}; setMd(function(p) { var o = Object.assign({}, p); o[vK] = Object.assign({}, o[vK] || {}); o[vK][f] = v; if (f === "rawLink" && v && (!o[vK].mediaStatus || o[vK].mediaStatus === "no_media")) o[vK].mediaStatus = "raw_uploaded"; if ((f === "editedLink" || f === "editedNoMusicLink") && v && o[vK].mediaStatus !== "final") o[vK].mediaStatus = "edited"; if (f === "robertApproved" && v) o[vK].mediaStatus = "final"; if ((f === "finalLink" || f === "finalNoMusicLink") && v) o[vK].mediaStatus = "final"; return o; }); if (f === "rawLink" && v && v.indexOf("http") === 0 && !prevMd.rawLink) sendNotify("raw_uploaded", day, ver); if (f === "editedLink" && v && v.indexOf("http") === 0 && !prevMd.editedLink) sendNotify("edit_uploaded", day, ver); if (f === "editedNoMusicLink" && v && v.indexOf("http") === 0 && !prevMd.editedNoMusicLink) sendNotify("edit_uploaded", day, ver); };

  useEffect(function() { if (ver !== "a" && content[day]) { var a = getVD(day, "a"), c = getVD(day, ver); if (a.date && !c.date) setVF(day, ver, "date", addD(a.date, ver === "b" ? 14 : 28)); if (!c.musicNotes) { var vi = VERSIONS.find(function(x) { return x.id === ver; }); if (vi) setVF(day, ver, "musicNotes", vi.music); } }; }, [ver, day]);

  var onADate = function(d, date) { setVF(d, "a", "date", date); if (date) { if (!getVD(d, "b").date) setVF(d, "b", "date", addD(date, 14)); if (!getVD(d, "c").date) setVF(d, "c", "date", addD(date, 28)); } };

  // ---- EXPORT/IMPORT ----
  var doExport = function() { var blob = new Blob([JSON.stringify({ v: 37, content: content, checks: checks, statuses: statuses, notes: notes, verD: verD, media: media, fbG: fbG, globalGroups: globalGroups, timers: timers, dayCount: dayCount, analytics: analytics, streakDates: streakDates }, null, 2)], { type: "application/json" }); var u = URL.createObjectURL(blob); var a = document.createElement("a"); a.href = u; a.download = "TFS_" + new Date().toISOString().slice(0, 10) + ".json"; a.click(); flash("Downloaded"); };
  var doImport = function() { var inp = document.createElement("input"); inp.type = "file"; inp.accept = ".json"; inp.onchange = function(e) { var f = e.target.files[0]; if (!f) return; var r = new FileReader(); r.onload = function(ev) { try { var d = JSON.parse(ev.target.result); if (d.content) setCt(d.content); if (d.checks) setCk(d.checks); if (d.statuses) setSt(d.statuses); if (d.notes) setNt(d.notes); if (d.verD) setVD(d.verD); if (d.media) setMd(d.media); if (d.fbG) setFbG(d.fbG); if (d.globalGroups) setGG(d.globalGroups); if (d.timers) setTm(d.timers); if (d.dayCount) setDayCount(d.dayCount); if (d.analytics) setAnalytics(d.analytics); if (d.streakDates) setStreakDates(d.streakDates); flash("Restored"); } catch (err) { flash("Error"); } }; r.readAsText(f); }; inp.click(); };
  var dlDay = function(d) { var dc2 = content[d] || {}; var e = { day: d, topicTitle: dc2.topicTitle, scriptLink: dc2.scriptLink, platforms: dc2.platforms, shared: dc2.shared, stories: dc2.stories }; VERSIONS.forEach(function(v) { e["v" + v.id] = Object.assign({}, verD["d" + d + "_v" + v.id], { media: media["d" + d + "_v" + v.id] || {} }); }); var blob = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }); var u = URL.createObjectURL(blob); var a = document.createElement("a"); a.href = u; a.download = "TFS_D" + d + ".json"; a.click(); flash("Day " + d); };
  var exportDayCopy = function() { var lines = ["=== DAY " + day + " ==="]; if (dc && dc.topicTitle) lines.push("Topic: " + dc.topicTitle); if (dc && dc.postTime) lines.push("Post Time: " + dc.postTime); var vda = getVD(day, "a"); if (vda.date) lines.push("vA Date: " + vda.date); lines.push(""); if (shared) { ["caption", "hashtags", "keywords", "music", "prompt", "title"].forEach(function(f) { if (shared[f]) lines.push("SHARED " + f.toUpperCase() + ": " + shared[f]); }); } lines.push(""); REAL_PLATFORMS.forEach(function(p) { var pcc = dc && dc.platforms && dc.platforms[p.id]; if (!pcc) return; lines.push("--- " + (p.label || "X").toUpperCase() + " ---"); if (pcc.title) lines.push("Title: " + pcc.title); if (pcc.copy) lines.push("Caption: " + pcc.copy); if (pcc.hashtags) lines.push("Hashtags: " + pcc.hashtags); if (pcc.prompt) lines.push("Prompt: " + pcc.prompt); if (pcc.description) lines.push("Description: " + pcc.description); if (pcc.tags) lines.push("Tags: " + pcc.tags); if (pcc.reel_title) lines.push("Reel Title: " + pcc.reel_title); lines.push(""); }); ["story1", "story2", "story3"].forEach(function(sk, si) { var sv = dc && dc[sk]; if (sv) lines.push("STORY " + (si + 1) + ": " + sv); }); var txt = lines.join("\n"); navigator.clipboard.writeText(txt).then(function() { flash("Day " + day + " copy exported"); }); };

  // ---- MARKDOWN DAY IMPORT/EXPORT ----
  var dlBlankMd = function() { var md = generateBlankMd(day); var blob = new Blob([md], { type: "text/markdown" }); var u = URL.createObjectURL(blob); var a = document.createElement("a"); a.href = u; a.download = "TFS_D" + day + "_template.md"; a.click(); flash("Template downloaded"); };
  var dlDayMd = function() { var md = exportDayMd(day, content[day]); var blob = new Blob([md], { type: "text/markdown" }); var u = URL.createObjectURL(blob); var a = document.createElement("a"); a.href = u; a.download = "TFS_D" + day + ".md"; a.click(); flash("Day " + day + " markdown downloaded"); };
  var importDayMd = function() { var inp = document.createElement("input"); inp.type = "file"; inp.accept = ".md,.txt,.markdown"; inp.onchange = function(e) { var f = e.target.files[0]; if (!f) return; var r = new FileReader(); r.onload = function(ev) { try { var parsed = parseDayMd(ev.target.result); var targetDay = parsed.dayNum || day; var merged = mergeDayMd(parsed, content[targetDay]); setCt(function(p) { var o = Object.assign({}, p); o[targetDay] = merged; return o; }); if (targetDay !== day) setDay(targetDay); flash("Day " + targetDay + " imported (" + Object.keys(parsed.platforms).length + " platforms)"); } catch (err) { console.error("MD import error:", err); flash("Import error"); } }; r.readAsText(f); }; inp.click(); };

  // ---- DAY HELPERS ----
  var dayPct = function(d) { var t = 0, c = 0; REAL_PLATFORMS.forEach(function(p) { var k2 = "d" + d + "_" + p.id; var cc = CHECKLISTS[p.id]; if (cc) { t += [].concat(cc.pre || [], cc.caption || [], cc.settings || [], cc.post || []).length; var ch = checks[k2] || {}; for (var k3 in ch) if (ch[k3]) c++; } }); return t ? Math.round(c / t * 100) : 0; };
  var dayAllDone = function(d) { var all = true; REAL_PLATFORMS.forEach(function(p) { if ((statuses["d" + d + "_" + p.id] || "not_started") !== "done") all = false; }); return all; };

  var quickFill = function(srcDay) { var src = content[srcDay]; if (!src) return; setCt(function(p) { var o = Object.assign({}, p); var dd = Object.assign({ topicTitle: "", contentType: "none", salesy: "none", postTime: "", platforms: {}, shared: {}, stories: {} }, o[day] || {}); if (src.shared) dd.shared = JSON.parse(JSON.stringify(src.shared)); if (src.platforms) { REAL_PLATFORMS.forEach(function(rp) { if (src.platforms[rp.id]) { dd.platforms = Object.assign({}, dd.platforms); dd.platforms[rp.id] = JSON.parse(JSON.stringify(src.platforms[rp.id])); } }); } dd.contentType = src.contentType || "none"; o[day] = dd; return o; }); flash("Filled from Day " + srcDay); };
  var getCopyDiff = function(d) { var dc2 = content[d]; if (!dc2 || !dc2.shared || !dc2.shared.caption) return []; var base = dc2.shared.caption; var diffs = []; REAL_PLATFORMS.forEach(function(rp) { var pcc = dc2.platforms && dc2.platforms[rp.id]; var platCopy = (pcc && pcc.copy) || ""; if (!platCopy) return; if (platCopy === base) diffs.push({ plat: rp, status: "match" }); else diffs.push({ plat: rp, status: "edited", copy: platCopy }); }); return diffs; };
  var importCSV = function() { var inp = document.createElement("input"); inp.type = "file"; inp.accept = ".csv"; inp.onchange = function(e) { var f = e.target.files[0]; if (!f) return; var r = new FileReader(); r.onload = function(ev) { try { var lines = ev.target.result.split("\n"); var headers = lines[0].split(",").map(function(h) { return h.trim().toLowerCase(); }); var rows = []; for (var i = 1; i < lines.length; i++) { if (!lines[i].trim()) continue; var cols = lines[i].split(","); var row = {}; headers.forEach(function(h, j) { row[h] = cols[j] ? cols[j].trim() : ""; }); rows.push(row); } setAnalytics(function(p) { var o = Object.assign({}, p); o.raw = (o.raw || []).concat(rows); o.lastImport = new Date().toISOString(); return o; }); flash("Imported " + rows.length + " rows"); } catch (err) { flash("CSV error"); } }; r.readAsText(f); }; inp.click(); };

  var sendPostEmail = function(d, platId) { if (!_sb) return; var dc2 = content[d] || {}; var pObj = PLATFORMS.find(function(p) { return p.id === platId; }); var remaining = []; var st2 = dc2.stories || {}; if (!st2.s2 || !st2.s2.postTo) remaining.push("Story 2: share main post to stories"); if (!st2.s3) remaining.push("Story 3: post follow-up story later"); var gd2 = fbG["d" + d] || {}; var gShared = globalGroups.filter(function(gn) { return gd2[gn] && gd2[gn].shared; }).length; if (gShared < globalGroups.length) remaining.push("Groups: " + gShared + "/" + globalGroups.length + " shared"); _sb.rpc("send_post_email", { day_num: d, plat_name: pObj ? (pObj.label || "X") : "", topic: dc2.topicTitle || "Day " + d, remaining_items: remaining.join("\n"), app_url: "https://rbiehn.github.io/tfs-publish/?day=" + d }).catch(function(err) { console.error("Email error:", err); }); };

  // ---- CHECKLIST HELPERS ----
  var allI = cl ? [].concat(cl.pre || [], cl.caption || [], cl.settings || [], cl.post || [], cl.stories || []) : [];
  var doneN = 0; for (var kk in pCk) { if (pCk[kk]) doneN++; }
  var pct = allI.length ? Math.round(doneN / allI.length * 100) : 0;
  var toggleCk = function(id) { setCk(function(p) { var o = Object.assign({}, p); o[pK] = Object.assign({}, o[pK] || {}); o[pK][id] = !o[pK][id]; return o; }); };
  var resetCk = function() { setCk(function(p) { var o = Object.assign({}, p); o[pK] = {}; return o; }); flash("Checklist reset"); };
  var _delDay = useState(false), showDelDay = _delDay[0], setShowDelDay = _delDay[1];
  var deleteDay = function() { setCt(function(p) { var o = Object.assign({}, p); delete o[day]; return o; }); setCk(function(p) { var o = Object.assign({}, p); REAL_PLATFORMS.forEach(function(pl) { delete o["d" + day + "_" + pl.id]; }); return o; }); setSt(function(p) { var o = Object.assign({}, p); REAL_PLATFORMS.forEach(function(pl) { delete o["d" + day + "_" + pl.id]; }); return o; }); setNt(function(p) { var o = Object.assign({}, p); REAL_PLATFORMS.forEach(function(pl) { delete o["d" + day + "_" + pl.id]; }); return o; }); setTm(function(p) { var o = Object.assign({}, p); REAL_PLATFORMS.forEach(function(pl) { delete o["d" + day + "_" + pl.id]; }); return o; }); setVD(function(p) { var o = Object.assign({}, p); VERSIONS.forEach(function(v2) { delete o["d" + day + "_v" + v2.id]; }); return o; }); setMd(function(p) { var o = Object.assign({}, p); VERSIONS.forEach(function(v2) { delete o["d" + day + "_v" + v2.id]; }); return o; }); setFbG(function(p) { var o = Object.assign({}, p); delete o["d" + day]; return o; }); setShowDelDay(false); flash("Day " + day + " deleted"); };
  var checkSection = function(title, items) { if (!items || !items.length) return; setCk(function(p) { var o = Object.assign({}, p); o[pK] = Object.assign({}, o[pK] || {}); var allDone = true; items.forEach(function(_, i) { if (!o[pK]["s_" + title + "_" + i]) allDone = false; }); items.forEach(function(_, i) { o[pK]["s_" + title + "_" + i] = !allDone; }); return o; }); };

  // ---- EDITOR MODAL ----
  var openEd = function(fld) { setEdFld(fld); if (fld === "notes") setEdVal(myN); else if (fld === "topicTitle") setEdVal((dc && dc.topicTitle) || ""); else if (fld === "musicNotes") setEdVal(vd.musicNotes || ""); else if (fld === "stephNotes") setEdVal(cm.stephNotes || ""); else if (fld === "story1" || fld === "story2" || fld === "story3") setEdVal((dc && dc[fld]) || ""); else setEdVal((pc && pc[fld]) || ""); setShowEd(true); };
  var saveEd = function() { if (edFld === "notes") setNt(function(p) { var o = Object.assign({}, p); o[pK] = edVal; return o; }); else if (edFld === "topicTitle") setMeta(day, "topicTitle", edVal); else if (edFld === "musicNotes") setVF(day, ver, "musicNotes", edVal); else if (edFld === "stephNotes") setMF("stephNotes", edVal); else if (edFld === "story1" || edFld === "story2" || edFld === "story3") setMeta(day, edFld, edVal); else { setFld(day, plat, edFld, edVal); if (edFld === "copy" && plat === "fb_personal") { var grpC = content[day] && content[day].platforms && content[day].platforms.fb_groups; if (!grpC || !grpC.copy) setFld(day, "fb_groups", "copy", edVal); } } setShowEd(false); flash("Saved"); };

  var gd = fbG[dK] || {};
  var addGlobalGrp = function(n) { if (!n || globalGroups.indexOf(n) !== -1) return; setGG(function(p) { return p.concat([n]); }); };
  var removeGlobalGrp = function(i) { setGG(function(p) { var a = p.slice(); a.splice(i, 1); return a; }); };
  var togGrp = function(name, f) { setFbG(function(p) { var c = Object.assign({}, p[dK] || {}); c[name] = Object.assign({ shared: false, pending: false, time: null }, c[name] || {}); c[name][f] = !c[name][f]; if (f === "shared") { if (c[name].shared) { c[name].time = new Date().toLocaleTimeString(); } else { c[name].time = null; } } var o = Object.assign({}, p); o[dK] = c; return o; }); };

  var DAY_FIELDS = ["topicTitle", "story1", "story2", "story3", "musicNotes", "stephNotes"];
  var edPlatName = aPlat ? aPlat.label : "";
  var edContext = DAY_FIELDS.indexOf(edFld) !== -1 ? "Day " + day : edPlatName;
  var edCharMax = null;
  if (tpl && edFld) { var tf2 = tpl.find(function(t) { return t.key === edFld; }); if (tf2 && tf2.max) edCharMax = tf2.max; }

  // ---- TIMER ----
  var timerMs = 0; var timerPlat = ""; var timerDay = 0;
  for (var tKey in timers) { if (timers[tKey]) { var remaining = Math.max(0, 3600000 - (Date.now() - timers[tKey])); if (remaining > 0 && remaining > timerMs) { timerMs = remaining; var tParts = tKey.split("_"); timerDay = parseInt(tParts[0].slice(1)); var tPlatId = tParts.slice(1).join("_"); var tPlatObj = PLATFORMS.find(function(p) { return p.id === tPlatId; }); timerPlat = (timerDay !== day ? "D" + timerDay + " " : "") + (tPlatObj ? tPlatObj.label : ""); } } }

  // ---- CALENDAR DATA ----
  var calItems = [];
  for (var di = 1; di <= dayCount; di++) { if (!content[di]) continue; VERSIONS.forEach(function(v) { var vdi = verD["d" + di + "_v" + v.id]; if (vdi && vdi.date) calItems.push({ day: di, ver: v.id, vL: v.short, date: vdi.date, topicTitle: (content[di] && content[di].topicTitle) || ("Day " + di), color: v.id === "a" ? "#f97316" : v.id === "b" ? "#a855f7" : "#06b6d4" }); }); }

  // ---- MEDIA QUEUE ----
  var mediaQueue = [];
  for (var qi = 1; qi <= dayCount; qi++) { if (!content[qi]) continue; VERSIONS.forEach(function(v) { var mk = "d" + qi + "_v" + v.id; var mv = media[mk] || {}; var ms = mv.mediaStatus || "no_media"; var hasRaw = !!mv.rawLink; var hasEdit = !!mv.editedLink; if (ms === "no_media" && !hasRaw && !hasEdit) return; var need = ""; if (hasRaw && !hasEdit) need = "Needs editing"; else if (ms === "raw_uploaded") need = "Needs editing"; else if (ms === "in_editing") need = "In progress"; else if (ms === "edited" && !hasEdit) need = "Paste edited link"; else if (ms === "final") return; if (!need && hasRaw && hasEdit) return; if (!need && ms === "edited") return; if (!need) need = "Check status"; mediaQueue.push({ day: qi, ver: v.id, vL: v.short, topicTitle: (content[qi] && content[qi].topicTitle) || "Day " + qi, status: ms, need: need, hasRaw: hasRaw, hasEdit: hasEdit }); }); }
  var stephQueueCount = mediaQueue.filter(function(q) { return q.need === "Needs editing"; }).length;

  // ---- SALESY / HASHTAG AUDIT ----
  var salesyCounts = { none: 0, soft: 0, full: 0 }; var salesyTotal = 0;
  var hashtagUse = {}; COMP_TAGS.forEach(function(h) { hashtagUse[h] = 0; });
  for (var si = 1; si <= dayCount; si++) { var sc = content[si]; if (!sc) continue; var sl = sc.salesy || "none"; if (sl !== "none") { salesyCounts[sl]++; salesyTotal++; } else if (sc.topicTitle) { salesyCounts.none++; salesyTotal++; } if (sc.platforms) { REAL_PLATFORMS.forEach(function(p) { var pp = sc.platforms[p.id]; if (pp && pp.hashtags) { var ht = pp.hashtags.toLowerCase(); COMP_TAGS.forEach(function(ct) { if (ht.indexOf(ct) !== -1) hashtagUse[ct]++; }); } }); } }

  // ---- TASK FEED DATA ----
  var todayISO = new Date().toISOString().slice(0, 10);
  var todayDow = new Date().getDay();
  var isWeekend = todayDow === 0 || todayDow === 6;
  var todayCItem = calItems.find(function(ci) { return ci.date === todayISO; });
  var taskDay = todayCItem ? todayCItem.day : day;
  var taskVer = todayCItem ? todayCItem.ver : ver;
  var taskDc = content[taskDay] || {};
  var taskSh = taskDc.shared || {};
  var taskSt2 = taskDc.stories || {};

  var genTasks = function() {
    var tasks = []; var tid = 0;
    var shFields = ["caption", "hashtags", "keywords", "music", "prompt", "title"];
    shFields.forEach(function(f) { tasks.push({ id: tid++, phase: "prep", label: "Fill shared " + f, done: !!taskSh[f], xp: XP_VALUES.shared, nav: function() { setDay(taskDay); setPlat("shared"); goTo("publish"); } }); });
    var s1d = taskSt2.s1 || {}; var s1Done = !!(s1d.visual || s1d.script || s1d.textOverlay);
    tasks.push({ id: tid++, phase: "prep", label: "Design and post Story 1", done: s1Done, xp: XP_VALUES.story, nav: function() { setDay(taskDay); setPlat("stories"); goTo("publish"); } });
    var mDone = (media["d" + taskDay + "_v" + taskVer] || {}).mediaStatus === "final";
    tasks.push({ id: tid++, phase: "prep", label: "Media v" + taskVer.toUpperCase() + " finalized", done: mDone, xp: XP_VALUES.shared, nav: function() { setDay(taskDay); setPlat("tiktok"); setTab("media"); goTo("publish"); } });
    REAL_PLATFORMS.filter(function(p) { return p.id !== "fb_groups"; }).forEach(function(p) {
      var pSt = statuses["d" + taskDay + "_" + p.id] || "not_started";
      var posted = pSt === "posted" || pSt === "done";
      tasks.push({ id: tid++, phase: "post", label: "Post " + (p.label || "X"), done: posted, xp: XP_VALUES.platform, icon: p.icon, iconColor: p.color, hint: SCHED_NOTES[p.id] || "", nav: function() { setDay(taskDay); setPlat(p.id); goTo("publish"); } });
      if (pSt === "posted") { var tmKey = "d" + taskDay + "_" + p.id; var tmVal = timers[tmKey]; var remaining = tmVal ? Math.max(0, 3600000 - (Date.now() - tmVal)) : 0; if (remaining > 0) { tasks.push({ id: tid++, phase: "live", label: (p.label || "X") + " comments (" + Math.round(remaining / 60000) + "m)", done: false, xp: XP_VALUES.comment, timer: remaining, icon: p.icon, iconColor: p.color, nav: function() { setDay(taskDay); setPlat(p.id); goTo("publish"); } }); } }
    });
    var s2d = taskSt2.s2 || {}; var s2Done = !!(s2d.textOverlay || s2d.igCaption);
    tasks.push({ id: tid++, phase: "followup", label: "Story 2 (share after posts live)", done: s2Done, xp: XP_VALUES.story, nav: function() { setDay(taskDay); setPlat("stories"); goTo("publish"); } });
    var gd4 = fbG["d" + taskDay] || {}; var gDone = globalGroups.filter(function(gn) { return gd4[gn] && gd4[gn].shared; }).length; var gTotal = globalGroups.length;
    if (gTotal > 0) tasks.push({ id: tid++, phase: "followup", label: "Groups batch (" + gDone + "/" + gTotal + ")", done: gDone >= gTotal, xp: XP_VALUES.group * gTotal, partialXp: XP_VALUES.group * gDone, nav: function() { setDay(taskDay); setPlat("fb_groups"); goTo("publish"); } });
    var s3d = taskSt2.s3 || {}; var s3Done = !!(s3d.visual || s3d.script || s3d.textOverlay);
    tasks.push({ id: tid++, phase: "followup", label: "Story 3 (later today)", done: s3Done, xp: XP_VALUES.story, nav: function() { setDay(taskDay); setPlat("stories"); goTo("publish"); } });
    var liveTasks = tasks.filter(function(t) { return t.phase === "live"; });
    return { prep: tasks.filter(function(t) { return t.phase === "prep"; }), live: liveTasks, post: tasks.filter(function(t) { return t.phase === "post"; }), followup: tasks.filter(function(t) { return t.phase === "followup"; }), all: tasks };
  };
  var taskData = genTasks();
  var allTasksList = taskData.all;
  var doneCount = allTasksList.filter(function(t) { return t.done; }).length;
  var totalXp = allTasksList.reduce(function(s, t) { return s + t.xp; }, 0);
  var earnedXp = allTasksList.reduce(function(s, t) { return s + (t.done ? t.xp : (t.partialXp || 0)); }, 0);
  var isPerfectDay = doneCount === allTasksList.length && allTasksList.length > 0;

  // ---- STREAK ----
  var calcStreak = function() { var streak = 0; var d2 = new Date(); d2.setDate(d2.getDate() - 1); for (var i = 0; i < 365; i++) { var dow = d2.getDay(); if (dow === 0 || dow === 6) { d2.setDate(d2.getDate() - 1); continue; } if (streakDates.indexOf(d2.toISOString().slice(0, 10)) !== -1) { streak++; d2.setDate(d2.getDate() - 1); } else break; } return streak; };
  var currentStreak = calcStreak() + (isPerfectDay ? 1 : 0);
  var bestStreak = Math.max(currentStreak, lsLoad("bestStreak", 0));
  useEffect(function() { if (isPerfectDay && streakDates.indexOf(todayISO) === -1) { setStreakDates(function(p) { return p.concat([todayISO]); }); try { localStorage.setItem("tfs_bestStreak", JSON.stringify(Math.max(currentStreak, lsLoad("bestStreak", 0)))); } catch (e) {} } }, [isPerfectDay]);
  var consist = function() { var c = 0, t2 = 0; var d3 = new Date(); for (var i = 0; i < 30; i++) { d3.setDate(d3.getDate() - 1); if (d3.getDay() === 0 || d3.getDay() === 6) continue; t2++; if (streakDates.indexOf(d3.toISOString().slice(0, 10)) !== -1) c++; } return t2 ? Math.round(c / t2 * 100) : 0; }();

  // ---- CHECKLIST RENDERER ----
  function renderCL(title, items) {
    if (!items || !items.length) return null;
    var secDone = 0; items.forEach(function(_, i) { if (pCk["s_" + title + "_" + i]) secDone++; });
    var allChecked = secDone === items.length;
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>{title} <span style={{ color: allChecked ? "#22c55e" : "#aaa" }}>({secDone}/{items.length})</span></span>
          <button onClick={function() { checkSection(title, items); }} style={{ background: allChecked ? "#22c55e18" : "#f0f0f4", border: "1px solid " + (allChecked ? "#22c55e40" : "#d4d4db"), borderRadius: 10, padding: "6px 12px", fontSize: 11, color: allChecked ? "#22c55e" : "#888", cursor: "pointer", fontWeight: 600 }}>{allChecked ? "Uncheck" : "All"}</button>
        </div>
        {items.map(function(it, i) { var ck = "s_" + title + "_" + i; var done = !!pCk[ck]; return (
          <div key={ck} onClick={function() { toggleCk(ck); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", marginBottom: 6, background: done ? "#f0fdf4" : "#fff", border: "1px solid " + (done ? "#bbf7d0" : "#eeeef2"), borderRadius: 14, cursor: "pointer", transition: "all 0.15s", userSelect: "none", boxShadow: done ? "none" : "0 1px 4px #00000006" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, border: "2px solid " + (done ? "#22c55e" : "#ccc"), background: done ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>{done && <i className="fa-solid fa-check" style={{ color: "#fff", fontSize: 12 }} />}</div>
            <span style={{ fontSize: 15, color: done ? "#999" : "#333", textDecoration: done ? "line-through" : "none", lineHeight: 1.4, transition: "color 0.15s" }}>{it}</span>
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
  // TASK FEED VIEW (v35 Visual Overhaul)
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
                {t.hint && !t.done && <div style={{ fontSize: 11, color: "#bbb", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.hint}</div>}
              </div>
              {t.timer && <span style={{ fontSize: 15, fontWeight: 800, color: "#3b82f6", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{Math.round(t.timer / 60000)}m</span>}
              {!t.done && !t.timer && <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}><span style={{ fontSize: 11, color: "#ccc" }}>+{t.xp}</span><i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: "#d4d4db" }} /></div>}
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
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #fb923c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 800, color: "#fff", boxShadow: "0 4px 12px #f9731640" }}>R</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.2 }}>Hey, Robert</div>
              <div style={{ fontSize: 13, color: "#999", marginTop: 2 }}>Day {taskDay}{taskDc.topicTitle ? " \u00b7 " + taskDc.topicTitle : ""}{taskDc.postTime ? " \u00b7 " + taskDc.postTime : ""}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #fff7ed, #fef3c7)", border: "1px solid #fed7aa", borderRadius: 14, padding: "8px 12px", boxShadow: "0 2px 8px #f9731615" }}>
              <i className="fa-solid fa-fire" style={{ color: "#f97316", fontSize: 18 }} />
              <span style={{ fontSize: 17, fontWeight: 800, color: "#f97316" }}>{currentStreak}</span>
            </div>
          </div>

          {/* Nav buttons */}
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 16 }}>
            <button title="Week" onClick={function(){goTo("week");}} style={S.hBtn}><i className="fa-solid fa-calendar-week" style={{fontSize:13}}/></button>
            <button title="Calendar" onClick={function(){goTo("calendar");}} style={S.hBtn}><i className="fa-solid fa-calendar-days" style={{fontSize:13}}/></button>
            <button title="Dashboard" onClick={function(){goTo("dashboard");}} style={S.hBtn}><i className="fa-solid fa-grip" style={{fontSize:13}}/></button>
            <button title="Edit Queue" onClick={function(){goTo("queue");}} style={Object.assign({},S.hBtn,{position:"relative"})}><i className="fa-solid fa-pen" style={{fontSize:12}}/>{stephQueueCount>0&&<span style={{position:"absolute",top:-3,right:-3,background:"#ef4444",color:"#fff",fontSize:10,fontWeight:800,borderRadius:8,padding:"1px 4px",minWidth:12,textAlign:"center"}}>{stephQueueCount}</span>}</button>
            <button title="Reference" onClick={function(){goTo("reference");}} style={S.hBtn}><i className="fa-solid fa-circle-question" style={{fontSize:13}}/></button>
          </div>

          {/* Week strip */}
          <div style={{ background: "#fff", borderRadius: 18, padding: "14px 16px", marginBottom: 16, border: "1px solid #eeeef2", boxShadow: "0 2px 8px #00000006" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#444" }}>This week</span>
              {bestStreak > 0 && <span style={{ fontSize: 11, color: "#f97316", fontWeight: 600 }}><i className="fa-solid fa-trophy" style={{ marginRight: 4, fontSize: 10 }} />Best: {bestStreak} days</span>}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {wkDays.map(function(w, i) { return (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: w.today ? "#f97316" : "#bbb", marginBottom: 6, fontWeight: w.today ? 700 : 400 }}>{w.day}</div>
                  <div style={{ width: 34, height: 34, borderRadius: 12, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", background: w.done ? "#22c55e" : w.today ? "#f9731615" : w.weekend ? "#fafafa" : "#f4f4f8", border: w.today && !w.done ? "2px dashed #f97316" : w.done ? "none" : "1px solid #eeeef2", transition: "all 0.2s" }}>
                    {w.done ? <i className="fa-solid fa-check" style={{ color: "#fff", fontSize: 13 }} /> : w.today ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316" }} /> : null}
                  </div>
                </div>
              ); })}
            </div>
          </div>

          {/* Metrics row */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, background: "#fff", borderRadius: 16, padding: "14px 16px", border: "1px solid #eeeef2", boxShadow: "0 2px 8px #00000006" }}>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>XP</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#f97316", lineHeight: 1 }}>{earnedXp}<span style={{ fontSize: 14, color: "#ddd", fontWeight: 600 }}>/{totalXp}</span></div>
            </div>
            <div style={{ flex: 1, background: "#fff", borderRadius: 16, padding: "14px 16px", border: "1px solid #eeeef2", boxShadow: "0 2px 8px #00000006" }}>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Consistency</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: consist >= 70 ? "#22c55e" : "#f59e0b", lineHeight: 1 }}>{consist}%</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "14px 18px", marginBottom: 16, border: "1px solid #eeeef2", boxShadow: "0 2px 8px #00000006" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#666" }}>{doneCount} of {allTasksList.length} done</span>
              {isPerfectDay
                ? <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 13 }}><i className="fa-solid fa-star" style={{ marginRight: 4 }} />Perfect day!</span>
                : <span style={{ color: "#f97316", fontWeight: 600, fontSize: 12 }}>{allTasksList.length - doneCount} to go</span>
              }
            </div>
            <div style={{ height: 8, background: "#f0f0f4", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", background: isPerfectDay ? "linear-gradient(90deg, #22c55e, #4ade80)" : "linear-gradient(90deg, #f97316, #fb923c)", borderRadius: 4, width: progressPct + "%", transition: "width 0.4s ease" }} />
            </div>
          </div>
        </div>

        {/* Setup prompt */}
        <div style={{ padding: "0 22px 80px" }}>
          {!taskDc.topicTitle && (
            <div style={{ background: "linear-gradient(135deg, #fff7ed, #fefce8)", border: "1px solid #fed7aa", borderRadius: 18, padding: 20, marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#f97316", marginBottom: 4 }}>Set up Day {taskDay}</div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>Add a topic title and shared content to get started</div>
              <button onClick={function() { setDay(taskDay); setPlat("shared"); goTo("publish"); }} style={{ background: "#f97316", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 12px #f9731640" }}>
                <i className="fa-solid fa-share-nodes" style={{ marginRight: 6 }} />Open Shared
              </button>
            </div>
          )}

          {renderPhase("PREP", "#22c55e", taskData.prep)}
          {renderPhase("LIVE NOW", "#3b82f6", taskData.live)}
          {renderPhase("POST", "#f59e0b", taskData.post)}
          {renderPhase("FOLLOW-UP", "#a855f7", taskData.followup)}

          <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
            <button onClick={function() { setDay(taskDay); goTo("publish"); }} style={{ flex: 1, background: "#fff", border: "1px solid #eeeef2", borderRadius: 14, padding: "14px", fontSize: 13, fontWeight: 700, color: "#666", cursor: "pointer", boxShadow: "0 1px 4px #00000006" }}>
              <i className="fa-solid fa-pen-to-square" style={{ marginRight: 6, color: "#f97316" }} />Open day editor
            </button>
            <button onClick={function() { goTo("week"); }} style={{ background: "#fff", border: "1px solid #eeeef2", borderRadius: 14, padding: "14px 18px", fontSize: 13, color: "#888", cursor: "pointer", boxShadow: "0 1px 4px #00000006" }}>
              <i className="fa-solid fa-calendar-week" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================================
  // WEEK VIEW
  // ==================================================================
  if (view === "week") {
    var todayW = new Date().toISOString().slice(0, 10);
    var weekDays = []; for (var wi2 = 1; wi2 <= dayCount; wi2++) { var wVd = getVD(wi2, "a"); if (wVd.date) weekDays.push({ day: wi2, date: wVd.date }); }
    weekDays.sort(function(a, b) { return a.date.localeCompare(b.date); });
    var todayIdx = weekDays.findIndex(function(w) { return w.date >= todayW; }); if (todayIdx < 0) todayIdx = weekDays.length - 1;
    var weekSlice = weekDays.slice(Math.max(0, todayIdx - 1), todayIdx + 6);
    return (
      <div className="tfs-app" style={S.ctn}>
        <div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{ fontSize: 13, marginRight: 5 }} />Back</button><span style={S.topT}>WEEK</span><div style={{ width: 50 }} /></div>
        <div style={{ padding: "16px 12px 80px" }}>
          {weekSlice.map(function(wd2) { var wDc = content[wd2.day] || {}; var wCt = CONTENT_TYPES.find(function(c) { return c.id === (wDc.contentType || "none"); }); var wSl = SALESY_LEVELS.find(function(s) { return s.id === (wDc.salesy || "none"); }); var isT = wd2.date === todayW; var allDn = dayAllDone(wd2.day); return (
            <div key={wd2.day} onClick={function() { setDay(wd2.day); goTo("publish"); }} style={{ background: isT ? "#fff7ed" : "#fff", border: "1px solid " + (isT ? "#f97316" : "#eeeef2"), borderRadius: 14, padding: 14, marginBottom: 8, cursor: "pointer", boxShadow: "0 1px 4px #00000006" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div><span style={{ fontSize: 14, fontWeight: 700, color: isT ? "#f97316" : "#444" }}>Day {wd2.day}</span><span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>{fmtD(wd2.date)}</span>{isT && <span style={{ fontSize: 11, color: "#f97316", fontWeight: 700, background: "#f9731620", padding: "1px 5px", borderRadius: 4, marginLeft: 6 }}>TODAY</span>}</div>
                <div style={{ display: "flex", gap: 4 }}>{wCt && wCt.id !== "none" && <span style={{ fontSize: 10, background: "#f0f0f4", borderRadius: 4, padding: "1px 5px", color: "#666" }}>{wCt.short}</span>}{wSl && wSl.id !== "none" && <span style={{ fontSize: 10, background: wSl.color + "18", borderRadius: 4, padding: "1px 5px", color: wSl.color }}>{wSl.label}</span>}{allDn && <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 700 }}>{"\u2713"}</span>}</div>
              </div>
              <div style={{ fontSize: 12, color: "#777", marginBottom: 6 }}>{wDc.topicTitle || "No topic set"}</div>
              <div style={{ display: "flex", gap: 3 }}>{REAL_PLATFORMS.map(function(rp) { var rpS = statuses["d" + wd2.day + "_" + rp.id] || "not_started"; return <div key={rp.id} style={{ width: 8, height: 8, borderRadius: "50%", background: ST_C[rpS] }} />; })}</div>
            </div>
          ); })}
        </div>
      </div>
    );
  }

  // ==================================================================
  // SECONDARY VIEWS (Bulk Status, Copy Diff, Analytics, Calendar, Dashboard, Cross-view, Queue, Reference)
  // ==================================================================
  if (view === "bulkstatus") { return (<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Back</button><span style={S.topT}>DAY {day} STATUS</span><div style={{width:50}}/></div>
    <div style={{padding:"18px 20px 80px"}}>
      <div style={{fontSize:13,color:"#888",marginBottom:12}}>One-tap status changes for all platforms</div>
      {REAL_PLATFORMS.map(function(rp){var rpK="d"+day+"_"+rp.id;var rpSt=statuses[rpK]||"not_started";return <div key={rp.id} style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:8,boxShadow:"0 1px 4px #00000006"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><i className={rp.icon} style={{fontSize:16,color:rp.color}}/><span style={{fontSize:14,fontWeight:700,color:"#444",flex:1}}>{rp.label||"X"}</span><span style={{fontSize:11,color:ST_C[rpSt],fontWeight:700}}>{ST_L[rpSt]}</span></div>
        <div style={{display:"flex",gap:4}}>{["not_started","drafted","posted","done"].map(function(s2){return <button key={s2} onClick={function(){setSt(function(p){var o=Object.assign({},p);o[rpK]=s2;return o;});if(s2==="posted"){setTm(function(p){var o=Object.assign({},p);o[rpK]=Date.now();return o;});sendPostEmail(day,rp.id);}flash((rp.label||"X")+": "+ST_L[s2]);}} style={{flex:1,background:s2===rpSt?ST_C[s2]+"33":ST_C[s2]+"11",border:"1px solid "+(s2===rpSt?ST_C[s2]:ST_C[s2]+"44"),borderRadius:10,padding:"8px 4px",fontSize:11,fontWeight:700,color:ST_C[s2],cursor:"pointer",textTransform:"uppercase"}}>{ST_L[s2]}</button>;})}</div>
      </div>;})}
    </div>
  </div>);}

  if (view === "copydiff") { var diffs = getCopyDiff(day); return (<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Back</button><span style={S.topT}>COPY DIFF D{day}</span><div style={{width:50}}/></div>
    <div style={{padding:"18px 20px 80px"}}>
      <div style={{fontSize:13,color:"#888",marginBottom:12}}>Shared caption vs. per-platform edits</div>
      <div style={{background:"#f9731610",border:"1px solid #f9731630",borderRadius:14,padding:12,marginBottom:14}}><div style={{fontSize:11,fontWeight:700,color:"#f97316",marginBottom:4}}>Shared base</div><div style={{fontSize:13,color:"#444",whiteSpace:"pre-wrap"}}>{(dc&&dc.shared&&dc.shared.caption)||"(empty)"}</div></div>
      {diffs.length===0?<div style={{textAlign:"center",padding:30,color:"#aaa"}}>No platforms have copy yet</div>:diffs.map(function(d2,i){return <div key={i} style={{background:"#fff",border:"1px solid "+(d2.status==="match"?"#bbf7d0":"#fde68a"),borderRadius:14,padding:12,marginBottom:8,boxShadow:"0 1px 4px #00000006"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><i className={d2.plat.icon} style={{fontSize:14,color:d2.plat.color}}/><span style={{fontSize:13,fontWeight:700,color:"#444"}}>{d2.plat.label||"X"}</span><span style={{fontSize:10,color:d2.status==="match"?"#22c55e":"#f59e0b",fontWeight:600}}>{d2.status==="match"?"Matches shared":"Edited"}</span></div>
        {d2.status==="edited"&&<div style={{fontSize:12,color:"#666",whiteSpace:"pre-wrap",background:"#fafafa",borderRadius:8,padding:8}}>{d2.copy}</div>}
      </div>;})}
    </div>
  </div>);}

  if (view === "analytics") { var rawData = analytics.raw || []; return (<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Back</button><span style={S.topT}>ANALYTICS</span><div style={{width:50}}/></div>
    <div style={{padding:"18px 20px 80px"}}>
      <div style={{display:"flex",gap:6,marginBottom:16}}><button onClick={importCSV} style={{background:"#f97316",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer"}}>Import CSV</button>{analytics.lastImport&&<span style={{fontSize:12,color:"#888",alignSelf:"center"}}>Last: {new Date(analytics.lastImport).toLocaleDateString()}</span>}</div>
      <div style={{fontSize:13,color:"#888",marginBottom:12}}>Import platform analytics CSVs. Data maps to day/version for performance tracking.</div>
      {rawData.length===0?<div style={{textAlign:"center",padding:40,color:"#aaa"}}><i className="fa-solid fa-chart-simple" style={{fontSize:36,color:"#ddd",display:"block",marginBottom:12}}/><div>No data yet. Import a CSV to get started.</div></div>:
      <div><div style={{fontSize:14,fontWeight:700,color:"#444",marginBottom:8}}>{rawData.length} rows imported</div>
        <div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,overflow:"hidden"}}><table style={{width:"100%",fontSize:12,borderCollapse:"collapse"}}><thead><tr style={{background:"#f4f4f8"}}>{Object.keys(rawData[0]||{}).slice(0,5).map(function(h,i){return <th key={i} style={{padding:"8px 6px",textAlign:"left",fontWeight:700,color:"#555",borderBottom:"1px solid #eeeef2"}}>{h}</th>;})}</tr></thead><tbody>{rawData.slice(0,20).map(function(row,ri){return <tr key={ri}>{Object.values(row).slice(0,5).map(function(v2,ci){return <td key={ci} style={{padding:"6px",color:"#666",borderBottom:"1px solid #f4f4f8"}}>{v2}</td>;})}</tr>;})}</tbody></table></div>
        {rawData.length>20&&<div style={{fontSize:11,color:"#aaa",textAlign:"center",padding:8}}>Showing first 20 of {rawData.length} rows</div>}
      </div>}
    </div>
  </div>);}

  if (view === "calendar") {
    var yr=calMo.y,mo=calMo.m,dim=new Date(yr,mo+1,0).getDate(),fd=new Date(yr,mo,1).getDay();
    var ibd={};calItems.forEach(function(it){if(!ibd[it.date])ibd[it.date]=[];ibd[it.date].push(it);});
    var tl=calItems.slice().sort(function(a,b){return a.date.localeCompare(b.date);});
    var todayStr=new Date().toISOString().slice(0,10);
    return(<div className="tfs-app" style={S.ctn}>
      <div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Home</button><span style={S.topT}>CALENDAR</span><div style={{width:50}}/></div>
      <div style={{display:"flex",gap:4,padding:"10px 16px",justifyContent:"center"}}><button onClick={function(){setCalMode("month");}} style={calMode==="month"?S.togA:S.togB}>Month</button><button onClick={function(){setCalMode("timeline");}} style={calMode==="timeline"?S.togA:S.togB}>Timeline</button></div>
      {calMode==="month"?(<div style={{padding:"0 12px 80px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"}}><button onClick={function(){setCalMo(function(p){return p.m===0?{y:p.y-1,m:11}:{y:p.y,m:p.m-1};});}} style={{background:"none",border:"none",color:"#999",fontSize:26,cursor:"pointer",padding:"8px 16px"}}>{"\u2039"}</button><span style={{fontSize:18,fontWeight:700,color:"#222"}}>{MONTHS[mo]} {yr}</span><button onClick={function(){setCalMo(function(p){return p.m===11?{y:p.y+1,m:0}:{y:p.y,m:p.m+1};});}} style={{background:"none",border:"none",color:"#999",fontSize:26,cursor:"pointer",padding:"8px 16px"}}>{"\u203a"}</button></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
          {WDAYS.map(function(w){return <div key={w} style={{textAlign:"center",fontSize:12,fontWeight:600,color:"#aaa",padding:4}}>{w}</div>;})}
          {Array.from({length:fd},function(_,i){return <div key={"e"+i} style={{minHeight:48,background:"#fff",borderRadius:8}}/>;  })}
          {Array.from({length:dim},function(_,i){var dn=i+1,ds=yr+"-"+String(mo+1).padStart(2,"0")+"-"+String(dn).padStart(2,"0"),its=ibd[ds]||[];return(<div key={dn} style={{minHeight:48,background:"#fff",borderRadius:8,padding:"2px 3px",border:"1px solid "+(ds===todayStr?"#f97316":"#eeeef2"),cursor:its.length?"pointer":"default"}} onClick={function(){if(its.length){setDay(its[0].day);setVer(its[0].ver);goTo("publish");}}}>
            <span style={{fontSize:12,color:ds===todayStr?"#f97316":"#888",fontWeight:600}}>{dn}</span>
            <div style={{display:"flex",flexWrap:"wrap",gap:1,marginTop:1}}>{its.map(function(it,j){return <div key={j} style={{background:it.color,borderRadius:3,padding:"0 3px"}}><span style={{fontSize:10,color:"#fff",fontWeight:700}}>{it.day}v{it.vL}</span></div>;})}</div>
          </div>);})}
        </div>
      </div>):(<div style={{padding:"0 12px 80px"}}>{tl.length===0?<div style={{textAlign:"center",padding:50,color:"#888"}}>No dates set</div>:tl.map(function(it,i){var dd2=new Date(it.date+"T12:00:00");var isPast=it.date<todayStr;var isToday3=it.date===todayStr;return(<div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"12px 0",borderBottom:"1px solid #eeeef2",cursor:"pointer",opacity:isPast?0.4:1}} onClick={function(){setDay(it.day);setVer(it.ver);goTo("publish");}}>
        <div style={{textAlign:"center",minWidth:44}}><span style={{fontSize:22,fontWeight:700,color:isToday3?"#f97316":"#222"}}>{dd2.getDate()}</span><br/><span style={{fontSize:12,color:isToday3?"#f97316":"#888"}}>{MONTHS[dd2.getMonth()]}</span></div>
        <div style={{width:3,height:32,borderRadius:2,background:it.color}}/><div><span style={{fontSize:14,fontWeight:700,color:"#444"}}>Day {it.day} / v{it.vL}</span>{isToday3&&<span style={{fontSize:11,color:"#f97316",marginLeft:6,fontWeight:700,background:"#f9731630",padding:"1px 5px",borderRadius:4}}>TODAY</span>}<br/><span style={{fontSize:13,color:"#888"}}>{it.topicTitle}</span></div>
      </div>);})}</div>)}
    </div>);
  }

  if (view === "dashboard") {
    var cells=[];
    for(var di2=1;di2<=dayCount;di2++){(function(d){var allDn=dayAllDone(d);cells.push(<div key={"d"+d} style={{padding:"6px 2px",textAlign:"center",cursor:"pointer",borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",border:d===day?"1px solid #f97316":"1px solid transparent",background:d===day?"#f9731611":"transparent"}} onClick={function(){setDay(d);goTo("publish");}}><span style={{fontSize:13,fontWeight:600,color:allDn?"#22c55e":"#444"}}>{d}{allDn?" \u2713":""}</span><span style={{fontSize:11,color:"#aaa"}}>{dayPct(d)}%</span></div>);REAL_PLATFORMS.forEach(function(p){var k2="d"+d+"_"+p.id,ss=statuses[k2]||"not_started";cells.push(<div key={d+"_"+p.id} style={{borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",padding:8,cursor:"pointer",background:ST_C[ss]+"18",minHeight:32}} onClick={function(){setDay(d);setPlat(p.id);goTo("publish");}}><div style={{width:12,height:12,borderRadius:"50%",background:ST_C[ss]}}/></div>);});})(di2);}
    return(<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Home</button><span style={S.topT}>DASHBOARD</span><div style={{display:"flex",gap:4}}><button onClick={function(){if(dayCount<MAX_DAYS){setDayCount(dayCount+7);flash("Added 7 days");}}} style={{background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:8,padding:"6px 10px",fontSize:12,color:"#888",cursor:"pointer",fontWeight:600}}>+7 Days</button></div></div>
      <div style={{padding:"12px 8px 80px",overflowX:"auto"}}><div style={{display:"grid",gridTemplateColumns:"44px repeat("+REAL_PLATFORMS.length+",1fr)",gap:2,minWidth:400}}>
        <div style={{fontSize:10,fontWeight:700,color:"#aaa",textAlign:"center",padding:3}}>Day</div>
        {REAL_PLATFORMS.map(function(p){return <div key={p.id} style={{fontSize:11,textAlign:"center"}}><i className={p.icon} style={{color:p.color,fontSize:13}}/><br/><span style={{fontSize:11,color:"#999"}}>{p.label}</span></div>;})}
        {cells}
      </div></div>
    </div>);
  }

  if (view === "crossview") { return (<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Back</button><span style={S.topT}>DAY {day} CROSS</span><div style={{width:50}}/></div>
    <div style={{padding:"18px 20px 80px"}}>{REAL_PLATFORMS.map(function(p){var pcc=content[day]&&content[day].platforms&&content[day].platforms[p.id],cp=(pcc&&pcc.copy)||"",fl=scanAlgo(cp);return(<div key={p.id} style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:8,boxShadow:"0 1px 4px #00000006"}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><i className={p.icon} style={{fontSize:16,color:p.color}}/><span style={{fontSize:14,fontWeight:700,color:"#444",flex:1}}>{p.label}</span><span style={{fontSize:11,color:"#aaa"}}>{cp.length}ch</span><button onClick={function(){setPlat(p.id);setTab("template");goTo("publish");setTimeout(function(){openEd("copy");},100);}} style={{background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:8,padding:"6px 10px",fontSize:12,color:"#888",cursor:"pointer"}}>Edit</button><CopyBtn text={cp}/></div><div style={{fontSize:13,color:"#777",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{cp||"(empty)"}</div>{fl.length>0&&<div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:5}}>{fl.map(function(f,i){return <span key={i} style={{background:"#fef2f2",color:"#dc2626",padding:"2px 6px",borderRadius:4,fontSize:11}}>{f.word}</span>;})}</div>}</div>);})}</div>
  </div>);}

  if (view === "queue") { return (<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Back</button><span style={S.topT}>EDIT QUEUE</span><div style={{width:50}}/></div>
    <div style={{padding:"18px 20px 80px"}}>
      <div style={{fontSize:13,color:"#888",marginBottom:12}}>Media needing attention across all days and versions</div>
      {mediaQueue.length===0?<div style={{textAlign:"center",padding:40,color:"#aaa"}}>All clear. No media needs attention.</div>:mediaQueue.map(function(q,i){return <div key={i} onClick={function(){setDay(q.day);setVer(q.ver);setTab("media");goTo("publish");}} style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10,boxShadow:"0 1px 4px #00000006"}}>
        <div style={{width:8,height:36,borderRadius:4,background:M_ST_C[q.status],flexShrink:0}}/>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><span style={{fontSize:14,fontWeight:700,color:"#444"}}>Day {q.day} / v{q.vL}</span><span style={{fontSize:11,background:M_ST_C[q.status]+"22",color:M_ST_C[q.status],padding:"1px 6px",borderRadius:4,fontWeight:600}}>{M_ST_L[q.status]}</span></div>
          <div style={{fontSize:12,color:"#888"}}>{q.topicTitle}</div>
          <div style={{fontSize:12,color:q.need==="Needs editing"?"#f59e0b":"#999",fontWeight:600,marginTop:2}}>{q.need}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          {q.hasRaw&&<span style={{fontSize:10,background:"#f59e0b30",color:"#f59e0b",padding:"1px 5px",borderRadius:3}}>Uploaded</span>}
          {q.hasEdit&&<span style={{fontSize:10,background:"#3b82f630",color:"#3b82f6",padding:"1px 5px",borderRadius:3}}>Edited</span>}
        </div>
      </div>;})}
    </div>
  </div>);}

  if (view === "reference") { return (<div className="tfs-app" style={S.ctn}><div style={S.topBar}><button onClick={function(){goBack();}} style={S.back}><i className="fa-solid fa-arrow-left" style={{fontSize:13,marginRight:5}}/>Back</button><span style={S.topT}>REFERENCE</span><div style={{width:50}}/></div>
    <div style={{padding:"18px 20px 80px"}}>
      <div style={S.refSec}><div style={S.refT}>Salesy Frequency <span style={{fontWeight:400,fontSize:12,color:"#888"}}>(live: {salesyTotal} days tagged)</span></div>{SALESY_LEVELS.map(function(s,i){var cnt=salesyCounts[s.id]||0;var pctVal=salesyTotal?Math.round(cnt/salesyTotal*100):0;return <div key={i} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:700,color:"#444"}}>{s.label}</span><span style={{fontSize:12,color:s.color,fontWeight:600}}>{cnt} ({pctVal}%) <span style={{color:"#aaa"}}>target: {s.target}</span></span></div><div style={{height:8,background:"#f0f0f4",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,width:pctVal+"%",background:s.color,transition:"width 0.3s"}}/></div></div>;})}</div>
      <div style={S.refSec}><div style={S.refT}>Comp Hashtag Rotation <span style={{fontWeight:400,fontSize:12,color:"#888"}}>(target: 1-2x/week each)</span></div>{COMP_TAGS.map(function(h,i){return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid #f4f4f8"}}><span style={{fontSize:12,color:"#444"}}>{h}</span><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{display:"flex",gap:2}}>{Array.from({length:Math.max(hashtagUse[h],5)},function(_,j){return <div key={j} style={{width:8,height:8,borderRadius:2,background:j<hashtagUse[h]?"#f97316":"#f0f0f4"}}/>;})}</div><span style={{fontSize:12,color:hashtagUse[h]>0?"#f97316":"#aaa",fontWeight:600,minWidth:16,textAlign:"right"}}>{hashtagUse[h]}</span></div></div>;})}</div>
      <div style={S.refSec}><div style={S.refT}>CTA Mix</div>{[{t:"Comment",v:"30-40%"},{t:"Share",v:"15-20%"},{t:"Tag",v:"15-20%"},{t:"Follow",v:"10-15%"},{t:"Save",v:"5-10%"},{t:"None",v:"5-10%"}].map(function(c,i){return <div key={i} style={S.refR}><span style={S.refTy}>{c.t}</span><span style={{fontSize:13,color:"#f97316",fontWeight:600}}>{c.v}</span></div>;})}</div>
      <div style={S.refSec}><div style={S.refT}>Who Posts Where</div>{REAL_PLATFORMS.map(function(p,i){return <div key={i} style={S.refR}><span style={{fontSize:12,fontWeight:700,color:p.color,minWidth:80}}>{p.label||"X"}</span><span style={{fontSize:13,color:"#444"}}>{p.by} via {p.via}</span></div>;})}</div>
      <div style={S.refSec}><div style={S.refT}>Media Flow</div><div style={{fontSize:12,color:"#777",background:"#fff",borderRadius:10,padding:12,lineHeight:1.8,border:"1px solid #eeeef2"}}>{"1. Robert films on phone\n2. Uploads raw to Google Drive\n3. Steph downloads, edits in Filmora (auto-captions via Zoho login)\n4. Steph uploads to Filmora Cloud\n5. Steph marks Ready for Review in app\n6. Robert reviews in Filmora\n7. Robert exports final, uploads to Google Drive\n8. Robert adds trending sound natively per platform"}</div></div>
      <div style={S.refSec}><div style={S.refT}>Trending Audio</div><div style={{fontSize:12,color:"#777",background:"#fff",borderRadius:10,padding:12,lineHeight:1.8,border:"1px solid #eeeef2"}}>{"Supported: TikTok, Instagram, YouTube, Facebook\nNot supported: X, Threads\nNote: Instagram auto-mutes original audio when trending audio is added"}</div></div>
      <div style={S.refSec}><div style={S.refT}>Scheduling</div>{Object.keys(SCHED_NOTES).map(function(k,i){var pObj=PLATFORMS.find(function(p){return p.id===k;});return <div key={i} style={S.refR}><span style={{fontSize:12,fontWeight:700,color:pObj?pObj.color:"#444",minWidth:80}}>{pObj?(pObj.label||"X"):k}</span><span style={{fontSize:12,color:"#666"}}>{SCHED_NOTES[k]}</span></div>;})}</div>
      <div style={S.refSec}><div style={S.refT}>Algospeak</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{ALGO_WORDS.map(function(w,i){return <span key={i} style={{background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",padding:"4px 8px",borderRadius:6,fontSize:11}}>{w} {"\u2192"} {(ALGO_SAFE[w]||"").split("/")[0]}</span>;})}</div></div>
      <div style={S.refSec}><div style={S.refT}>Voice</div><div style={{fontSize:13,color:"#777",whiteSpace:"pre-wrap",background:"#fff",borderRadius:10,padding:12,lineHeight:1.7,border:"1px solid #eeeef2"}}>{"\"debut YA fantasy novel\"\n\"comes out Fall 2026\"\n\"500+ page book\"\n\"My wife and I\"\n\"8 years\"\nNo em dashes\nNo emojis TikTok/X\nNo ! in hooks\nSharing energy, not selling energy\nOne CTA per post, matched to content energy"}</div></div>
      <div style={S.refSec}><div style={S.refT}>Content Categories</div>{CONTENT_TYPES.filter(function(c){return c.id!=="none";}).map(function(c,i){return <div key={i} style={{fontSize:12,color:"#666",padding:"3px 0"}}><span style={{fontWeight:700,color:"#444"}}>{c.short}</span> {c.label}</div>;})}</div>
    </div>
  </div>);}

  // ==================================================================
  // MAIN PUBLISH VIEW
  // ==================================================================
  return(<div className="tfs-app" style={S.ctn}>
    <div style={S.hdr}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px 6px"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <button onClick={function(){goTo("tasks");}} style={{background:"none",border:"none",display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:0}}>
            <i className="fa-solid fa-fire" style={{fontSize:16,color:"#f97316"}}/>
            <span style={{fontSize:15,fontWeight:800,letterSpacing:3,color:"#f97316"}}>TFS PUBLISH</span>
          </button>
        </div>
        <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"flex-end"}}>
          <button title="Tasks" onClick={function(){goTo("tasks");}} style={Object.assign({},S.hBtn,{background:"#f9731620",border:"1px solid #f97316",color:"#f97316"})}><i className="fa-solid fa-list-check" style={{fontSize:14}}/></button>
          <button title="Week" onClick={function(){goTo("week");}} style={S.hBtn}><i className="fa-solid fa-calendar-week" style={{fontSize:13}}/></button>
          <button title="Calendar" onClick={function(){goTo("calendar");}} style={S.hBtn}><i className="fa-solid fa-calendar-days" style={{fontSize:13}}/></button>
          <button title="Dashboard" onClick={function(){goTo("dashboard");}} style={S.hBtn}><i className="fa-solid fa-grip" style={{fontSize:13}}/></button>
          <button title="Bulk Status" onClick={function(){goTo("bulkstatus");}} style={S.hBtn}><i className="fa-solid fa-check-double" style={{fontSize:12}}/></button>
          <button title="Cross-view" onClick={function(){goTo("crossview");}} style={S.hBtn}><i className="fa-solid fa-arrows-left-right" style={{fontSize:12}}/></button>
          <button title="Copy Diff" onClick={function(){goTo("copydiff");}} style={S.hBtn}><i className="fa-solid fa-code-compare" style={{fontSize:12}}/></button>
          <button title="Edit Queue" onClick={function(){goTo("queue");}} style={Object.assign({},S.hBtn,{position:"relative"})}><i className="fa-solid fa-pen" style={{fontSize:12}}/>{stephQueueCount>0&&<span style={{position:"absolute",top:-3,right:-3,background:"#ef4444",color:"#fff",fontSize:10,fontWeight:800,borderRadius:8,padding:"1px 4px",minWidth:12,textAlign:"center"}}>{stephQueueCount}</span>}</button>
          <button title="Analytics" onClick={function(){goTo("analytics");}} style={S.hBtn}><i className="fa-solid fa-chart-simple" style={{fontSize:12}}/></button>
          <button title="Reference" onClick={function(){goTo("reference");}} style={S.hBtn}><i className="fa-solid fa-circle-question" style={{fontSize:13}}/></button>
        </div>
      </div>
      <div style={{display:"flex",gap:3,padding:"0 16px 4px",justifyContent:"flex-end"}}>
          <button title="Import backup" onClick={doImport} style={Object.assign({},S.hBtn,{width:28,height:28})}><i className="fa-solid fa-folder-open" style={{fontSize:11}}/></button>
          <button title="Export backup" onClick={doExport} style={Object.assign({},S.hBtn,{width:28,height:28})}><i className="fa-solid fa-download" style={{fontSize:11}}/></button>
          {day>1&&<button title="Fill from previous day" onClick={function(){quickFill(day-1);}} style={Object.assign({},S.hBtn,{width:"auto",height:28,padding:"0 8px",fontSize:10,fontWeight:700,color:"#888"})}><i className="fa-solid fa-copy" style={{fontSize:10,marginRight:4}}/>D{day-1}</button>}
      </div>
      {timerMs>0&&<div style={{margin:"0 12px",padding:"8px 14px",background:timerMs<300000?"#ef444418":"#3b82f620",border:"1px solid "+(timerMs<300000?"#ef444444":"#3b82f650"),borderRadius:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:timerMs<300000?"#ef4444":"#3b82f6"}}><i className="fa-solid fa-stopwatch" style={{marginRight:6}}/>{timerPlat} Comments</span><span style={{fontSize:20,fontWeight:800,color:timerMs<300000?"#ef4444":"#3b82f6",fontVariantNumeric:"tabular-nums"}}>{fmtTimer(timerMs)}</span></div>}
      <div style={{display:"flex",alignItems:"center",padding:"8px 8px",gap:3}}>
        <button onClick={function(){setDay(Math.max(1,day-1));setShowDelDay(false);}} style={S.dArr}>{"\u2039"}</button>
        <button onClick={function(){setShowDP(!showDP);}} style={S.dDisp}>
          <span style={{fontSize:15,fontWeight:800,letterSpacing:2,color:"#f97316"}}>DAY {day}{dayAllDone(day)?" \u2713":""}{getVD(day,"a").date?" | "+fmtD(getVD(day,"a").date):""}</span>
          <span style={{fontSize:12,color:"#777"}}>{(dc&&dc.topicTitle)||"No topic set"}</span>
          <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:2}}>
            {cType&&cType.id!=="none"&&<span style={{fontSize:10,background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:4,padding:"1px 5px",color:"#666"}}>{cType.label}</span>}
            {sLevel&&sLevel.id!=="none"&&<span style={{fontSize:10,background:sLevel.color+"18",border:"1px solid "+sLevel.color+"33",borderRadius:4,padding:"1px 5px",color:sLevel.color}}>{sLevel.label}</span>}
          </div>
        </button>
        <button onClick={function(){setDay(Math.min(dayCount,day+1));setShowDelDay(false);}} style={S.dArr}>{"\u203a"}</button>
      </div>
      {showDP&&<div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,padding:"4px 12px 8px"}}>{Array.from({length:dayCount},function(_,i){return i+1;}).map(function(d){return <button key={d} onClick={function(){setDay(d);setShowDP(false);}} style={{background:d===day?"#f9731620":"#fff",border:"1px solid "+(d===day?"#f97316":"#eeeef2"),borderRadius:8,padding:"4px 2px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",opacity:content[d]?1:0.35}}><span style={{fontSize:14,fontWeight:700,color:dayAllDone(d)?"#22c55e":"#444"}}>{d}</span><span style={{fontSize:11,color:"#aaa"}}>{dayPct(d)}%</span></button>;})}</div>}
      <div style={{display:"flex",gap:3,padding:"4px 12px",overflowX:"auto"}}>{VERSIONS.map(function(v2){var vdi=getVD(day,v2.id);var vmk="d"+day+"_v"+v2.id;var vms=(media[vmk]||{}).mediaStatus||"no_media";return <button key={v2.id} onClick={function(){setVer(v2.id);}} style={{background:ver===v2.id?"#f9731620":"#fff",border:"1px solid "+(ver===v2.id?"#f97316":"#eeeef2"),borderRadius:10,padding:"9px 12px",fontSize:12,color:ver===v2.id?"#f97316":"#999",cursor:"pointer",flex:1,textAlign:"center",fontWeight:700,display:"flex",flexDirection:"column",alignItems:"center",gap:2,position:"relative"}}><span>{v2.label}</span>{vdi.date&&<span style={{fontSize:10,color:"#888"}}>{fmtD(vdi.date)}</span>}<span style={{width:7,height:7,borderRadius:"50%",background:M_ST_C[vms],position:"absolute",top:3,right:3}}/></button>;})}</div>
      <div style={{display:"flex",overflowX:"auto",padding:"0 6px",gap:1}}>{PLATFORMS.map(function(p,pi){var k2="d"+day+"_"+p.id,ss=p.special?null:(statuses[k2]||"not_started"),isA=plat===p.id;var showDiv=p.special&&pi===2;return <React.Fragment key={p.id}><button onClick={function(){setPlat(p.id);}} style={{background:"none",border:"none",borderBottom:"2px solid "+(isA?p.color:"transparent"),padding:"10px 12px 12px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:p.hideTabLabel?36:48,flexShrink:0,position:"relative"}}><i className={p.icon} style={{fontSize:16,color:isA?p.color:"#aaa"}}/>{!p.hideTabLabel&&<span style={{fontSize:12,fontWeight:700,color:isA?p.color:"#aaa"}}>{p.label}</span>}{ss&&<span style={{width:8,height:8,borderRadius:"50%",background:ST_C[ss],position:"absolute",top:4,right:4}}/>}</button>{showDiv&&<div style={{width:1,background:"#d4d4db",margin:"6px 2px",flexShrink:0}}/>}</React.Fragment>;})}</div>
    </div>

    <div style={{padding:"18px 20px 80px"}}>
      <div style={{display:"flex",justifyContent:"flex-end",gap:4,marginBottom:8,flexWrap:"wrap"}}>
        <button onClick={importDayMd} style={{background:"#f97316",border:"none",borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer"}}><i className="fa-solid fa-file-import" style={{marginRight:4}}/>Import Day</button>
        <button onClick={dlDayMd} style={{background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:600,color:"#888",cursor:"pointer"}}><i className="fa-solid fa-file-arrow-down" style={{marginRight:4}}/>Export MD</button>
        <button onClick={dlBlankMd} style={{background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:600,color:"#888",cursor:"pointer"}}><i className="fa-solid fa-file-lines" style={{marginRight:4}}/>Template</button>
        <button onClick={exportDayCopy} style={{background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:600,color:"#888",cursor:"pointer"}}><i className="fa-solid fa-copy" style={{marginRight:4}}/>Copy All</button>
      </div>

      {/* STORIES TAB */}
      {plat==="stories"&&<div>
        <div style={{background:"#a855f710",border:"1px solid #a855f730",borderRadius:14,padding:12,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:"#a855f7",marginBottom:6}}>Workflow</div>
          <div style={{fontSize:13,color:"#666",lineHeight:1.6}}>1. Design Stories 1 and 3 in Canva on desktop (1080x1920)<br/>2. Download to phone<br/>3. Post natively from phone on each checked platform<br/>4. Add stickers in-app after uploading<br/>5. Cannot schedule stories. Phone only</div>
        </div>
        {[{key:"s1",label:"Story 1",hasEquiv:true,hasAllFields:true},{key:"s2",label:"Story 2 (share-to-story)",hasEquiv:false,hasAllFields:false},{key:"s3",label:"Story 3",hasEquiv:true,hasAllFields:true}].map(function(s){var sd=stories[s.key]||{};var elems=sd.elements||[];var pt=sd.postTo||{tiktok:true,instagram:true,fb_personal:true};return <div key={s.key} style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}>
          <div style={{fontSize:14,fontWeight:800,color:"#a855f7",marginBottom:10}}>{s.label}</div>
          {s.hasAllFields&&<div style={{marginBottom:10}}><span style={{fontSize:12,fontWeight:700,color:"#444",display:"block",marginBottom:3}}>Format</span><div style={{display:"flex",gap:6}}>{["photo","video"].map(function(f){return <button key={f} onClick={function(){setStoryField(s.key,"format",f);}} style={{flex:1,background:(sd.format||"photo")===f?"#a855f720":"#f4f4f8",border:"1px solid "+((sd.format||"photo")===f?"#a855f7":"#eeeef2"),borderRadius:10,padding:"6px",fontSize:12,fontWeight:700,color:(sd.format||"photo")===f?"#a855f7":"#999",cursor:"pointer",textTransform:"capitalize"}}>{f}</button>;})}</div></div>}
          {s.hasAllFields&&<div style={{marginBottom:10}}><span style={{fontSize:12,fontWeight:700,color:"#444",display:"block",marginBottom:3}}>Visual</span><input type="text" value={sd.visual||""} onChange={function(e){setStoryField(s.key,"visual",e.target.value);}} placeholder="Description of image/video..." style={S.mI}/></div>}
          {s.hasAllFields&&<div style={{marginBottom:10}}><span style={{fontSize:12,fontWeight:700,color:"#444",display:"block",marginBottom:3}}>Script</span><textarea value={sd.script||""} onChange={function(e){setStoryField(s.key,"script",e.target.value);}} placeholder={sd.format==="video"?"What Robert says...":"Text designed in Canva..."} style={Object.assign({},S.mI,{minHeight:60,resize:"vertical"})}/></div>}
          <div style={{marginBottom:10}}><span style={{fontSize:12,fontWeight:700,color:"#444",display:"block",marginBottom:3}}>Text Overlay</span><input type="text" value={sd.textOverlay||""} onChange={function(e){setStoryField(s.key,"textOverlay",e.target.value);}} placeholder="Text overlay on story..." style={S.mI}/></div>
          <div style={{marginBottom:10}}><span style={{fontSize:12,fontWeight:700,color:"#444",display:"block",marginBottom:6}}>On-Screen Elements</span>
            {elems.map(function(el,ei){return <div key={ei} style={{background:"#fafafa",border:"1px solid #eeeef2",borderRadius:10,padding:10,marginBottom:6}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <select value={el.type||"text"} onChange={function(e){var ne=elems.slice();ne[ei]=Object.assign({},ne[ei],{type:e.target.value,options:""});setStoryField(s.key,"elements",ne);}} style={Object.assign({},S.dIn,{flex:1,marginRight:6})}>
                  <option value="text">Text</option><option value="poll">Sticker Poll</option><option value="question">Sticker Question</option><option value="quiz">Sticker Quiz</option><option value="link">Sticker Link</option><option value="countdown">Sticker Countdown</option>
                </select>
                <button onClick={function(){var ne=elems.slice();ne.splice(ei,1);setStoryField(s.key,"elements",ne);}} style={{background:"none",border:"none",color:"#ef4444",fontSize:14,cursor:"pointer"}}>{"\u2715"}</button>
              </div>
              <input type="text" value={el.content||""} onChange={function(e){var ne=elems.slice();ne[ei]=Object.assign({},ne[ei],{content:e.target.value});setStoryField(s.key,"elements",ne);}} placeholder={el.type==="poll"?"Poll question...":el.type==="quiz"?"Quiz question...":el.type==="question"?"Question for audience...":el.type==="link"?"Link URL...":el.type==="countdown"?"Countdown label...":"Text content..."} style={Object.assign({},S.mI,{marginBottom:4})}/>
              {(el.type==="poll"||el.type==="quiz")&&<input type="text" value={el.options||""} onChange={function(e){var ne=elems.slice();ne[ei]=Object.assign({},ne[ei],{options:e.target.value});setStoryField(s.key,"elements",ne);}} placeholder="Options (comma-separated, e.g., Yes, No, Maybe)" style={S.mI}/>}
            </div>;})}
            <button onClick={function(){setStoryField(s.key,"elements",elems.concat([{type:"text",content:"",options:""}]));}} style={{background:"#a855f710",border:"1px solid #a855f730",borderRadius:10,padding:"6px 14px",fontSize:11,fontWeight:700,color:"#a855f7",cursor:"pointer",width:"100%"}}>+ Add Element</button>
          </div>
          <div style={{marginBottom:10}}><span style={{fontSize:11,fontWeight:700,color:"#E1306C",display:"block",marginBottom:3}}>IG Story Caption / CTA</span><div style={{display:"flex",gap:6}}><input type="text" value={sd.igCaption||""} onChange={function(e){setStoryField(s.key,"igCaption",e.target.value);}} placeholder="Short conversational text..." style={Object.assign({},S.mI,{flex:1})}/>{shared.prompt&&<button onClick={function(){setStoryField(s.key,"igCaption",shared.prompt);flash("Pulled from Shared CTA");}} style={{background:"#E1306C",border:"none",borderRadius:10,padding:"6px 10px",fontSize:10,fontWeight:700,color:"#fff",cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>Pull CTA</button>}</div></div>
          <div style={{marginBottom:10}}><span style={{fontSize:12,fontWeight:700,color:"#444",display:"block",marginBottom:3}}>Post To</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{["tiktok","instagram","fb_personal"].map(function(pid){var pp=PLATFORMS.find(function(x){return x.id===pid;});var on=pt[pid];return <button key={pid} onClick={function(){togStoryPost(s.key,pid);}} style={{background:on?pp.color+"18":"#f4f4f8",border:"1px solid "+(on?pp.color+"44":"#eeeef2"),borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:600,color:on?pp.color:"#999",cursor:"pointer"}}><i className={pp.icon} style={{marginRight:4}}/>{pp.label}</button>;})}</div></div>
          {s.hasEquiv&&<div style={{marginBottom:4,borderTop:"1px solid #eeeef2",paddingTop:10}}><span style={{fontSize:11,fontWeight:700,color:"#444",display:"block",marginBottom:3}}>X / Threads Equivalent Post</span><textarea value={sd.equivPost||""} onChange={function(e){setStoryField(s.key,"equivPost",e.target.value);}} placeholder="Standalone post for X and Threads (no stories on these platforms, needs full context)..." style={Object.assign({},S.mI,{minHeight:60,resize:"vertical"})}/></div>}
        </div>;})}
      </div>}

      {/* SHARED TAB */}
      {plat==="shared"&&<div>
        <div style={{background:"#f9731610",border:"1px solid #f9731630",borderRadius:14,padding:12,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:"#f97316",marginBottom:4}}>How it works</div>
          <div style={{fontSize:13,color:"#666",lineHeight:1.6}}>Fill out shared content once. Check which platforms to push to. Hit Push to copy the value into each checked platform's field. Edit per-platform after pushing.</div>
        </div>

        {(function(){var ttVal=shared.topicTitle||(dc&&dc.topicTitle)||"";var ttPush=shared.topicTitlePush||["youtube","fb_personal","fb_page"];return <div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div><span style={{fontSize:13,fontWeight:700,color:"#555"}}>Topic Title</span><div style={{fontSize:11,color:"#aaa"}}>Day label. Also pushed as Title to selected platforms.</div></div><button onClick={function(){var v=shared.topicTitle||(dc&&dc.topicTitle)||"";if(!v){flash("Nothing to push");return;}ttPush.forEach(function(pid){setFld(day,pid,"title",v);});setMeta(day,"topicTitle",v);flash("Pushed to "+ttPush.length+" platforms");}} style={{background:"#f97316",border:"none",borderRadius:10,padding:"6px 14px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer",flexShrink:0}}>Push</button></div>
          <input type="text" value={ttVal} onChange={function(e){setShared("topicTitle",e.target.value);setMeta(day,"topicTitle",e.target.value);}} placeholder="e.g., Character Depth" style={S.mI}/>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>{REAL_PLATFORMS.filter(function(rp){return rp.id!=="fb_groups";}).map(function(rp){var on=ttPush.indexOf(rp.id)!==-1;return <button key={rp.id} onClick={function(){togSharedPush("topicTitle",rp.id);}} style={{background:on?rp.color+"18":"#f4f4f8",border:"1px solid "+(on?rp.color+"44":"#eeeef2"),borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,color:on?rp.color:"#bbb",cursor:"pointer"}}><i className={rp.icon} style={{marginRight:3,fontSize:10}}/>{rp.label||"X"}</button>;})}</div>
        </div>;})()}

        {(function(){var capVal=shared.caption||"";var capPush=shared.captionPush||["tiktok","instagram","youtube"];var minLimit=null;var limiter="";capPush.forEach(function(pid){var lim=PLAT_CHAR_LIMITS[pid];if(lim&&(minLimit===null||lim<minLimit)){minLimit=lim;var pp=PLATFORMS.find(function(x){return x.id===pid;});limiter=pp?(pp.label||"X"):pid;}});return <div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div><span style={{fontSize:13,fontWeight:700,color:"#555"}}>Caption / Description</span><div style={{fontSize:11,color:"#aaa"}}>Base copy for video platforms</div></div><button onClick={function(){pushShared("caption","copy");}} style={{background:"#f97316",border:"none",borderRadius:10,padding:"6px 14px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer",flexShrink:0}}>Push</button></div>
          <textarea value={capVal} onChange={function(e){setShared("caption",e.target.value);}} placeholder="Enter shared caption..." style={Object.assign({},S.mI,{minHeight:80,resize:"vertical"})}/>
          <AlgoW flags={scanAlgo(capVal)}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}><span style={{fontSize:11,color:minLimit&&capVal.length>minLimit?"#ef4444":"#aaa",fontWeight:600}}>{capVal.length}ch{minLimit?" / "+minLimit:""}</span>{limiter&&<span style={{fontSize:11,color:"#999"}}>Limit: {limiter}</span>}</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>{REAL_PLATFORMS.filter(function(rp){return rp.id!=="fb_groups";}).map(function(rp){var on=capPush.indexOf(rp.id)!==-1;return <button key={rp.id} onClick={function(){togSharedPush("caption",rp.id);}} style={{background:on?rp.color+"18":"#f4f4f8",border:"1px solid "+(on?rp.color+"44":"#eeeef2"),borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,color:on?rp.color:"#bbb",cursor:"pointer"}}><i className={rp.icon} style={{marginRight:3,fontSize:10}}/>{rp.label||"X"}</button>;})}</div>
        </div>;})()}

        {(function(){var htVal=shared.hashtags||"";var htPush=shared.hashtagsPush||["tiktok","instagram","youtube"];var htCount=htVal?htVal.split(/\s+/).filter(function(h){return h.startsWith("#");}).length:0;return <div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div><span style={{fontSize:13,fontWeight:700,color:"#555"}}>Hashtags</span><div style={{fontSize:11,color:"#aaa"}}>Base set (4 default). Per-platform limits applied on push.</div></div><button onClick={function(){var tags=htVal.split(/\s+/).filter(function(h){return h.startsWith("#");});htPush.forEach(function(pid){var lim=PLAT_HASHTAG_LIMITS[pid]||4;var trimmed=tags.slice(0,lim).join(" ");setFld(day,pid,"hashtags",trimmed);});flash("Pushed (trimmed per-platform)");}} style={{background:"#f97316",border:"none",borderRadius:10,padding:"6px 14px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer",flexShrink:0}}>Push</button></div>
          <textarea value={htVal} onChange={function(e){setShared("hashtags",e.target.value);}} placeholder="#thefirststone #yabooks #epicfantasy #bookstagram" style={Object.assign({},S.mI,{minHeight:44,resize:"vertical"})}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:11,color:"#aaa"}}>{htCount} tags entered</span></div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>{REAL_PLATFORMS.filter(function(rp){return rp.id!=="fb_groups"&&rp.id!=="fb_personal";}).map(function(rp){var on=htPush.indexOf(rp.id)!==-1;var lim=PLAT_HASHTAG_LIMITS[rp.id]||0;return <button key={rp.id} onClick={function(){togSharedPush("hashtags",rp.id);}} style={{background:on?rp.color+"18":"#f4f4f8",border:"1px solid "+(on?rp.color+"44":"#eeeef2"),borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,color:on?rp.color:"#bbb",cursor:"pointer"}}><i className={rp.icon} style={{marginRight:3,fontSize:10}}/>{rp.label||"X"} <span style={{color:"#bbb"}}>({lim})</span></button>;})}</div>
        </div>;})()}

        {[
          {key:"keywords",label:"On-Screen Keywords",hint:"Text overlay for indexing. Defaults to all platforms.",platField:"keywords",defaults:["tiktok","instagram","youtube","fb_page","fb_personal","x","threads"]},
          {key:"prompt",label:"Prompt / CTA Question",hint:"Shared question to drive engagement. Also used as IG Story caption.",platField:"prompt",defaults:["instagram"]}
        ].map(function(sf){var val=shared[sf.key]||"";var pushList=shared[sf.key+"Push"]||sf.defaults;return <div key={sf.key} style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div><span style={{fontSize:13,fontWeight:700,color:"#555"}}>{sf.label}</span><div style={{fontSize:11,color:"#aaa"}}>{sf.hint}</div></div><button onClick={function(){pushShared(sf.key,sf.platField);}} style={{background:"#f97316",border:"none",borderRadius:10,padding:"6px 14px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer",flexShrink:0}}>Push</button></div>
          <textarea value={val} onChange={function(e){setShared(sf.key,e.target.value);}} placeholder={"Enter shared "+sf.label.toLowerCase()+"..."} style={Object.assign({},S.mI,{minHeight:44,resize:"vertical",marginBottom:4})}/>
          <AlgoW flags={scanAlgo(val)}/>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{REAL_PLATFORMS.filter(function(rp){return rp.id!=="fb_groups";}).map(function(rp){var on=pushList.indexOf(rp.id)!==-1;return <button key={rp.id} onClick={function(){togSharedPush(sf.key,rp.id);}} style={{background:on?rp.color+"18":"#f4f4f8",border:"1px solid "+(on?rp.color+"44":"#eeeef2"),borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,color:on?rp.color:"#bbb",cursor:"pointer"}}><i className={rp.icon} style={{marginRight:3,fontSize:10}}/>{rp.label||"X"}</button>;})}</div>
        </div>;})}

        {(function(){var musVal=shared.music||"";var musPush=shared.musicPush||["tiktok","instagram","youtube","fb_page"];return <div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div><span style={{fontSize:13,fontWeight:700,color:"#555"}}>Music / Trending Sound</span><div style={{fontSize:11,color:"#aaa"}}>Per version and per platform. TikTok, IG, YT, FB support trending audio. X and Threads do not.</div></div><button onClick={function(){if(!musVal){flash("Nothing to push");return;}musPush.forEach(function(pid){setFld(day,pid,"musicNote",musVal);});flash("Pushed to "+musPush.length+" platforms");}} style={{background:"#f97316",border:"none",borderRadius:10,padding:"6px 14px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer",flexShrink:0}}>Push</button></div>
          <textarea value={musVal} onChange={function(e){setShared("music",e.target.value);}} placeholder="Mood, what to search for, trending sound name..." style={Object.assign({},S.mI,{minHeight:44,resize:"vertical"})}/>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>{TRENDING_PLATFORMS.map(function(pid){var rp=PLATFORMS.find(function(x){return x.id===pid;});var on=musPush.indexOf(pid)!==-1;return <button key={pid} onClick={function(){togSharedPush("music",pid);}} style={{background:on?rp.color+"18":"#f4f4f8",border:"1px solid "+(on?rp.color+"44":"#eeeef2"),borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,color:on?rp.color:"#bbb",cursor:"pointer"}}><i className={rp.icon} style={{marginRight:3,fontSize:10}}/>{rp.label}</button>;})}<span style={{fontSize:10,color:"#ccc",padding:"6px 10px"}}>X, Threads: no trending audio</span></div>
        </div>;})()}
      </div>}

      {/* EDITING TAB */}
      {plat==="editing"&&<div>
        <div style={{background:"#2563eb10",border:"1px solid #2563eb30",borderRadius:14,padding:12,marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:800,color:"#2563eb",marginBottom:4}}>Editing v{ver.toUpperCase()}</div>
          <div style={{fontSize:12,color:"#777"}}>Universal video editing checklist for this version. Not platform-specific.</div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:13,fontWeight:700,color:"#a855f7",textTransform:"uppercase",letterSpacing:0.5}}>Steph's Section</span></div>
          {EDITING_CL.steph.map(function(it,i){var ck="steph_"+i;var done=!!editCk[ck];return <div key={ck} onClick={function(){toggleEditCk(ck);}} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",marginBottom:6,background:done?"#f0fdf4":"#fff",border:"1px solid "+(done?"#bbf7d0":"#eeeef2"),borderRadius:14,cursor:"pointer",boxShadow:done?"none":"0 1px 4px #00000006"}}><div style={{width:28,height:28,borderRadius:8,border:"2px solid "+(done?"#22c55e":"#ccc"),background:done?"#22c55e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{done&&<i className="fa-solid fa-check" style={{color:"#fff",fontSize:12}}/>}</div><span style={{fontSize:15,color:done?"#999":"#333",textDecoration:done?"line-through":"none",lineHeight:1.4}}>{it}</span></div>;})}
        </div>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:13,fontWeight:700,color:"#f97316",textTransform:"uppercase",letterSpacing:0.5}}>Robert's Section</span></div>
          {EDITING_CL.robert.map(function(it,i){var ck="robert_"+i;var done=!!editCk[ck];return <div key={ck} onClick={function(){toggleEditCk(ck);}} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",marginBottom:6,background:done?"#f0fdf4":"#fff",border:"1px solid "+(done?"#bbf7d0":"#eeeef2"),borderRadius:14,cursor:"pointer",boxShadow:done?"none":"0 1px 4px #00000006"}}><div style={{width:28,height:28,borderRadius:8,border:"2px solid "+(done?"#22c55e":"#ccc"),background:done?"#22c55e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{done&&<i className="fa-solid fa-check" style={{color:"#fff",fontSize:12}}/>}</div><span style={{fontSize:15,color:done?"#999":"#333",textDecoration:done?"line-through":"none",lineHeight:1.4}}>{it}</span></div>;})}
        </div>
        <div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:14,boxShadow:"0 1px 4px #00000006"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#555",marginBottom:8}}>Platforms sharing this export</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{REAL_PLATFORMS.filter(function(rp){return rp.id!=="fb_groups";}).map(function(rp){var eKey="export_"+rp.id;var on=!!editCk[eKey];return <button key={rp.id} onClick={function(){toggleEditCk(eKey);}} style={{background:on?rp.color+"18":"#f4f4f8",border:"1px solid "+(on?rp.color+"44":"#eeeef2"),borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:600,color:on?rp.color:"#bbb",cursor:"pointer"}}><i className={rp.icon} style={{marginRight:4}}/>{rp.label}</button>;})}</div>
        </div>
      </div>}

      {/* PLATFORM TABS (checklist/template/media) */}
      {!isSpecial&&<div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
        <button onClick={function(){setShowConfirm(true);}} style={{border:"none",borderRadius:10,padding:"7px 14px",fontSize:12,fontWeight:800,color:"#fff",cursor:"pointer",textTransform:"uppercase",letterSpacing:0.5,background:ST_C[st]}}>{ST_L[st]}</button>
        <div style={{flex:1,height:8,background:"#f0f0f4",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,width:pct+"%",background:aPlat?aPlat.color:"#f97316",transition:"width 0.3s"}}/></div>
        <span style={{fontSize:12,color:"#999",fontWeight:600}}>{doneN}/{allI.length}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <span style={{fontSize:12,color:aPlat?aPlat.color:"#888",fontWeight:600}}>{aPlat?aPlat.by:""} via {aPlat?aPlat.via:""}</span>
        <div style={{display:"flex",background:"#fff",border:"1px solid #eeeef2",borderRadius:10,overflow:"hidden"}}>
          {["checklist","template","media"].map(function(t){return <button key={t} onClick={function(){setTab(t);}} style={{background:eTab===t?"#f9731630":"transparent",border:"none",borderRight:t!=="media"?"1px solid #eeeef2":"none",padding:"7px 14px",fontSize:12,fontWeight:700,color:eTab===t?"#f97316":"#999",cursor:"pointer",textTransform:"capitalize"}}>{t}</button>;})}
        </div>
      </div>
      {SCHED_NOTES[plat]&&<div style={{background:"#f4f4f8",border:"1px solid #eeeef2",borderRadius:10,padding:"6px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:6}}><i className="fa-solid fa-clock" style={{fontSize:11,color:"#999"}}/><span style={{fontSize:12,color:"#777"}}>{SCHED_NOTES[plat]}</span></div>}

      {showConfirm&&<div style={{background:"#fff",border:"1px solid #d4d4db",borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 2px 8px #00000010"}}>
        <div style={{fontSize:14,fontWeight:700,color:"#222",marginBottom:10}}>Change status to:</div>
        <div style={{display:"flex",gap:6}}>{["not_started","drafted","posted","done"].map(function(s){return <button key={s} onClick={function(){setSt(function(p){var o=Object.assign({},p);o[pK]=s;return o;});if(s==="posted"){setTm(function(p){var o=Object.assign({},p);o[pK]=Date.now();return o;});sendPostEmail(day,plat);flash("Timer started");}else if(s==="done"){var nxt=REAL_PLATFORMS.find(function(p2){return p2.id!==plat&&(statuses["d"+day+"_"+p2.id]||"not_started")!=="done";});if(nxt){setPlat(nxt.id);flash("\u2713 Done. Next: "+nxt.label);}else{flash("\u2713 All platforms done!");}}else{flash(ST_L[s]);}setShowConfirm(false);}} style={{flex:1,background:s===st?ST_C[s]+"33":ST_C[s]+"11",border:"2px solid "+(s===st?ST_C[s]:ST_C[s]+"44"),borderRadius:10,padding:"8px 4px",fontSize:11,fontWeight:700,color:ST_C[s],cursor:"pointer",textTransform:"uppercase"}}>{ST_L[s]}</button>;})}
        </div>
        <button onClick={function(){setShowConfirm(false);}} style={{width:"100%",marginTop:8,background:"none",border:"1px solid #eeeef2",borderRadius:10,padding:"6px",fontSize:12,color:"#999",cursor:"pointer"}}>Cancel</button>
      </div>}
      {!showConfirm&&pct===100&&st!=="done"&&st!=="posted"&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:"8px 12px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,color:"#22c55e"}}>Checklist complete. Ready to post?</span><button onClick={function(){setShowConfirm(true);}} style={{background:"#22c55e",border:"none",borderRadius:8,padding:"4px 12px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer"}}>Set Status</button></div>}

      {eTab==="checklist"&&(<div>
        {pc&&pc.copy&&<div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:13,fontWeight:700,color:"#888",textTransform:"uppercase"}}>Caption</span><div style={{display:"flex",gap:6}}><button onClick={function(){openEd("copy");}} style={S.eBtn}>Edit</button></div></div>
          <div onClick={function(){navigator.clipboard.writeText(pc.copy).then(function(){flash("Caption copied");});}} style={{fontSize:14,color:"#2d2d3d",whiteSpace:"pre-wrap",wordBreak:"break-word",lineHeight:1.6,cursor:"pointer",borderRadius:10,padding:8,background:"#fafafa",border:"1px solid #eeeef2"}}>{pc.copy}</div>
          <AlgoW flags={scanAlgo(pc.copy)}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}><span style={{fontSize:11,color:"#aaa"}}>{pc.copy.length}ch</span><span style={{fontSize:11,color:"#bbb"}}>Tap text to copy</span></div>
          <button onClick={function(){navigator.clipboard.writeText(pc.copy).then(function(){flash("Caption copied");});}} style={{width:"100%",marginTop:8,background:"#f97316",border:"none",borderRadius:14,padding:"14px",fontSize:15,fontWeight:700,color:"#fff",cursor:"pointer"}}>Copy Caption</button>
        </div>}
        {pc&&pc.hashtags&&<div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:13,fontWeight:700,color:"#888",textTransform:"uppercase"}}>Hashtags</span></div><div onClick={function(){navigator.clipboard.writeText(pc.hashtags).then(function(){flash("Hashtags copied");});}} style={{fontSize:14,color:"#2563eb",cursor:"pointer",borderRadius:10,padding:8,background:"#fafafa",border:"1px solid #eeeef2"}}>{pc.hashtags}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}><span style={{fontSize:11,color:"#bbb"}}>Tap text to copy</span></div><button onClick={function(){navigator.clipboard.writeText(pc.hashtags).then(function(){flash("Hashtags copied");});}} style={{width:"100%",marginTop:8,background:"#2563eb",border:"none",borderRadius:14,padding:"12px",fontSize:14,fontWeight:700,color:"#fff",cursor:"pointer"}}>Copy Hashtags</button></div>}
        {pc&&pc.title&&<div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:13,fontWeight:700,color:"#888",textTransform:"uppercase"}}>Title</span><button onClick={function(){openEd("title");}} style={S.eBtn}>Edit</button></div><div onClick={function(){navigator.clipboard.writeText(pc.title).then(function(){flash("Title copied");});}} style={{fontSize:14,color:"#2d2d3d",cursor:"pointer",borderRadius:10,padding:8,background:"#fafafa",border:"1px solid #eeeef2"}}>{pc.title}</div><button onClick={function(){navigator.clipboard.writeText(pc.title).then(function(){flash("Title copied");});}} style={{width:"100%",marginTop:8,background:"#666",border:"none",borderRadius:14,padding:"12px",fontSize:14,fontWeight:700,color:"#fff",cursor:"pointer"}}>Copy Title</button></div>}
        {pc&&pc.description&&(plat==="youtube"||plat==="fb_page")&&<div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:13,fontWeight:700,color:"#888",textTransform:"uppercase"}}>Description</span><button onClick={function(){openEd("description");}} style={S.eBtn}>Edit</button></div><div onClick={function(){navigator.clipboard.writeText(pc.description).then(function(){flash("Description copied");});}} style={{fontSize:14,color:"#2d2d3d",whiteSpace:"pre-wrap",cursor:"pointer",borderRadius:10,padding:8,background:"#fafafa",border:"1px solid #eeeef2"}}>{pc.description}</div><button onClick={function(){navigator.clipboard.writeText(pc.description).then(function(){flash("Description copied");});}} style={{width:"100%",marginTop:8,background:"#666",border:"none",borderRadius:14,padding:"12px",fontSize:14,fontWeight:700,color:"#fff",cursor:"pointer"}}>Copy Description</button></div>}
        {pc&&pc.reel_title&&plat==="fb_page"&&<div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:13,fontWeight:700,color:"#888",textTransform:"uppercase"}}>Reel Title</span><button onClick={function(){openEd("reel_title");}} style={S.eBtn}>Edit</button></div><div onClick={function(){navigator.clipboard.writeText(pc.reel_title).then(function(){flash("Reel title copied");});}} style={{fontSize:14,color:"#2d2d3d",cursor:"pointer",borderRadius:10,padding:8,background:"#fafafa",border:"1px solid #eeeef2"}}>{pc.reel_title}</div><button onClick={function(){navigator.clipboard.writeText(pc.reel_title).then(function(){flash("Reel title copied");});}} style={{width:"100%",marginTop:8,background:"#666",border:"none",borderRadius:14,padding:"12px",fontSize:14,fontWeight:700,color:"#fff",cursor:"pointer"}}>Copy Reel Title</button></div>}
        {pc&&pc.prompt&&plat==="instagram"&&<div style={{background:"#fff",border:"1px solid #E1306C30",borderRadius:14,padding:12,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:12,fontWeight:700,color:"#E1306C",textTransform:"uppercase"}}>Comment Prompt</span><button onClick={function(){openEd("prompt");}} style={S.eBtn}>Edit</button></div><div onClick={function(){navigator.clipboard.writeText(pc.prompt).then(function(){flash("Prompt copied");});}} style={{fontSize:14,color:"#2d2d3d",cursor:"pointer",borderRadius:10,padding:8,background:"#fafafa",border:"1px solid #eeeef2"}}>{pc.prompt}</div><button onClick={function(){navigator.clipboard.writeText(pc.prompt).then(function(){flash("Prompt copied");});}} style={{width:"100%",marginTop:8,background:"#E1306C",border:"none",borderRadius:14,padding:"12px",fontSize:14,fontWeight:700,color:"#fff",cursor:"pointer"}}>Copy Prompt</button></div>}
        {pc&&pc.tags&&plat==="youtube"&&<div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:13,fontWeight:700,color:"#888",textTransform:"uppercase"}}>Tags</span><button onClick={function(){openEd("tags");}} style={S.eBtn}>Edit</button></div><div onClick={function(){navigator.clipboard.writeText(pc.tags).then(function(){flash("Tags copied");});}} style={{fontSize:14,color:"#2d2d3d",cursor:"pointer",borderRadius:10,padding:8,background:"#fafafa",border:"1px solid #eeeef2"}}>{pc.tags}</div><button onClick={function(){navigator.clipboard.writeText(pc.tags).then(function(){flash("Tags copied");});}} style={{width:"100%",marginTop:8,background:"#666",border:"none",borderRadius:14,padding:"12px",fontSize:14,fontWeight:700,color:"#fff",cursor:"pointer"}}>Copy Tags</button></div>}
        {pc&&pc.relatedVideo&&<div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:13,fontWeight:700,color:"#888",textTransform:"uppercase"}}>Related Video</span><button onClick={function(){openEd("relatedVideo");}} style={S.eBtn}>Edit</button></div><div style={{fontSize:13,color:"#777"}}>{pc.relatedVideo}</div></div>}
        <div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:14,padding:12,marginBottom:14,cursor:"pointer",boxShadow:"0 1px 4px #00000006"}} onClick={function(){openEd("notes");}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:13,fontWeight:700,color:"#888",textTransform:"uppercase"}}>Notes</span><button onClick={function(e){e.stopPropagation();openEd("notes");}} style={S.eBtn}>{myN?"Edit":"Add"}</button></div>{myN?<div style={{fontSize:13,color:"#777",whiteSpace:"pre-wrap"}}>{myN}</div>:<div style={S.tfE}>Tap anywhere to write</div>}</div>
        {plat==="fb_groups"&&<div style={{background:"#fff",border:"1px solid #f9731640",borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:15,fontWeight:800,color:"#f97316"}}>Groups Tracker</span>
            <span style={{fontSize:18,fontWeight:800,color:"#f97316"}}>{globalGroups.filter(function(gName){return gd[gName]&&gd[gName].shared;}).length}<span style={{fontSize:13,fontWeight:600,color:"#999"}}>/{globalGroups.length}</span></span>
          </div>
          {globalGroups.map(function(gName,i){var gs=gd[gName]||{};return <div key={gName} onClick={function(){togGrp(gName,"shared");}} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",marginBottom:6,background:gs.shared?"#f0fdf4":"#fff",border:"1px solid "+(gs.shared?"#bbf7d0":"#eeeef2"),borderRadius:14,cursor:"pointer"}}>
            <div style={{width:28,height:28,borderRadius:8,border:"2px solid "+(gs.shared?"#22c55e":"#ccc"),background:gs.shared?"#22c55e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{gs.shared&&<i className="fa-solid fa-check" style={{color:"#fff",fontSize:12}}/>}</div>
            <span style={{flex:1,fontSize:14,color:gs.shared?"#999":"#444",textDecoration:gs.shared?"line-through":"none"}}>{gName}</span>
            {gs.pending&&<span style={{fontSize:10,color:"#f59e0b",background:"#f59e0b20",padding:"2px 6px",borderRadius:4,fontWeight:600}}>Pending</span>}
            {gs.time&&<span style={{fontSize:11,color:"#aaa"}}>{gs.time}</span>}
            <button onClick={function(e){e.stopPropagation();togGrp(gName,"pending");}} style={{background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:8,fontSize:12,color:"#888",cursor:"pointer",padding:"6px 10px",marginLeft:2}}>?</button>
            {delGrpIdx===i?<div style={{display:"flex",gap:3,marginLeft:4}}><button onClick={function(e){e.stopPropagation();removeGlobalGrp(i);setDelGrp(null);}} style={{background:"#ef4444",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",padding:"6px 10px"}}>Yes</button><button onClick={function(e){e.stopPropagation();setDelGrp(null);}} style={{background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:8,color:"#888",fontSize:11,cursor:"pointer",padding:"6px 10px"}}>No</button></div>:<button onClick={function(e){e.stopPropagation();setDelGrp(i);}} style={{background:"none",border:"1px solid #ef444440",borderRadius:8,color:"#ef4444",fontSize:12,cursor:"pointer",padding:"6px 10px",marginLeft:4}}>{"\u2715"}</button>}
          </div>;})}
          <div style={{display:"flex",gap:6,marginTop:8}}><input type="text" placeholder="Add group name..." style={Object.assign({},S.mI,{flex:1,borderRadius:12,padding:"10px 12px"})} onKeyDown={function(e){if(e.key==="Enter"&&e.target.value){addGlobalGrp(e.target.value);e.target.value="";}}} id="grpInput"/><button onClick={function(){var inp=document.getElementById("grpInput");if(inp&&inp.value){addGlobalGrp(inp.value);inp.value="";}}} style={{background:"#f97316",border:"none",borderRadius:12,padding:"10px 16px",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer",flexShrink:0}}>Add</button></div>
        </div>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:14,fontWeight:800,color:"#f97316",textTransform:"uppercase",letterSpacing:1}}>Checklist</span>
          <button onClick={resetCk} style={{background:"#ef444418",border:"1px solid #ef444440",borderRadius:8,padding:"6px 12px",fontSize:11,color:"#ef4444",cursor:"pointer",fontWeight:600}}>Reset</button>
        </div>
        {ver!=="a"&&doneN>0&&<div style={{background:"#f59e0b11",border:"1px solid #f59e0b33",borderRadius:12,padding:"8px 12px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,color:"#f59e0b"}}>v{ver.toUpperCase()} using vA checks. Reset?</span><button onClick={resetCk} style={{background:"#f59e0b",border:"none",borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer"}}>Reset</button></div>}
        {renderCL("Upload",cl&&cl.pre)}{renderCL("Caption",cl&&cl.caption)}{renderCL("Settings",cl&&cl.settings)}{renderCL("After",cl&&cl.post)}{renderCL("Stories",cl&&cl.stories)}
      </div>)}

      {eTab==="template"&&(<div>
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          <div style={{flex:1}}><span style={{fontSize:11,fontWeight:700,color:"#999",display:"block",marginBottom:3}}>Content Type</span><select value={(dc&&dc.contentType)||"none"} onChange={function(e){setMeta(day,"contentType",e.target.value);}} style={S.dIn}>{CONTENT_TYPES.map(function(c){return <option key={c.id} value={c.id}>{c.label}</option>;})}</select></div>
          <div style={{flex:1}}><span style={{fontSize:11,fontWeight:700,color:"#999",display:"block",marginBottom:3}}>Salesy Level</span><select value={(dc&&dc.salesy)||"none"} onChange={function(e){setMeta(day,"salesy",e.target.value);setMeta(day,"salesyDate",vd.date||new Date().toISOString().slice(0,10));}} style={S.dIn}>{SALESY_LEVELS.map(function(s){return <option key={s.id} value={s.id}>{s.label}</option>;})}</select></div>
        </div>
        {(dc&&dc.salesy&&dc.salesy!=="none")&&<div style={{background:"#fff",border:"1px solid #eeeef2",borderRadius:12,padding:"8px 12px",marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:4}}>Recent Salesy Pattern</div>
          <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{(function(){var items=[];for(var ri=Math.max(1,day-6);ri<=Math.min(dayCount,day+3);ri++){var rc=content[ri];if(!rc)continue;var rs=rc.salesy||"none";var sl2=SALESY_LEVELS.find(function(x){return x.id===rs;});var rd=rc.salesyDate||"";items.push(<div key={ri} style={{textAlign:"center",padding:"6px 10px",borderRadius:8,background:ri===day?"#f9731615":"transparent",border:ri===day?"1px solid #f9731640":"1px solid transparent",minWidth:36}}><div style={{fontSize:10,fontWeight:700,color:ri===day?"#f97316":"#888"}}>D{ri}</div><div style={{width:8,height:8,borderRadius:"50%",background:sl2?sl2.color:"#f0f0f4",margin:"2px auto"}}/><div style={{fontSize:11,color:"#bbb"}}>{rd?fmtD(rd):""}</div></div>);}return items;})()}</div>
        </div>}
        <div style={S.tf}><div style={S.tfH}><span style={S.tfL}>v{ver.toUpperCase()} Post Date + Time</span></div><div style={S.tfHi}>{ver==="a"?"Set vA first. vB+14 vC+28 auto.":"Auto from vA."}</div><div style={{display:"flex",gap:6}}><input type="date" value={vd.date||""} onChange={function(e){if(ver==="a")onADate(day,e.target.value);else setVF(day,ver,"date",e.target.value);}} style={Object.assign({},S.dIn,{flex:2})}/><input type="time" value={(dc&&dc.postTime)||""} onChange={function(e){setMeta(day,"postTime",e.target.value);}} style={Object.assign({},S.dIn,{flex:1})}/></div></div>
        <div style={Object.assign({},S.tf,{cursor:"pointer"})} onClick={function(){openEd("musicNotes");}}><div style={S.tfH}><span style={S.tfL}>Sound / Music</span><button onClick={function(e){e.stopPropagation();openEd("musicNotes");}} style={S.eBtn}>{vd.musicNotes?"Edit":"Set"}</button></div>{vd.musicNotes?<div style={S.tfV}>{vd.musicNotes}</div>:<div style={S.tfE}>Tap anywhere to write</div>}</div>
        {tpl&&tpl.map(function(f){var val=(pc&&pc[f.key])||"",fl=f.multi?scanAlgo(val):[];return(<div key={f.key} style={Object.assign({},S.tf,{cursor:"pointer"})} onClick={function(){openEd(f.key);}}><div style={S.tfH}><span style={S.tfL}>{f.label}</span><div style={{display:"flex",gap:6}}><button onClick={function(e){e.stopPropagation();openEd(f.key);}} style={S.eBtn}>{val?"Edit":"Write"}</button><CopyBtn text={val}/></div></div><div style={S.tfHi}>{f.hint}</div>{val?<div style={S.tfV}>{val}{f.max&&<div style={{fontSize:11,color:val.length>f.max?"#ef4444":"#aaa",textAlign:"right",marginTop:2}}>{val.length}/{f.max}{val.length>f.max&&<span> Over!</span>}</div>}</div>:<div style={S.tfE}>Tap anywhere to write</div>}<AlgoW flags={fl}/></div>);})}
        {(plat==="tiktok"||plat==="instagram"||plat==="fb_personal")&&<div style={{background:"#a855f708",border:"1px solid #a855f720",borderRadius:14,padding:12,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:13,fontWeight:700,color:"#a855f7"}}>Stories</span><div style={{fontSize:11,color:"#999"}}>Manage all stories in the Stories tab</div></div><button onClick={function(){setPlat("stories");}} style={{background:"#a855f7",border:"none",borderRadius:10,padding:"6px 14px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer"}}>Go to Stories</button></div>
        </div>}
        {plat==="youtube"&&<div style={{background:"#fff",border:"1px solid #FF000030",borderRadius:14,padding:12,marginBottom:14,boxShadow:"0 1px 4px #00000006"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:13,fontWeight:700,color:"#FF0000"}}>Community Post</span>{shared.prompt&&<button onClick={function(){setMeta(day,"ytCommCaption",shared.prompt);if(!dc||!dc.ytCommPollQ)setMeta(day,"ytCommPollQ",shared.prompt);flash("Pulled from Shared CTA");}} style={{background:"#FF0000",border:"none",borderRadius:8,padding:"4px 10px",fontSize:10,fontWeight:700,color:"#fff",cursor:"pointer"}}>Pull Shared CTA</button>}</div>
          <div style={{fontSize:12,color:"#888",marginBottom:10}}>Image only (no video). Use story photo. Conversational caption ending with engagement question.</div>
          <div style={{marginBottom:8}}><span style={{fontSize:12,fontWeight:700,color:"#444"}}>Caption</span><textarea value={(dc&&dc.ytCommCaption)||""} onChange={function(e){setMeta(day,"ytCommCaption",e.target.value);}} placeholder="Conversational caption ending with a question..." style={Object.assign({},S.mI,{minHeight:60,resize:"vertical"})}/>{(dc&&dc.ytCommCaption)&&<div style={{display:"flex",justifyContent:"flex-end",marginTop:3}}><CopyBtn text={dc.ytCommCaption}/></div>}</div>
          <div style={{marginBottom:8}}><span style={{fontSize:12,fontWeight:700,color:"#444"}}>Engagement Type</span><select value={(dc&&dc.ytCommType)||"none"} onChange={function(e){setMeta(day,"ytCommType",e.target.value);}} style={Object.assign({},S.dIn,{marginTop:2})}><option value="none">None</option><option value="poll">Poll</option><option value="quiz">Quiz</option><option value="question">Open Question</option></select></div>
          {(dc&&(dc.ytCommType==="poll"||dc.ytCommType==="quiz"))&&<div style={{marginBottom:8}}><span style={{fontSize:12,fontWeight:700,color:"#444"}}>{dc.ytCommType==="poll"?"Poll":"Quiz"} Question</span><input type="text" value={(dc&&dc.ytCommPollQ)||""} onChange={function(e){setMeta(day,"ytCommPollQ",e.target.value);}} placeholder="e.g. Which faction would you join?" style={Object.assign({},S.mI,{fontSize:12,padding:"6px 10px"})}/></div>}
          {(dc&&(dc.ytCommType==="poll"||dc.ytCommType==="quiz"))&&<div style={{marginBottom:8,paddingLeft:10,borderLeft:"2px solid #FF000040"}}>{(dc.ytCommPollOpts||["","",""]).map(function(opt,oi){return <div key={oi} style={{marginBottom:4}}><input type="text" value={opt} onChange={function(e){setMeta(day,"ytCommPollOpts",(dc.ytCommPollOpts||["","",""]).map(function(o,j){return j===oi?e.target.value:o;}));}} placeholder={"Option "+(oi+1)} style={Object.assign({},S.mI,{fontSize:12,padding:"6px 10px"})}/></div>;})}
          <button onClick={function(){setMeta(day,"ytCommPollOpts",(dc.ytCommPollOpts||["","",""]).concat([""]));}} style={{background:"none",border:"1px solid #d4d4db",borderRadius:8,padding:"6px 12px",fontSize:12,color:"#888",cursor:"pointer"}}>+ Option</button></div>}
          <div style={{marginBottom:4}}><span style={{fontSize:12,fontWeight:700,color:"#444"}}>Image Link</span><input type="text" value={(dc&&dc.ytCommImage)||""} onChange={function(e){setMeta(day,"ytCommImage",e.target.value);}} placeholder="Paste story image link..." style={Object.assign({},S.mI,{fontSize:12,padding:"6px 10px"})}/>{dc&&dc.ytCommImage&&isImgUrl(dc.ytCommImage)&&<div style={{marginTop:6,borderRadius:10,overflow:"hidden",border:"1px solid #d4d4db",maxWidth:120}}><img src={dc.ytCommImage} alt="Community post" style={{width:"100%",display:"block"}} onError={function(e){e.target.style.display="none";}}/></div>}</div>
        </div>}
        <div style={Object.assign({},S.tf,{cursor:"pointer"})} onClick={function(){openEd("notes");}}><div style={S.tfH}><span style={S.tfL}>My Notes</span><button onClick={function(e){e.stopPropagation();openEd("notes");}} style={S.eBtn}>{myN?"Edit":"Add"}</button></div>{myN?<div style={S.tfV}>{myN}</div>:<div style={S.tfE}>Tap anywhere to write</div>}</div>
      </div>)}

      {eTab==="media"&&(<div>
        <div style={{display:"flex",gap:4,marginBottom:14}}>{VERSIONS.map(function(v2){var mk2="d"+day+"_v"+v2.id;var ms2=(media[mk2]||{}).mediaStatus||"no_media";var isC=v2.id===ver;return <div key={v2.id} onClick={function(){setVer(v2.id);}} style={{flex:1,background:isC?M_ST_C[ms2]+"18":"#fff",border:"1px solid "+(isC?M_ST_C[ms2]+"66":"#eeeef2"),borderRadius:10,padding:"8px 6px",textAlign:"center",cursor:"pointer"}}><div style={{fontSize:12,fontWeight:700,color:isC?"#222":"#999"}}>v{v2.short}</div><div style={{fontSize:10,color:M_ST_C[ms2],fontWeight:600,marginTop:2}}>{M_ST_L[ms2]}</div><div style={{display:"flex",justifyContent:"center",gap:3,marginTop:3}}>{(media[mk2]||{}).rawLink&&<span style={{width:8,height:8,borderRadius:"50%",background:"#f59e0b"}}/>}{(media[mk2]||{}).editedLink&&<span style={{width:8,height:8,borderRadius:"50%",background:"#3b82f6"}}/>}{(media[mk2]||{}).coverLink&&<span style={{width:8,height:8,borderRadius:"50%",background:"#a855f7"}}/>}</div></div>;})}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:16,fontWeight:800,color:"#2563eb"}}>Media v{ver.toUpperCase()}</span>
          <div style={{display:"flex",gap:6}}>
            <button onClick={function(){setShowMSC(!showMSC);}} style={{border:"none",borderRadius:10,padding:"7px 14px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer",background:M_ST_C[cm.mediaStatus||"no_media"]}}>{M_ST_L[cm.mediaStatus||"no_media"]}</button>
            <button onClick={function(){dlDay(day);}} style={{background:"#f0f0f4",border:"1px solid #d4d4db",borderRadius:10,padding:"7px 14px",fontSize:12,color:"#f97316",cursor:"pointer",fontWeight:600}}>Day{"\u2193"}</button>
          </div>
        </div>
        {showMSC&&<div style={{background:"#fff",border:"1px solid #d4d4db",borderRadius:12,padding:12,marginBottom:12}}>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{["no_media","raw_uploaded","in_editing","edited","final"].map(function(ms){return <button key={ms} onClick={function(){setMF("mediaStatus",ms);setShowMSC(false);flash(M_ST_L[ms]);}} style={{background:ms===(cm.mediaStatus||"no_media")?M_ST_C[ms]+"33":M_ST_C[ms]+"11",border:"2px solid "+(ms===(cm.mediaStatus||"no_media")?M_ST_C[ms]:M_ST_C[ms]+"44"),borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,color:M_ST_C[ms],cursor:"pointer"}}>{M_ST_L[ms]}</button>;})}</div>
          <button onClick={function(){setShowMSC(false);}} style={{width:"100%",marginTop:6,background:"none",border:"1px solid #eeeef2",borderRadius:8,padding:"4px",fontSize:11,color:"#999",cursor:"pointer"}}>Cancel</button>
        </div>}
        <div style={{marginBottom:12}}><span style={S.mL}>Script Doc <span style={{fontSize:11,color:"#aaa",fontWeight:400}}>(shared across all versions)</span></span><input type="text" value={(dc&&dc.scriptLink)||""} onChange={function(e){setMeta(day,"scriptLink",e.target.value);}} placeholder="Paste Google Doc or Drive link..." style={S.mI}/>{dc&&dc.scriptLink&&<a href={dc.scriptLink} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#2563eb",textDecoration:"none",marginTop:2,display:"inline-block"}}>Open {"\u2197"}</a>}{dc&&dc.scriptLink&&<div style={{marginTop:8}}><span style={{fontSize:12,fontWeight:600,color:"#888",display:"block",marginBottom:4}}>Platforms using this script:</span><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{REAL_PLATFORMS.map(function(rp){var on=(dc.scriptPlats||[]).indexOf(rp.id)!==-1;return <button key={rp.id} onClick={function(){togScriptPlat(rp.id);}} style={{background:on?rp.color+"18":"#f4f4f8",border:"1px solid "+(on?rp.color+"44":"#eeeef2"),borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,color:on?rp.color:"#bbb",cursor:"pointer"}}><i className={rp.icon} style={{marginRight:3,fontSize:10}}/>{rp.label}</button>;})}</div></div>}</div>
        <div style={{marginBottom:14,cursor:"pointer"}} onClick={function(){openEd("stephNotes");}}><span style={S.mL}>Steph Notes</span><button onClick={function(e){e.stopPropagation();openEd("stephNotes");}} style={Object.assign({},S.eBtn,{marginLeft:8})}>{cm.stephNotes?"Edit":"Write"}</button>{cm.stephNotes?<div style={{fontSize:13,color:"#444",background:"#f4f4f8",borderRadius:10,padding:10,marginTop:6,lineHeight:1.5}}>{cm.stephNotes}</div>:<div style={Object.assign({},S.tfE,{marginTop:6})}>Tap anywhere to write</div>}</div>
        <div style={{background:"#f4f4f8",border:"1px solid #eeeef2",borderRadius:12,padding:"10px 12px",marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:4}}>Media Flow</div>
          <div style={{fontSize:11,color:"#999",lineHeight:1.6}}>Robert films > uploads raw to Google Drive > Steph edits in Filmora > uploads to Filmora Cloud > marks ready > Robert reviews in Filmora > exports final to Google Drive</div>
        </div>
        <div style={{marginBottom:12}}><span style={S.mL}>Raw Video <span style={{fontSize:11,color:"#aaa",fontWeight:400}}>(Robert uploads to Google Drive)</span></span><input type="text" value={cm.rawLink||""} onChange={function(e){setMF("rawLink",e.target.value);}} placeholder="Paste Google Drive link or upload..." style={S.mI}/>{cm.rawLink&&<a href={cm.rawLink} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#2563eb",textDecoration:"none",marginTop:2,display:"inline-block"}}>Open {"\u2197"}</a>}<UploadBtn day={day} ver={ver} slot="unedited" accept="video/*" fileName={cm.rawFileName} fileSize={cm.rawFileSize} onUploaded={function(url,name,size){setMF("rawLink",url);setMF("rawFileName",name);setMF("rawFileSize",size);}} onDelete={function(){var path="d"+day+"/v"+ver+"/unedited."+(cm.rawFileName||"mp4").split(".").pop();_sb&&_sb.storage.from("media").remove([path]);setMF("rawLink","");setMF("rawFileName","");setMF("rawFileSize",0);flash("Deleted");}}/></div>
        <div style={{marginBottom:12}}><span style={S.mL}>Filmora Edit <span style={{fontSize:11,color:"#aaa",fontWeight:400}}>(Steph's edit, Filmora Cloud link)</span></span><input type="text" value={cm.editedLink||""} onChange={function(e){setMF("editedLink",e.target.value);}} placeholder="Paste Filmora Cloud or Drive link..." style={S.mI}/>{cm.editedLink&&<a href={cm.editedLink} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#2563eb",textDecoration:"none",marginTop:2,display:"inline-block"}}>Open {"\u2197"}</a>}<UploadBtn day={day} ver={ver} slot="edited_music" accept="video/*" fileName={cm.editedFileName} fileSize={cm.editedFileSize} onUploaded={function(url,name,size){setMF("editedLink",url);setMF("editedFileName",name);setMF("editedFileSize",size);}} onDelete={function(){var path="d"+day+"/v"+ver+"/edited_music."+(cm.editedFileName||"mp4").split(".").pop();_sb&&_sb.storage.from("media").remove([path]);setMF("editedLink","");setMF("editedFileName","");setMF("editedFileSize",0);flash("Deleted");}}/></div>
        <div style={{marginBottom:12}}><span style={S.mL}>No-Music Export <span style={{fontSize:11,color:"#aaa",fontWeight:400}}>(for platforms where Robert adds trending audio)</span></span><input type="text" value={cm.editedNoMusicLink||""} onChange={function(e){setMF("editedNoMusicLink",e.target.value);}} placeholder="Paste link or upload..." style={S.mI}/>{cm.editedNoMusicLink&&<a href={cm.editedNoMusicLink} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#2563eb",textDecoration:"none",marginTop:2,display:"inline-block"}}>Open {"\u2197"}</a>}<UploadBtn day={day} ver={ver} slot="edited_nomusic" accept="video/*" fileName={cm.editedNoMusicFileName} fileSize={cm.editedNoMusicFileSize} onUploaded={function(url,name,size){setMF("editedNoMusicLink",url);setMF("editedNoMusicFileName",name);setMF("editedNoMusicFileSize",size);}} onDelete={function(){var path="d"+day+"/v"+ver+"/edited_nomusic."+(cm.editedNoMusicFileName||"mp4").split(".").pop();_sb&&_sb.storage.from("media").remove([path]);setMF("editedNoMusicLink","");setMF("editedNoMusicFileName","");setMF("editedNoMusicFileSize",0);flash("Deleted");}}/></div>
        {(cm.editedLink||cm.editedNoMusicLink)&&<div style={{marginBottom:12}}>
        <div onClick={function(){setMF("stephReady",!cm.stephReady);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:cm.stephReady?"#a855f710":"#fff",border:"1px solid "+(cm.stephReady?"#a855f740":"#eeeef2"),borderRadius:14,cursor:"pointer",marginBottom:8}}>
          <div style={{width:24,height:24,borderRadius:8,border:"2px solid "+(cm.stephReady?"#a855f7":"#ccc"),background:cm.stephReady?"#a855f7":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{cm.stephReady&&<i className="fa-solid fa-check" style={{color:"#fff",fontSize:11}}/>}</div>
          <span style={{fontSize:13,fontWeight:600,color:cm.stephReady?"#a855f7":"#555"}}>Steph: Ready for Review</span>
        </div>
        <div onClick={function(){setMF("robertApproved",!cm.robertApproved);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:cm.robertApproved?"#f0fdf4":"#fff",border:"1px solid "+(cm.robertApproved?"#bbf7d0":"#eeeef2"),borderRadius:14,cursor:"pointer",marginBottom:cm.robertApproved?0:10}}>
          <div style={{width:24,height:24,borderRadius:8,border:"2px solid "+(cm.robertApproved?"#22c55e":"#ccc"),background:cm.robertApproved?"#22c55e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{cm.robertApproved&&<i className="fa-solid fa-check" style={{color:"#fff",fontSize:11}}/>}</div>
          <span style={{fontSize:13,fontWeight:600,color:cm.robertApproved?"#22c55e":"#555"}}>Robert: Approved</span>
          {cm.robertApproved&&<span style={{fontSize:11,color:"#999",marginLeft:"auto"}}>Ready for final export</span>}
        </div>
        {!cm.robertApproved&&<div>
          <div style={{marginBottom:12}}><span style={S.mL}>Final Export <span style={{fontSize:11,color:"#aaa",fontWeight:400}}>(Robert exports to Google Drive)</span></span><input type="text" value={cm.finalLink||""} onChange={function(e){setMF("finalLink",e.target.value);}} placeholder="Paste Google Drive link or upload..." style={S.mI}/>{cm.finalLink&&<a href={cm.finalLink} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#2563eb",textDecoration:"none",marginTop:2,display:"inline-block"}}>Open {"\u2197"}</a>}<UploadBtn day={day} ver={ver} slot="final_music" accept="video/*" fileName={cm.finalFileName} fileSize={cm.finalFileSize} onUploaded={function(url,name,size){setMF("finalLink",url);setMF("finalFileName",name);setMF("finalFileSize",size);}} onDelete={function(){var path="d"+day+"/v"+ver+"/final_music."+(cm.finalFileName||"mp4").split(".").pop();_sb&&_sb.storage.from("media").remove([path]);setMF("finalLink","");setMF("finalFileName","");setMF("finalFileSize",0);flash("Deleted");}}/></div>
        </div>}
        </div>}
        <div style={{marginBottom:12}}><span style={S.mL}>Cover Image</span><input type="text" value={cm.coverLink||""} onChange={function(e){setMF("coverLink",e.target.value);}} placeholder="Paste image link or upload below..." style={S.mI}/>{cm.coverLink&&isImgUrl(cm.coverLink)&&<div style={{marginTop:8,borderRadius:10,overflow:"hidden",border:"1px solid #d4d4db",maxWidth:200}}><img src={cm.coverLink} alt="Cover preview" style={{width:"100%",display:"block"}} onError={function(e){e.target.style.display="none";}}/></div>}{cm.coverLink&&!isImgUrl(cm.coverLink)&&<a href={cm.coverLink} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#2563eb",textDecoration:"none",marginTop:2,display:"inline-block"}}>Open {"\u2197"}</a>}<UploadBtn day={day} ver={ver} slot="cover" accept="image/*" fileName={cm.coverFileName} fileSize={cm.coverFileSize} onUploaded={function(url,name,size){setMF("coverLink",url);setMF("coverFileName",name);setMF("coverFileSize",size);}} onDelete={function(){var path="d"+day+"/v"+ver+"/cover."+(cm.coverFileName||"jpg").split(".").pop();_sb&&_sb.storage.from("media").remove([path]);setMF("coverLink","");setMF("coverFileName","");setMF("coverFileSize",0);flash("Deleted");}}/></div>
        <div style={{marginBottom:12}}><span style={S.mL}>B-Roll Links</span>{(cm.brollLinks||[]).map(function(bl,bi){return <div key={bi} style={{display:"flex",gap:6,marginBottom:4}}><input type="text" value={bl} onChange={function(e){setMd(function(p){var o=Object.assign({},p);o[vK]=Object.assign({},o[vK]||{});var arr=(o[vK].brollLinks||[]).slice();arr[bi]=e.target.value;o[vK].brollLinks=arr;return o;});}} style={Object.assign({},S.mI,{flex:1})}/><button onClick={function(){setMd(function(p){var o=Object.assign({},p);o[vK]=Object.assign({},o[vK]||{});var arr=(o[vK].brollLinks||[]).slice();arr.splice(bi,1);o[vK].brollLinks=arr;return o;});}} style={{background:"none",border:"none",color:"#ef4444",fontSize:16,cursor:"pointer",padding:"0 6px"}}>{"\u2715"}</button></div>;})}<div style={{display:"flex",gap:6}}><input type="text" placeholder="Add B-roll link..." style={Object.assign({},S.mI,{flex:1})} onKeyDown={function(e){if(e.key==="Enter"&&e.target.value){setMd(function(p){var o=Object.assign({},p);o[vK]=Object.assign({},o[vK]||{});o[vK].brollLinks=(o[vK].brollLinks||[]).concat([e.target.value]);return o;});e.target.value="";}}} id="brollInput"/><button onClick={function(){var inp=document.getElementById("brollInput");if(inp&&inp.value){setMd(function(p){var o=Object.assign({},p);o[vK]=Object.assign({},o[vK]||{});o[vK].brollLinks=(o[vK].brollLinks||[]).concat([inp.value]);return o;});inp.value="";}}} style={{background:"#f97316",border:"none",borderRadius:10,padding:"10px 16px",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer",flexShrink:0}}>Add</button></div></div>
      </div>)}

      </div>}

      <div style={{borderTop:"1px solid #eeeef2",paddingTop:16,marginTop:16}}>
        {!showDelDay?<button onClick={function(){setShowDelDay(true);}} style={{width:"100%",background:"#fff",border:"1px solid #ef444440",borderRadius:12,padding:"10px",fontSize:13,color:"#ef4444",cursor:"pointer",fontWeight:600}}>Delete Day {day}</button>
        :<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:14,padding:14}}>
          <div style={{fontSize:13,fontWeight:700,color:"#dc2626",marginBottom:8}}>Delete all content for Day {day}?</div>
          <div style={{fontSize:12,color:"#999",marginBottom:12}}>This removes topic title, captions, checklists, statuses, media links, and notes for all platforms and versions. Cannot be undone.</div>
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
    {toast&&<div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:"#22c55e",color:"#fff",padding:"10px 24px",borderRadius:14,fontSize:15,fontWeight:700,zIndex:300,boxShadow:"0 4px 20px #00000066"}}>{toast}</div>}
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
  togB: { background: "#fff", border: "1px solid #eeeef2", borderRadius: 12, padding: "8px 22px", fontSize: 15, color: "#999", cursor: "pointer", fontWeight: 700 },
  togA: { background: "#f9731618", border: "1px solid #f97316", borderRadius: 12, padding: "8px 22px", fontSize: 15, color: "#f97316", cursor: "pointer", fontWeight: 700 },
  tf: { marginBottom: 16, padding: "14px 16px", background: "#fff", borderRadius: 16, border: "1px solid #eeeef2", transition: "border-color 0.15s", boxShadow: "0 1px 4px #00000006" },
  tfH: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  tfL: { fontSize: 14, fontWeight: 700, color: "#444" },
  tfHi: { fontSize: 12, color: "#aaa", marginBottom: 8 },
  tfV: { fontSize: 15, color: "#2d2d3d", lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word" },
  tfE: { fontSize: 14, color: "#bbb", fontStyle: "italic" },
  eBtn: { background: "#f0f0f4", border: "1px solid #d4d4db", borderRadius: 10, padding: "5px 14px", fontSize: 12, color: "#777", cursor: "pointer", fontWeight: 600, transition: "all 0.15s" },
  mL: { fontSize: 14, fontWeight: 700, color: "#444", display: "block", marginBottom: 6 },
  mI: { background: "#fff", border: "1px solid #d4d4db", borderRadius: 12, color: "#333", padding: "10px 14px", fontSize: 15, width: "100%", boxSizing: "border-box", transition: "border-color 0.15s" },
  refSec: { marginBottom: 24 },
  refT: { fontSize: 15, fontWeight: 800, color: "#f97316", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #eeeef2" },
  refR: { display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid #f4f4f8" },
  refTy: { fontSize: 13, fontWeight: 700, color: "#444", minWidth: 80 },
};

var root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
